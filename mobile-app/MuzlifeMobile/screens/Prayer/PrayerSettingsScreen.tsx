import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { Colors, FontSizes, Spacing } from '../../constants/theme';

export default function PrayerSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState('MWL');

  const calculationMethods = [
    { id: 'MWL', name: 'Muslim World League', description: 'Recommandé pour l\'Europe' },
    { id: 'ISNA', name: 'Islamic Society of North America', description: 'Recommandé pour l\'Amérique du Nord' },
    { id: 'Egypt', name: 'Egyptian General Authority', description: 'Recommandé pour l\'Afrique' },
    { id: 'Makkah', name: 'Umm Al-Qura University', description: 'Recommandé pour l\'Arabie Saoudite' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Section Notifications */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifications activées</Text>
              <Text style={styles.settingDescription}>
                Recevez des rappels pour chaque prière
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
              thumbColor={notificationsEnabled ? Colors.primary : Colors.textSecondary}
            />
          </View>

          {notificationsEnabled && (
            <>
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Son des notifications</Text>
                  <Text style={styles.settingDescription}>
                    Jouer un son avec les notifications
                  </Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                  thumbColor={soundEnabled ? Colors.primary : Colors.textSecondary}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Vibration</Text>
                  <Text style={styles.settingDescription}>
                    Faire vibrer le téléphone
                  </Text>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                  thumbColor={vibrationEnabled ? Colors.primary : Colors.textSecondary}
                />
              </View>
            </>
          )}
        </Card>

        {/* Section Calcul des heures */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>📐 Méthode de Calcul</Text>
          <Text style={styles.sectionDescription}>
            Choisissez la méthode de calcul des heures de prière selon votre région
          </Text>

          {calculationMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodOption,
                calculationMethod === method.id && styles.methodOptionActive
              ]}
              onPress={() => setCalculationMethod(method.id)}
            >
              <View style={styles.methodContent}>
                <View style={styles.methodInfo}>
                  <Text style={[
                    styles.methodName,
                    calculationMethod === method.id && styles.methodNameActive
                  ]}>
                    {method.name}
                  </Text>
                  <Text style={styles.methodDescription}>
                    {method.description}
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  calculationMethod === method.id && styles.radioButtonActive
                ]}>
                  {calculationMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Section Ajustements */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>⚙️ Ajustements</Text>
          
          <View style={styles.adjustmentItem}>
            <Ionicons name="sunrise" size={20} color={Colors.warning} />
            <Text style={styles.adjustmentLabel}>Fajr</Text>
            <Text style={styles.adjustmentValue}>+0 min</Text>
            <TouchableOpacity style={styles.adjustButton}>
              <Ionicons name="settings-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.adjustmentItem}>
            <Ionicons name="sunny" size={20} color={Colors.warning} />
            <Text style={styles.adjustmentLabel}>Dhuhr</Text>
            <Text style={styles.adjustmentValue}>+0 min</Text>
            <TouchableOpacity style={styles.adjustButton}>
              <Ionicons name="settings-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.adjustmentItem}>
            <Ionicons name="partly-sunny" size={20} color={Colors.info} />
            <Text style={styles.adjustmentLabel}>Asr</Text>
            <Text style={styles.adjustmentValue}>+0 min</Text>
            <TouchableOpacity style={styles.adjustButton}>
              <Ionicons name="settings-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.adjustmentItem}>
            <Ionicons name="moon" size={20} color={Colors.primary} />
            <Text style={styles.adjustmentLabel}>Maghrib</Text>
            <Text style={styles.adjustmentValue}>+0 min</Text>
            <TouchableOpacity style={styles.adjustButton}>
              <Ionicons name="settings-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.adjustmentItem}>
            <Ionicons name="moon" size={20} color={Colors.text} />
            <Text style={styles.adjustmentLabel}>Isha</Text>
            <Text style={styles.adjustmentValue}>+0 min</Text>
            <TouchableOpacity style={styles.adjustButton}>
              <Ionicons name="settings-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Note informative */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={Colors.info} />
            <Text style={styles.infoTitle}>Information</Text>
          </View>
          <Text style={styles.infoText}>
            Les ajustements permettent d'adapter les heures de prière selon vos préférences locales 
            ou les recommandations de votre communauté. Les valeurs par défaut sont généralement adaptées 
            à la plupart des situations.
          </Text>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  methodOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  methodOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  methodNameActive: {
    color: Colors.primary,
  },
  methodDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  adjustmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  adjustmentLabel: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  adjustmentValue: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginRight: Spacing.sm,
  },
  adjustButton: {
    padding: Spacing.xs,
  },
  infoCard: {
    backgroundColor: Colors.info + '10',
    borderColor: Colors.info + '30',
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.info,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});