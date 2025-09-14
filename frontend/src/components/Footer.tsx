
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Github, Mail,  Send,  Linkedin, Heart, Car } from "lucide-react"

export default function Footer() {


  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gradient">Butaq AI</h2>
            <p className="mb-6 text-muted-foreground">
              Революционное решение для автоматической оценки состояния автомобилей в inDrive.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Ваш email для новостей"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Подписаться</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Навигация</h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block transition-colors hover:text-primary">
                Главная
              </a>
              <a href="/demo" className="block transition-colors hover:text-primary">
                Демо
              </a>
              <a href="#" className="block transition-colors hover:text-primary">
                О технологии
              </a>
              <a href="#" className="block transition-colors hover:text-primary">
                AI-анализ
              </a>
              <a href="#" className="block transition-colors hover:text-primary">
                Контакты
              </a>
            </nav>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Технологии</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                PyTorch & OpenCV
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                FastAPI & Docker
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                React & TypeScript
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Azure OpenAI
              </div>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Команда</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Наш GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>team@indrive-ai.com</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>LinkedIn команды</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
          
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Car className="w-4 h-4" />
            <span className="text-sm">
              Создано для
            </span>
            <span className="font-semibold text-primary">
              inDrive Decentathon 2025
            </span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Политика конфиденциальности
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Условия использования
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              AI Ethics
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
