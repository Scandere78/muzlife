'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Mail, 
  Send, 
  MessageSquare, 
  User, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Votre message a été envoyé avec succès !');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: 'general'
        });
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--color-foreground)', backgroundImage: 'url(/caligraphie.png)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                    Message envoyé avec succès !
                  </h2>
                  <p className="text-green-600 dark:text-green-400">
                    Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
                >
                  Envoyer un autre message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-foreground)', backgroundImage: 'url(/caligraphie.png)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-4">
            <div className="p-4 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-2xl shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 blur animate-pulse" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-green-800 dark:text-white mb-4">
            =ç Contactez-nous
          </h1>
          <p className="text-lg text-green-700 dark:text-green-200 max-w-2xl mx-auto">
            Une question, une suggestion ou besoin d'aide ? 
            Notre équipe est là pour vous accompagner dans votre parcours spirituel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-200">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-green-800 dark:text-green-200 font-medium">
                        Nom complet *
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500"
                          placeholder="Votre nom complet"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-green-800 dark:text-green-200 font-medium">
                        Email *
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-green-800 dark:text-green-200 font-medium">
                      Catégorie
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-1 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">S Question générale</SelectItem>
                        <SelectItem value="support">=à Support technique</SelectItem>
                        <SelectItem value="feature">=¡ Suggestion de fonctionnalité</SelectItem>
                        <SelectItem value="bug">= Signaler un bug</SelectItem>
                        <SelectItem value="partnership">> Partenariat</SelectItem>
                        <SelectItem value="feedback">=Ý Retour d'expérience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-green-800 dark:text-green-200 font-medium">
                      Sujet *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="mt-1 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500"
                      placeholder="Résumez votre message en quelques mots"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-green-800 dark:text-green-200 font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="mt-1 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500 min-h-[150px]"
                      placeholder="Décrivez votre demande en détail..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            {/* Informations générales */}
            <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">
                  Autres moyens de nous contacter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Email</p>
                    <p className="text-sm text-green-600 dark:text-green-400">contact@muzlife.fr</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Délai de réponse</p>
                    <p className="text-sm text-green-600 dark:text-green-400">24-48 heures</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Basé en</p>
                    <p className="text-sm text-green-600 dark:text-green-400">France, Europe</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ rapide */}
            <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">
                  Questions fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    =¡ Comment ajouter une nouvelle ville ?
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Utilisez l'outil de géolocalisation dans les paramètres
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    =
 Problème avec l'audio ?
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Vérifiez vos paramètres audio et votre connexion
                  </p>
                </div>

                <div className="p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    =ñ Application mobile disponible ?
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Actuellement en version web, mobile en préparation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}