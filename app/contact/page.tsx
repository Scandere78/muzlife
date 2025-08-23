import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import Image from 'next/image';
import { 
  Mail, 
  MessageSquare, 
  Bug, 
  Handshake, 
  HelpCircle,
  Clock,
  Star,
  Heart,
  Shield
} from 'lucide-react';

export default function ContactPage() {
  const categories = [
    { value: 'bug', label: 'Signaler un bug', icon: Bug, description: 'Rapportez un problème technique' },
    { value: 'feature', label: 'Demande de fonctionnalité', icon: HelpCircle, description: 'Suggérez une amélioration' },
    { value: 'partnership', label: 'Partenariat', icon: Handshake, description: 'Collaborons ensemble' },
    { value: 'support', label: 'Support technique', icon: MessageSquare, description: 'Besoin d\'aide technique' },
    { value: 'other', label: 'Autre demande', icon: Mail, description: 'Toute autre question' }
  ];

  return (
    <div className="py-12 min-h-screen navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      {/* Background avec motifs islamiques */}
      <div className="bg-transparent">
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 ">
        {/* Header avec style islamique */}
        <div className="text-center mb-16 relative">
          {/* Titre principal */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/30 mb-6">
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4 relative">
              نَحْنُ هُنَا لَكُمْ
              <span className="block text-3xl md:text-4xl mt-2 text-gray-700 dark:text-gray-300 font-light">
                Nous sommes là pour vous
              </span>
            </h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold">
                <Heart className="h-5 w-5" />
                Bienvenue dans votre espace de communication
              </span>
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Que ce soit pour une question, un problème technique, ou une idée de partenariat, 
              notre équipe dévouée est à votre écoute pour vous accompagner dans votre parcours spirituel.
            </p>
            
            {/* Badge de confiance */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-emerald-200/50 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Réponse sous 24h</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-emerald-200/50 backdrop-blur-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Support premium</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Informations de contact - Style amélioré */}
          <div className="lg:col-span-1 space-y-6">
            {/* Carte principale */}
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative">
                  <CardTitle className="flex items-center gap-3 text-lg font-bold">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Mail className="h-6 w-6" />
                    </div>
                    Informations de contact
                  </CardTitle>
                  <CardDescription className="text-emerald-50 mt-2">
                    Notre équipe vous accompagne 24h/7j
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Email professionnel</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">contact@muzlife.fr</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Réponse garantie sous 24h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border border-teal-100 dark:border-teal-800">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Disponibilité</p>
                    <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">7 jours / 7 - 24h / 24h</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Support continu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Types de demandes - Style amélioré */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                  Types de demandes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Choisissez la catégorie qui correspond à votre besoin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const colors = [
                    'from-red-50 to-pink-50 border-red-100 dark:from-red-900/10 dark:to-pink-900/10 dark:border-red-800',
                    'from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-800',
                    'from-green-50 to-emerald-50 border-green-100 dark:from-green-900/10 dark:to-emerald-900/10 dark:border-green-800',
                    'from-yellow-50 to-orange-50 border-yellow-100 dark:from-yellow-900/10 dark:to-orange-900/10 dark:border-yellow-800',
                    'from-purple-50 to-pink-50 border-purple-100 dark:from-purple-900/10 dark:to-pink-900/10 dark:border-purple-800'
                  ];
                  const iconColors = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600'];
                  
                  return (
                    <div key={category.value} className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${colors[index]} border transition-all duration-300 hover:scale-105 hover:shadow-md`}>
                      <div className="flex-shrink-0">
                        <Icon className={`h-6 w-6 ${iconColors[index]}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{category.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact - Style amélioré */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border-b border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Envoyez-nous un message
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                      Remplissez ce formulaire et nous vous répondrons rapidement ✨
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Info - Style amélioré */}
        <div className="mt-16 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5"></div>
            <div className="absolute top-4 right-4 opacity-20">
              <Image 
                src="/caligraphie.png" 
                alt="Calligraphie" 
                width={80} 
                height={80}
                className="transform rotate-12"
              />
            </div>
            <CardContent className="p-8 relative">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Heart className="h-6 w-6 text-red-200 animate-pulse" />
                  <h3 className="text-2xl font-bold">Nous sommes là pour vous aider</h3>
                  <Heart className="h-6 w-6 text-red-200 animate-pulse" />
                </div>
                <p className="text-emerald-50 text-lg leading-relaxed">
                  Chez MuzLife, votre satisfaction et votre parcours spirituel sont notre priorité absolue. 
                  Notre équipe dévouée s&apos;engage à vous répondre dans les plus brefs délais avec 
                  professionnalisme et bienveillance.
                </p>
                <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Confidentialité garantie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Support premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Équipe bienveillante</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
