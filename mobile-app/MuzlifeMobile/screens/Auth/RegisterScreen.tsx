import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Loading } from '../../components/ui/Loading';
import { Colors, FontSizes, Spacing } from '../../constants/theme';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation du formulaire
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion de la soumission du formulaire
  const handleRegister = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      
      // La navigation sera automatiquement gérée par l'AuthNavigator
      // quand isAuthenticated devient true
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      // L'erreur est déjà gérée par le store
    }
  };

  // Mise à jour des champs du formulaire
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez la communauté Muzlife
            </Text>
          </View>

          {/* Formulaire d'inscription */}
          <View style={styles.form}>
            {/* Champ Nom */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom complet</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Votre nom complet"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect={false}
                />
              </View>
              {validationErrors.name && (
                <Text style={styles.errorText}>{validationErrors.name}</Text>
              )}
            </View>

            {/* Champ Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="votre@email.com"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                />
              </View>
              {validationErrors.email && (
                <Text style={styles.errorText}>{validationErrors.email}</Text>
              )}
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Choisissez un mot de passe"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={Colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.password && (
                <Text style={styles.errorText}>{validationErrors.password}</Text>
              )}
            </View>

            {/* Champ Confirmation mot de passe */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirmez votre mot de passe"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={Colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.confirmPassword && (
                <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
              )}
            </View>

            {/* Note sur les conditions */}
            <View style={styles.termsNote}>
              <Text style={styles.termsText}>
                En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </Text>
            </View>

            {/* Erreur API */}
            {error && (
              <View style={styles.apiErrorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color={Colors.error} />
                <Text style={styles.apiErrorText}>{error}</Text>
              </View>
            )}

            {/* Bouton d'inscription */}
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loading size="small" color={Colors.white} />
              ) : (
                <Text style={styles.registerButtonText}>Créer mon compte</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lien vers la connexion */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    minHeight: 50,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  termsNote: {
    backgroundColor: Colors.info + '10',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  termsText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  apiErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  apiErrorText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.error,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: Colors.primary + '70',
  },
  registerButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
});