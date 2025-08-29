'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  MessageSquare, 
  Bug, 
  Handshake, 
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail
} from 'lucide-react';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { value: 'bug', label: 'Signaler un bug', icon: Bug, color: 'red', description: 'Rapportez un problème technique' },
    { value: 'feature', label: 'Demande de fonctionnalité', icon: HelpCircle, color: 'blue', description: 'Suggérez une amélioration' },
    { value: 'partnership', label: 'Partenariat', icon: Handshake, color: 'green', description: 'Collaborons ensemble' },
    { value: 'support', label: 'Support technique', icon: MessageSquare, color: 'yellow', description: 'Besoin d\'aide technique' },
    { value: 'other', label: 'Autre', icon: Mail, color: 'gray', description: 'Toute autre question' }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          category: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.error || 'Une erreur est survenue');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="space-y-8">
      {/* Alerts avec style amélioré */}
      {submitStatus === 'success' && (
        <Alert className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-full">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
              ✨ Votre message a été envoyé avec succès ! Nous vous répondrons sous 24h incha&apos;Allah.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert className="border-0 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-full">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
              {errorMessage}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Nom et Prénom avec style amélioré */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Prénom *
            </label>
            <Input
              placeholder="Entrez votre prénom"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              className="h-12 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              Nom *
            </label>
            <Input
              placeholder="Entrez votre nom de famille"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              className="h-12 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Email avec style amélioré */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Adresse email *
          </label>
          <Input
            type="email"
            placeholder="votre.email@exemple.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="h-12 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Catégorie avec style amélioré */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Type de demande *
          </label>
          <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
            <SelectTrigger className="h-12 border-2 !border-emerald-200 dark:!border-emerald-700 focus:!border-emerald-500 dark:focus:!border-emerald-400 focus:!ring-emerald-200 dark:focus:!ring-emerald-800 focus:!ring-2 focus:!ring-offset-0 rounded-xl !bg-white/50 dark:!bg-white/10 backdrop-blur-sm transition-all duration-300 hover:!border-emerald-300 dark:hover:!border-emerald-600 [&>span]:text-gray-500 [&>span]:dark:text-gray-400 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Sélectionnez le type de votre demande" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-2 !border-emerald-200 dark:!border-emerald-700 rounded-xl">
              {categories.map((category) => {
                const Icon = category.icon;
                const getColorClasses = (color: string, isHovered: boolean = false) => {
                  const colors: Record<string, { bg: string; text: string; hover: string }> = {
                    red: { 
                      bg: 'bg-red-100 dark:bg-red-900/30', 
                      text: 'text-red-600 dark:text-red-400',
                      hover: 'hover:bg-red-50 dark:hover:bg-red-900/20'
                    },
                    blue: { 
                      bg: 'bg-blue-100 dark:bg-blue-900/30', 
                      text: 'text-blue-600 dark:text-blue-400',
                      hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    },
                    green: { 
                      bg: 'bg-green-100 dark:bg-green-900/30', 
                      text: 'text-green-600 dark:text-green-400',
                      hover: 'hover:bg-green-50 dark:hover:bg-green-900/20'
                    },
                    yellow: { 
                      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
                      text: 'text-yellow-600 dark:text-yellow-400',
                      hover: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                    },
                    gray: { 
                      bg: 'bg-gray-100 dark:bg-gray-900/30', 
                      text: 'text-gray-600 dark:text-gray-400',
                      hover: 'hover:bg-gray-50 dark:hover:bg-gray-900/20'
                    }
                  };
                  return isHovered ? colors[color]?.hover : `${colors[color]?.bg} ${colors[color]?.text}`;
                };
                
                return (
                  <SelectItem 
                    key={category.value} 
                    value={category.value} 
                    className={`py-3 rounded-lg transition-colors ${getColorClasses(category.color, true)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${getColorClasses(category.color).split(' ')[0]}`}>
                        <Icon className={`h-4 w-4 ${getColorClasses(category.color).split(' ').slice(1).join(' ')}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{category.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{category.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {selectedCategory && (
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1 rounded-full shadow-lg">
                <selectedCategory.icon className="h-3 w-3 mr-1" />
                {selectedCategory.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Sujet avec style amélioré */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Sujet de votre message *
          </label>
          <Input
            placeholder="Résumé en quelques mots de votre demande"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            required
            className="h-12 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Message avec style amélioré */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            Votre message *
          </label>
          <Textarea
            placeholder="Décrivez votre demande en détail... Plus vous serez précis, mieux nous pourrons vous aider ✨"
            value={formData.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
            required
            rows={6}
            className="border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none transition-all duration-300 hover:border-emerald-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Minimum 10 caractères requis
          </p>
        </div>

        {/* Submit Button avec style amélioré */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-600 hover:via-teal-600 hover:to-green-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 relative overflow-hidden"
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Envoi en cours...</span>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Envoyer mon message</span>
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                </>
              )}
            </div>
          </Button>
          
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Vos données sont protégées et traitées avec confidentialité
          </p>
        </div>
      </form>
    </div>
  );
}
