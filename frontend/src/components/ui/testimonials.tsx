export default function TestimonialSection() {
    return (
        <section>
            <div className="py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <blockquote className="before:bg-primary relative max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
                        <p className="text-foreground text-lg">Использование наших собственных AI-моделей позволяет обеспечить высочайший уровень безопасности и точности анализа. Мы не используем готовые решения и не загружаем фотографии пользователей в сторонние LLM сервисы для анализа фотографий.</p>
                        <footer className="mt-4 flex items-center gap-2">
                            <cite>Butaq Team</cite>
                            <span
                                aria-hidden
                                className="bg-foreground/15 size-1 rounded-full"></span>
                            <span className="text-muted-foreground">inDrive Decentathon 2025</span>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </section>
    )
}
