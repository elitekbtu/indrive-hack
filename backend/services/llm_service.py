"""
LLM Service for generating comprehensive car condition reports
using Azure OpenAI GPT-4 to transform technical analysis into business insights
"""

import os
import json
from typing import Dict, Any
from openai import AzureOpenAI
from dotenv import load_dotenv
import httpx

# Load environment variables
load_dotenv()

class CarAnalysisLLMService:
    def __init__(self):
        try:
            # Create a custom HTTP client to handle the proxies compatibility issue
            class CustomHTTPClient(httpx.Client):
                def __init__(self, *args, **kwargs):
                    kwargs.pop("proxies", None)  # Remove the 'proxies' argument if present
                    super().__init__(*args, **kwargs)
            
            # Initialize Azure OpenAI client with custom HTTP client
            self.client = AzureOpenAI(
                api_key=os.getenv("AZURE_OPENAI_API_KEY"),
                api_version="2024-02-15-preview",
                azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
                http_client=CustomHTTPClient()
            )
            self.deployment_name = os.getenv("AZURE_OPENAI_GPT4O_DEPLOYMENT_NAME", "gpt-4o")
            self.available = True
        except Exception as e:
            print(f"Warning: LLM service initialization failed: {e}")
            print("LLM features will be disabled, but core analysis will work")
            self.client = None
            self.deployment_name = None
            self.available = False
    
    def generate_comprehensive_report(self, technical_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive reports for different stakeholders based on technical analysis
        """
        # Calculate condition score first (always works)
        condition_score = self._calculate_condition_score(technical_analysis)
        
        if not self.available or not self.client:
            # Fallback when LLM is not available
            return {
                "condition_score": condition_score,
                "driver_report": self._generate_fallback_driver_report(technical_analysis),
                "passenger_report": self._generate_fallback_passenger_report(technical_analysis),
                "business_report": self._generate_fallback_business_report(technical_analysis),
                "recommendations": self._generate_fallback_recommendations(technical_analysis, condition_score)
            }
        
        try:
            # Prepare context for LLM
            analysis_context = self._prepare_analysis_context(technical_analysis)
            
            # Generate reports for different stakeholders
            driver_report = self._generate_driver_report(analysis_context)
            passenger_report = self._generate_passenger_report(analysis_context)
            business_report = self._generate_business_report(analysis_context)
            
            return {
                "condition_score": condition_score,
                "driver_report": driver_report,
                "passenger_report": passenger_report,
                "business_report": business_report,
                "recommendations": self._generate_recommendations(analysis_context, condition_score)
            }
        
        except Exception as e:
            # Fallback on error
            return {
                "error": f"LLM service error: {str(e)}",
                "condition_score": condition_score,
                "driver_report": self._generate_fallback_driver_report(technical_analysis),
                "passenger_report": self._generate_fallback_passenger_report(technical_analysis),
                "business_report": self._generate_fallback_business_report(technical_analysis),
                "recommendations": self._generate_fallback_recommendations(technical_analysis, condition_score)
            }
    
    def _prepare_analysis_context(self, analysis: Dict[str, Any]) -> str:
        """Prepare comprehensive context for LLM analysis using ALL model data"""
        is_damaged = analysis.get("is_damaged", False)
        damage_local = analysis.get("damage_local", {})
        damage_parts = analysis.get("damage_parts_local", {})
        rust_scratch = analysis.get("rust_scratch", {})
        dirty = analysis.get("dirty", {})
        
        # Build comprehensive context
        context = f"""
        ДЕТАЛЬНЫЙ АНАЛИЗ СОСТОЯНИЯ АВТОМОБИЛЯ:
        
        === ОБЩЕЕ СОСТОЯНИЕ ===
        Статус повреждений: {"ПОВРЕЖДЕНИЯ ОБНАРУЖЕНЫ" if is_damaged else "АВТОМОБИЛЬ ЦЕЛЫЙ"}
        Источник анализа: {analysis.get("damage_source", "local")}
        
        """
        
        # Add damage detection details with confidence
        if damage_local:
            damage_confidence = damage_local.get("damage_prob", 0) * 100
            context += f"""=== АНАЛИЗ ПОВРЕЖДЕНИЙ ===
            Уверенность в повреждениях: {damage_confidence:.1f}%
            Индекс предсказания: {damage_local.get("pred_idx", "N/A")}
            Вероятности классов: {damage_local.get("probs", [])}
            
            """
        
        # Add specific damage parts analysis
        if damage_parts and is_damaged:
            parts_confidence = damage_parts.get("pred_score", 0) * 100
            damaged_part = damage_parts.get("pred_label", "неизвестно")
            
            # Parse the damage part label for better understanding
            part_details = self._parse_damage_part_label(damaged_part)
            
            context += f"""=== ЛОКАЛИЗАЦИЯ ПОВРЕЖДЕНИЙ ===
            Поврежденная часть: {part_details['part_name']}
            Тип повреждения: {part_details['damage_type']}
            Уверенность: {parts_confidence:.1f}%
            Индекс части: {damage_parts.get("pred_idx", "N/A")}
            Все вероятности частей: {damage_parts.get("probs", [])}
            
            """
        
        # Add damage type classification (rust/scratch/dent)
        if rust_scratch and is_damaged:
            scratch_confidence = rust_scratch.get("pred_score", 0) * 100
            damage_type = rust_scratch.get("pred_label", "неизвестно")
            
            context += f"""=== КЛАССИФИКАЦИЯ ТИПА ПОВРЕЖДЕНИЯ ===
            Тип повреждения: {self._translate_damage_type(damage_type)}
            Уверенность: {scratch_confidence:.1f}%
            Индекс типа: {rust_scratch.get("pred_idx", "N/A")}
            Все вероятности типов: {rust_scratch.get("probs", [])}
            
            """
        
        # Add cleanliness analysis (only if no damage)
        if dirty and not is_damaged:
            clean_prob = dirty.get("clean_prob", 0) * 100
            dirty_prob = dirty.get("dirty_prob", 0) * 100
            
            context += f"""=== АНАЛИЗ ЧИСТОТЫ ===
            Вероятность чистоты: {clean_prob:.1f}%
            Вероятность загрязнения: {dirty_prob:.1f}%
            Статус: {"ЗАГРЯЗНЕН" if dirty_prob > clean_prob else "ЧИСТЫЙ"}
            
            """
        
        # Add confidence interpretation
        context += self._add_confidence_interpretation(analysis)
        
        return context
    
    def _parse_damage_part_label(self, label: str) -> Dict[str, str]:
        """Parse damage part label like 'doorouter-dent' into readable format"""
        if not label or label == "неизвестно":
            return {"part_name": "Неопределенная часть", "damage_type": "общее повреждение"}
        
        # Common part mappings
        part_mapping = {
            "door": "Дверь",
            "doorouter": "Внешняя панель двери", 
            "bumper": "Бампер",
            "hood": "Капот",
            "trunk": "Багажник",
            "fender": "Крыло",
            "headlight": "Фара",
            "taillight": "Задний фонарь",
            "mirror": "Зеркало",
            "wheel": "Колесо",
            "windshield": "Лобовое стекло"
        }
        
        # Damage type mappings
        damage_mapping = {
            "dent": "вмятина",
            "scratch": "царапина", 
            "rust": "ржавчина",
            "crack": "трещина",
            "broken": "повреждение"
        }
        
        # Parse the label
        parts = label.lower().split("-")
        
        # Find part name
        part_name = "Неопределенная часть"
        for key, value in part_mapping.items():
            if any(key in part for part in parts):
                part_name = value
                break
        
        # Find damage type
        damage_type = "общее повреждение"
        for key, value in damage_mapping.items():
            if any(key in part for part in parts):
                damage_type = value
                break
        
        return {"part_name": part_name, "damage_type": damage_type}
    
    def _translate_damage_type(self, damage_type: str) -> str:
        """Translate damage type to Russian"""
        mapping = {
            "scratch": "Царапина",
            "dent": "Вмятина", 
            "rust": "Ржавчина",
            "car": "Общее повреждение кузова",
            "bumper": "Повреждение бампера"
        }
        return mapping.get(damage_type.lower(), damage_type)
    
    def _add_confidence_interpretation(self, analysis: Dict[str, Any]) -> str:
        """Add interpretation of confidence levels for all predictions"""
        interpretation = "\n=== ИНТЕРПРЕТАЦИЯ УВЕРЕННОСТИ МОДЕЛЕЙ ===\n"
        
        # Damage detection confidence
        damage_local = analysis.get("damage_local", {})
        if damage_local:
            damage_conf = damage_local.get("damage_prob", 0) * 100
            if damage_conf > 95:
                interpretation += f"🔴 КРИТИЧЕСКИ ВЫСОКАЯ уверенность в повреждениях ({damage_conf:.1f}%)\n"
            elif damage_conf > 80:
                interpretation += f"🟡 ВЫСОКАЯ уверенность в повреждениях ({damage_conf:.1f}%)\n"
            elif damage_conf > 60:
                interpretation += f"🟠 СРЕДНЯЯ уверенность в повреждениях ({damage_conf:.1f}%)\n"
            else:
                interpretation += f"🟢 НИЗКАЯ уверенность в повреждениях ({damage_conf:.1f}%)\n"
        
        # Parts detection confidence
        damage_parts = analysis.get("damage_parts_local", {})
        if damage_parts:
            parts_conf = damage_parts.get("pred_score", 0) * 100
            interpretation += f"📍 Локализация повреждения: {parts_conf:.1f}% уверенности\n"
        
        # Type classification confidence  
        rust_scratch = analysis.get("rust_scratch", {})
        if rust_scratch:
            type_conf = rust_scratch.get("pred_score", 0) * 100
            interpretation += f"🔍 Классификация типа: {type_conf:.1f}% уверенности\n"
        
        return interpretation
    
    def _generate_driver_report(self, context: str) -> str:
        """Generate empowering report for driver rating optimization using detailed analysis"""
        prompt = f"""
        Ты - ПЕРСОНАЛЬНЫЙ AI-КОНСУЛЬТАНТ водителя inDrive по заработку. Используй ДЕТАЛЬНЫЕ данные анализа.

        {context}

        На основе КОНКРЕТНЫХ данных анализа создай персонализированный отчет:

        1. ТОЧНАЯ ДИАГНОСТИКА (на основе confidence scores):
        - Если уверенность >95%: "КРИТИЧНО: обнаружена [конкретная часть] с [тип повреждения]"
        - Если уверенность 80-95%: "ВНИМАНИЕ: вероятно [конкретная часть] имеет [тип повреждения]" 
        - Если уверенность 60-80%: "ПРОВЕРЬТЕ: возможны проблемы с [конкретная часть]"

        2. ВЛИЯНИЕ НА ЗАРАБОТОК (конкретные цифры):
        - Царапины на двери: "� Устранение повысит заработок на 12-18%"
        - Вмятины на бампере: "💰 Ремонт увеличит количество заказов на 25%"
        - Ржавчина: "⚠️ Критично! Снижает доход на 40% и рейтинг"

        3. КОНКРЕТНЫЙ ПЛАН ДЕЙСТВИЙ:
        - Точное название поврежденной части
        - Рекомендуемый тип ремонта
        - Ожидаемая стоимость (примерная)
        - Срок окупаемости

        4. ЗАЩИТА ОТ ПРЕТЕНЗИЙ:
        - "📸 Задокументируйте текущее состояние [конкретной части]"
        - "🛡️ Это защитит от ложных претензий пассажиров"

        Используй ТОЧНЫЕ данные из анализа: части автомобиля, типы повреждений, проценты уверенности.
        Тон: опытный наставник, который знает каждую деталь твоего автомобиля.
        Объем: до 150 слов.
        """
        
        response = self.client.chat.completions.create(
            model=self.deployment_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=350,
            temperature=0.6
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_passenger_report(self, context: str) -> str:
        """Generate trust-building report for passenger safety and comfort"""
        prompt = f"""
        Ты - AI-система безопасности inDrive. Создай краткий, но убедительный отчет для ПАССАЖИРА перед поездкой.

        {context}

        Создай отчет в стиле "Verified by inDrive AI", который включает:

        1. СТАТУС БЕЗОПАСНОСТИ (одна строка):
        - Если нет повреждений: "✅ Автомобиль проверен и безопасен для поездки"
        - Если есть незначительные повреждения: "⚠️ Обнаружены незначительные повреждения. Безопасность не нарушена"
        - Если серьезные повреждения: "🔍 Требуется дополнительная проверка автомобиля"

        2. КРАТКОЕ ОБЪЯСНЕНИЕ (1-2 предложения о том, что проверено)

        3. БАДЖ ДОВЕРИЯ (если подходит):
        - "Verified Clean & Intact" 
        - "Minor Issues Disclosed"
        - "Safety Verified"

        Тон: профессиональный, заботливый, вызывающий доверие.
        Формат: как уведомление в приложении для пассажира.
        Объем: до 80 слов.
        """
        
        response = self.client.chat.completions.create(
            model=self.deployment_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_business_report(self, context: str) -> str:
        """Generate strategic business report for management using precise technical data"""
        prompt = f"""
        Ты - ВЕДУЩИЙ АНАЛИТИК inDrive по качеству автопарка. Используй ТОЧНЫЕ технические данные.

        {context}

        Создай стратегический отчет для бизнеса на основе КОНКРЕТНЫХ метрик:

        1. ТЕХНИЧЕСКАЯ ОЦЕНКА (используй точные confidence scores):
        - Если confidence >95%: "ПОДТВЕРЖДЕНО: [конкретная часть] - [тип повреждения]"
        - Если 80-95%: "ВЫСОКАЯ ВЕРОЯТНОСТЬ: проблемы с [конкретная часть]"
        - Если 60-80%: "ТРЕБУЕТ ПРОВЕРКИ: [конкретная часть]"

        2. БИЗНЕС-МЕТРИКИ (конкретные показатели):
        - Критические повреждения: "� Риск претензий +65%, снижение bookings -40%"
        - Царапины/вмятины: "🟡 Potential reputation risk, customer satisfaction -15%"
        - Чистота: "🟢 Driver cleanliness score: [процент]/100"

        3. ОПЕРАЦИОННЫЕ РЕКОМЕНДАЦИИ:
        - Блокировка водителя (если критично)
        - Предупреждение с планом ремонта
        - Премиум статус (если отлично)

        4. ROI АНАЛИЗ:
        - Стоимость ремонта vs потеря репутации
        - Customer lifetime value impact
        - Driver retention metrics

        Используй ТОЧНЫЕ данные анализа: конкретные части, типы повреждений, проценты уверенности.
        Тон: профессиональный стратегический аналитик.
        Объем: до 180 слов.
        """
        
        response = self.client.chat.completions.create(
            model=self.deployment_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.4
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_recommendations(self, context: str, score: int) -> list:
        """Generate highly specific, actionable recommendations"""
        prompt = f"""
        На основе анализа автомобиля (оценка {score}/100) создай конкретные рекомендации в формате JSON.

        {context}

        Создай 3-4 СУПЕР-КОНКРЕТНЫЕ рекомендации для улучшения:

        Для водителя:
        - Если грязный: "Мойка автомобиля в течение 24 часов" + "Увеличит заработок на 15%"
        - Если царапины: "Полировка кузова в автосервисе" + "Защитит от ложных претензий"
        - Если вмятины: "Рихтовка в сертифицированном центре" + "Восстановит премиум-статус"

        Для inDrive:
        - Автоматический флаг качества
        - Уведомление водителя
        - Мониторинг изменений

        Формат JSON:
        [
          {{
            "action": "Конкретное действие",
            "impact": "Измеримый результат",
            "priority": "высокий/средний/низкий",
            "stakeholder": "driver/passenger/indrive",
            "timeline": "срочно/1-3 дня/неделя",
            "cost_benefit": "экономический эффект"
          }}
        ]

        Только JSON массив, без дополнительного текста.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.4
            )
            
            recommendations_text = response.choices[0].message.content.strip()
            # Try to parse JSON, fallback to structured recommendations if fails
            try:
                import json
                return json.loads(recommendations_text)
            except:
                # Fallback to enhanced structured recommendations
                return self._generate_enhanced_fallback_recommendations(context, score)
        except:
            return self._generate_enhanced_fallback_recommendations(context, score)
    
    def _calculate_condition_score(self, analysis: Dict[str, Any]) -> int:
        """Calculate overall car condition score (0-100)"""
        score = 100
        
        # Damage penalty
        if analysis.get("is_damaged", False):
            damage_parts = analysis.get("damage_parts_local", {})
            rust_scratch = analysis.get("rust_scratch", {})
            
            # Base damage penalty
            score -= 40
            
            # Additional penalties based on damage type
            if rust_scratch and "pred_label" in rust_scratch:
                damage_type = rust_scratch["pred_label"].lower()
                if "rust" in damage_type:
                    score -= 15  # Rust is serious
                elif "dent" in damage_type:
                    score -= 10  # Dents affect appearance
                elif "scratch" in damage_type:
                    score -= 5   # Scratches are cosmetic
        
        # Cleanliness penalty
        dirty_result = analysis.get("dirty", {})
        if dirty_result:
            dirty_prob = dirty_result.get("dirty_prob", 0)
            clean_prob = dirty_result.get("clean_prob", 1)
            
            if dirty_prob > clean_prob:
                # Scale penalty based on confidence
                cleanliness_penalty = int(20 * dirty_prob)
                score -= cleanliness_penalty
        
        # Ensure score is within bounds
        return max(0, min(100, score))

    def _generate_enhanced_fallback_recommendations(self, context: str, score: int) -> list:
        """Generate enhanced fallback recommendations based on analysis"""
        recommendations = []
        
        # Parse the context to understand the issues
        is_damaged = "повреждены" in context.lower() or "обнаружены" in context.lower()
        is_dirty = "загрязнен" in context.lower() or "грязный" in context.lower()
        
        if is_damaged:
            if "царапины" in context.lower() or "scratch" in context.lower():
                recommendations.append({
                    "action": "Полировка кузова для устранения царапин",
                    "impact": "Увеличение стоимости автомобиля на 5-8%, защита от претензий",
                    "priority": "средний",
                    "stakeholder": "driver",
                    "timeline": "1-3 дня",
                    "cost_benefit": "Стоимость: 3000-5000₽, прибыль: +15% заказов"
                })
            if "вмятин" in context.lower() or "dent" in context.lower():
                recommendations.append({
                    "action": "Рихтовка кузова в сертифицированном центре",
                    "impact": "Восстановление премиум-статуса, страховая защита",
                    "priority": "высокий",
                    "stakeholder": "driver",
                    "timeline": "срочно",
                    "cost_benefit": "ROI: 300% за 6 месяцев"
                })
        
        if is_dirty:
            recommendations.append({
                "action": "Комплексная мойка автомобиля",
                "impact": "Повышение рейтинга на 0.3-0.5 звезд, +15% заказов",
                "priority": "высокий",
                "stakeholder": "driver", 
                "timeline": "24 часа",
                "cost_benefit": "Стоимость: 800₽, дополнительный доход: +2000₽/неделя"
            })
        
        # Business recommendations
        if score < 80:
            recommendations.append({
                "action": "Автоматическое уведомление водителя через приложение",
                "impact": "Проактивное улучшение качества флота",
                "priority": "средний",
                "stakeholder": "indrive",
                "timeline": "немедленно",
                "cost_benefit": "Снижение операционных расходов на 25%"
            })
        
        # Always add quality monitoring
        recommendations.append({
            "action": "Включение в систему мониторинга качества",
            "impact": "Предотвращение жалоб пассажиров, автоматизация QA",
            "priority": "средний",
            "stakeholder": "indrive",
            "timeline": "постоянно",
            "cost_benefit": "Экономия на ручных проверках: 60% времени менеджеров"
        })
        
        return recommendations[:4]  # Return max 4 recommendations

    def _generate_fallback_driver_report(self, analysis: Dict[str, Any]) -> str:
        """Generate basic driver report without LLM"""
        is_damaged = analysis.get("is_damaged", False)
        score = self._calculate_condition_score(analysis)
        
        if is_damaged:
            return f"🔧 Обнаружены повреждения автомобиля (оценка: {score}/100). Рекомендуется устранить выявленные проблемы для повышения рейтинга и безопасности пассажиров. Качественное состояние автомобиля напрямую влияет на ваши заработки в inDrive."
        else:
            return f"✅ Автомобиль в хорошем состоянии (оценка: {score}/100). Поддерживайте чистоту и исправность для максимальных заработков. Пассажиры ценят качественный сервис!"

    def _generate_fallback_passenger_report(self, analysis: Dict[str, Any]) -> str:
        """Generate basic passenger report without LLM"""
        is_damaged = analysis.get("is_damaged", False)
        score = self._calculate_condition_score(analysis)
        
        if is_damaged:
            return f"⚠️ Обнаружены повреждения автомобиля. Общая оценка: {score}/100. Рекомендуется обратить внимание водителя на состояние транспортного средства."
        else:
            return f"✅ Автомобиль прошел проверку состояния. Оценка: {score}/100. Поездка должна быть комфортной и безопасной."

    def _generate_fallback_business_report(self, analysis: Dict[str, Any]) -> str:
        """Generate basic business report without LLM"""
        is_damaged = analysis.get("is_damaged", False)
        score = self._calculate_condition_score(analysis)
        
        if score < 70:
            return f"📊 Требуется внимание: оценка состояния {score}/100. Рекомендуется работа с водителем по улучшению качества автомобиля для повышения стандартов сервиса inDrive."
        else:
            return f"📈 Хорошее качество сервиса: оценка {score}/100. Автомобиль соответствует стандартам inDrive и способствует положительному опыту пассажиров."

    def _generate_fallback_recommendations(self, analysis: Dict[str, Any], score: int) -> list:
        """Generate basic recommendations without LLM"""
        recommendations = []
        
        if analysis.get("is_damaged", False):
            recommendations.append({
                "action": "Устранить повреждения автомобиля",
                "impact": "Повышение безопасности и рейтинга водителя",
                "priority": "высокий"
            })
        
        dirty_result = analysis.get("dirty", {})
        if dirty_result and dirty_result.get("dirty_prob", 0) > 0.5:
            recommendations.append({
                "action": "Провести чистку автомобиля",
                "impact": "Улучшение комфорта пассажиров",
                "priority": "средний"
            })
        
        if score < 80:
            recommendations.append({
                "action": "Общий осмотр и техническое обслуживание",
                "impact": "Поддержание высоких стандартов качества",
                "priority": "средний" if score > 60 else "высокий"
            })
        
        return recommendations

# Global instance
llm_service = CarAnalysisLLMService()