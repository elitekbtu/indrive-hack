import { Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-indrive-green-800/30 bg-indrive-black-950/50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">
              AI Car Quality Control
            </h3>
            <p className="text-indrive-green-200 mb-4 max-w-md">
              Революционное решение для автоматической оценки состояния автомобилей. 
              Повышаем безопасность и качество сервиса для всех участников платформы inDrive.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="mailto:team@example.com" 
                className="flex items-center gap-2 text-indrive-green-400 hover:text-indrive-green-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">team@example.com</span>
              </a>
              <a 
                href="https://github.com" 
                className="flex items-center gap-2 text-indrive-green-400 hover:text-indrive-green-300 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-white mb-4">Технологии</h4>
            <ul className="space-y-2 text-sm text-indrive-green-200">
              <li>• PyTorch & TensorFlow</li>
              <li>• Computer Vision</li>
              <li>• React & TypeScript</li>
              <li>• TailwindCSS</li>
              <li>• Docker & Kubernetes</li>
            </ul>
          </div>
        </div>

        {/* Team Credits */}
        <div className="border-t border-indrive-green-800/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-indrive-green-300">
              <span className="text-sm">
                Создано командой для
              </span>
              <span className="font-semibold text-indrive-green-400">
                inDrive Decentrathon 2025
              </span>
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            
            <div className="text-sm text-indrive-green-400">
              © 2025 AI Car Quality Control. Все права защищены.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
