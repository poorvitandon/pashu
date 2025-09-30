import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';

type AuthMode = 'aadhaar' | 'otp';

export default function AuthScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const validateAadhaar = (aadhaar: string): boolean => {
    return aadhaar.length === 12 && /^\d{12}$/.test(aadhaar);
  };

  const validatePhone = (phone: string): boolean => {
    return phone.length === 10 && /^\d{10}$/.test(phone);
  };

  const handleAadhaarLogin = async () => {
    if (!validateAadhaar(aadhaarNumber)) {
      Alert.alert(t('error'), 'Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'Ramesh Kumar',
        phone: '9876543210',
        aadhaar: aadhaarNumber,
        state: 'Haryana',
        district: 'Gurgaon'
      };
      login(mockUser);
      setLoading(false);
      router.replace('/(tabs)/identify');
    }, 2000);
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phoneNumber)) {
      Alert.alert(t('error'), 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    // Mock OTP sending delay
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      Alert.alert(t('success'), 'OTP sent successfully! (Mock: 123456)');
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (otp !== '123456') {
      Alert.alert(t('error'), 'Invalid OTP. Please try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        id: '2',
        name: 'Sunita Devi',
        phone: phoneNumber,
        state: 'Punjab',
        district: 'Ludhiana'
      };
      login(mockUser);
      setLoading(false);
      router.replace('/(tabs)/identify');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerGradient}>
              <LinearGradient
                colors={[Colors.primary.saffron, Colors.primary.green]}
                style={styles.gradientHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.welcomeText}>{t('welcome')}</Text>
                <Text style={styles.subtitleText}>{t('subtitle')}</Text>
              </LinearGradient>
            </View>
            
            {/* Language Toggle */}
            <View style={styles.languageToggle}>
              <TouchableOpacity
                style={[styles.languageButton, language === 'en' && styles.activeLanguageButton]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.languageButtonText, language === 'en' && styles.activeLanguageButtonText]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.languageButton, language === 'hi' && styles.activeLanguageButton]}
                onPress={() => setLanguage('hi')}
              >
                <Text style={[styles.languageButtonText, language === 'hi' && styles.activeLanguageButtonText]}>हिन्दी</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            {/* Auth Mode Toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, authMode === 'aadhaar' && styles.activeModeButton]}
                onPress={() => setAuthMode('aadhaar')}
              >
                <Text style={[styles.modeButtonText, authMode === 'aadhaar' && styles.activeModeButtonText]}>
                  {t('loginWithAadhaar')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, authMode === 'otp' && styles.activeModeButton]}
                onPress={() => setAuthMode('otp')}
              >
                <Text style={[styles.modeButtonText, authMode === 'otp' && styles.activeModeButtonText]}>
                  {t('loginWithOTP')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Aadhaar Login Form */}
            {authMode === 'aadhaar' && (
              <View style={styles.form}>
                <Text style={styles.inputLabel}>{t('aadhaarNumber')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('enterAadhaar')}
                  value={aadhaarNumber}
                  onChangeText={setAadhaarNumber}
                  keyboardType="numeric"
                  maxLength={12}
                  placeholderTextColor={Colors.neutral.gray}
                />
                
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.disabledButton]}
                  onPress={handleAadhaarLogin}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? t('loading') : t('loginWithAadhaar')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* OTP Login Form */}
            {authMode === 'otp' && (
              <View style={styles.form}>
                <Text style={styles.inputLabel}>{t('phoneNumber')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('enterPhone')}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={Colors.neutral.gray}
                />

                {!otpSent ? (
                  <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleSendOTP}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? t('loading') : t('sendOTP')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <Text style={styles.inputLabel}>Enter OTP</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="numeric"
                      maxLength={6}
                      placeholderTextColor={Colors.neutral.gray}
                    />
                    
                    <TouchableOpacity
                      style={[styles.submitButton, loading && styles.disabledButton]}
                      onPress={handleVerifyOTP}
                      disabled={loading}
                    >
                      <Text style={styles.submitButtonText}>
                        {loading ? t('loading') : t('verifyOTP')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by Digital India</Text>
            <Text style={styles.footerTextHindi}>डिजिटल इंडिया द्वारा संचालित</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  headerGradient: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  gradientHeader: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.primary.white,
    textAlign: 'center',
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  activeLanguageButton: {
    backgroundColor: Colors.primary.saffron,
  },
  languageButtonText: {
    color: Colors.primary.saffron,
    fontWeight: '600',
  },
  activeLanguageButtonText: {
    color: Colors.primary.white,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  modeToggle: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeModeButton: {
    backgroundColor: Colors.primary.green,
  },
  modeButtonText: {
    color: Colors.neutral.darkGray,
    fontWeight: '600',
    fontSize: 14,
  },
  activeModeButtonText: {
    color: Colors.primary.white,
  },
  form: {
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.neutral.lightGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    marginBottom: Spacing.lg,
    color: Colors.neutral.darkGray,
    backgroundColor: Colors.primary.white,
  },
  submitButton: {
    backgroundColor: Colors.primary.saffron,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.neutral.lightGray,
  },
  submitButtonText: {
    color: Colors.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    color: Colors.neutral.darkGray,
    fontSize: 12,
    fontWeight: '500',
  },
  footerTextHindi: {
    color: Colors.neutral.gray,
    fontSize: 10,
    marginTop: 2,
  },
});