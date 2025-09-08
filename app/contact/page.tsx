import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Phone, MapPin, Clock, Bug, HelpCircle, Handshake, Heart } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "contact@muzlife.fr",
      description: "Nous répondons sous 24h"
    },
    {
      icon: MessageSquare,
      title: "Support",
      details: "Chat en direct",
      description: "Disponible 24h/7j"
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: "+33 1 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: "Paris, France",
      description: "Siège social"
    }
  ];

  const categories = [
    {
      icon: Bug,
      title: "Signaler un bug",
      description: "Problème technique ou dysfonctionnement",
      color: "text-red-600 dark:text-red-400"
    },
    {
      icon: HelpCircle,
      title: "Demande de fonctionnalité",
      description: "Suggestion d'amélioration ou nouvelle feature",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Handshake,
      title: "Partenariat",
      description: "Proposition de collaboration",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Heart,
      title: "Support technique",
      description: "Aide pour utiliser l'application",
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: 'url(/caligraphie.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Une question, une suggestion ou besoin d'aide ? Notre équipe MuzLife est là pour vous accompagner dans votre parcours spirituel.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Contact */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    Informations de contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium">{item.details}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    Types de demandes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className={`h-5 w-5 ${category.color}`} />
                          <h4 className="font-semibold text-slate-900 dark:text-white">{category.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{category.description}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm dark:bg-slate-800/95 hover:shadow-3xl transition-all duration-500">
                <CardHeader className="pb-8">
                  <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Envoyez-nous un message</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal mt-1">
                        Nous vous répondrons dans les plus brefs délais
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 text-center">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Rejoignez la communauté MuzLife
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                  Ensemble, approfondissons notre foi et partageons un voyage spirituel enrichissant.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="px-6 py-3 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-md">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">10k+</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Utilisateurs actifs</p>
                  </div>
                  <div className="px-6 py-3 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-md">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Support disponible</p>
                  </div>
                  <div className="px-6 py-3 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-md">
                    <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">100%</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Gratuit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
