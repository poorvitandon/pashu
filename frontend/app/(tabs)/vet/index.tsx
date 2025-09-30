import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, MapPin, Clock, Star, AlertCircle, Calendar, User, GraduationCap } from 'lucide-react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { VetService, VeterinaryOfficer, Emergency } from '@/services/VetService';

type TabType = 'nearby' | 'emergency' | 'appointment';

export default function VetScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('nearby');
  const [vets, setVets] = useState<VeterinaryOfficer[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<Emergency[]>([]);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    // Load veterinary officers based on user location
    if (user?.state && user?.district) {
      const nearbyVets = VetService.getVetsByLocation(user.state, user.district);
      const allVets = VetService.getAllVets();
      setVets(nearbyVets.length > 0 ? nearbyVets : allVets.slice(0, 3));
    } else {
      setVets(VetService.getAllVets());
    }

    setEmergencyContacts(VetService.getEmergencyContacts());
  }, [user]);

  const callVet = (phone: string) => {
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Error', 'Could not open phone dialer');
    });
  };

  const bookAppointment = async (vetId: string) => {
    if (!user?.phone) {
      Alert.alert('Error', 'Phone number required to book appointment');
      return;
    }

    try {
      const result = await VetService.bookAppointment(vetId, user.phone, new Date().toISOString());
      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} color={Colors.status.warning} fill={Colors.status.warning} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} color={Colors.status.warning} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} color={Colors.neutral.lightGray} />
      );
    }

    return stars;
  };

  const renderNearbyVets = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>
        {user?.district ? `Veterinary Officers in ${user.district}` : 'Available Veterinary Officers'}
      </Text>

      {vets.map((vet) => (
        <View key={vet.id} style={styles.vetCard}>
          <View style={styles.vetHeader}>
            <View style={styles.vetInfo}>
              <Text style={styles.vetName}>{vet.name}</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStars(vet.rating)}
                </View>
                <Text style={styles.ratingText}>({vet.rating})</Text>
              </View>
            </View>
          </View>

          <View style={styles.vetDetails}>
            <View style={styles.detailItem}>
              <GraduationCap color={Colors.neutral.gray} size={16} />
              <Text style={styles.detailText}>{vet.qualification}</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin color={Colors.neutral.gray} size={16} />
              <Text style={styles.detailText}>{vet.address}</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock color={Colors.neutral.gray} size={16} />
              <Text style={styles.detailText}>{vet.availability}</Text>
            </View>
          </View>

          <View style={styles.specializationSection}>
            <Text style={styles.specializationTitle}>Specialization:</Text>
            <View style={styles.specializationTags}>
              {vet.specialization.map((spec, index) => (
                <View key={index} style={styles.specializationTag}>
                  <Text style={styles.specializationText}>{spec}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.languageSection}>
            <Text style={styles.languageTitle}>Languages: </Text>
            <Text style={styles.languageText}>{vet.languages.join(', ')}</Text>
          </View>

          <View style={styles.vetActions}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => callVet(vet.phone)}
            >
              <Phone color={Colors.primary.white} size={16} />
              <Text style={styles.callButtonText}>{t('callVet')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.appointmentButton}
              onPress={() => bookAppointment(vet.id)}
            >
              <Calendar color={Colors.primary.white} size={16} />
              <Text style={styles.appointmentButtonText}>{t('bookAppointment')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderEmergency = () => (
    <View style={styles.tabContent}>
      <View style={styles.emergencyHeader}>
        <AlertCircle color={Colors.status.error} size={24} />
        <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
      </View>
      
      <Text style={styles.emergencySubtitle}>
        For immediate veterinary assistance and livestock emergencies
      </Text>

      {emergencyContacts.map((emergency) => (
        <View key={emergency.id} style={styles.emergencyCard}>
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyContactTitle}>{emergency.title}</Text>
            <Text style={styles.emergencyDescription}>{emergency.description}</Text>
            
            <View style={styles.emergencyDetails}>
              <Text style={styles.emergencyPhone}>📞 {emergency.phone}</Text>
              {emergency.available24x7 && (
                <View style={styles.availabilityBadge}>
                  <Text style={styles.availabilityText}>24x7 Available</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.emergencyCallButton}
            onPress={() => callVet(emergency.phone)}
          >
            <Phone color={Colors.primary.white} size={20} />
            <Text style={styles.emergencyCallButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.emergencyTips}>
        <Text style={styles.tipsTitle}>Emergency Guidelines:</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Keep vet contact numbers handy</Text>
          <Text style={styles.tipItem}>• Note symptoms and behavior changes</Text>
          <Text style={styles.tipItem}>• Separate sick animals if possible</Text>
          <Text style={styles.tipItem}>• Don't administer medicine without consultation</Text>
        </View>
      </View>
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Book Appointment</Text>
      
      <View style={styles.appointmentInfo}>
        <User color={Colors.primary.saffron} size={24} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userDetails}>
            📱 {user?.phone} | 📍 {user?.district}, {user?.state}
          </Text>
        </View>
      </View>

      <Text style={styles.instructionsTitle}>How to book:</Text>
      <View style={styles.instructions}>
        <Text style={styles.instructionItem}>1. Choose a veterinary officer from the nearby section</Text>
        <Text style={styles.instructionItem}>2. Click "Book Appointment" button</Text>
        <Text style={styles.instructionItem}>3. You'll receive SMS confirmation</Text>
        <Text style={styles.instructionItem}>4. Vet will contact you to confirm timing</Text>
      </View>

      <View style={styles.appointmentNote}>
        <Text style={styles.noteTitle}>📝 Note:</Text>
        <Text style={styles.noteText}>
          Appointments are subject to veterinary officer availability. 
          For urgent cases, please use emergency contacts.
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[Colors.secondary.cream, Colors.primary.white]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('vetSupport')}</Text>
          <Text style={styles.subtitle}>
            Connect with qualified veterinary professionals
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
            onPress={() => setActiveTab('nearby')}
          >
            <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
              Nearby Vets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'emergency' && styles.activeTab]}
            onPress={() => setActiveTab('emergency')}
          >
            <Text style={[styles.tabText, activeTab === 'emergency' && styles.activeTabText]}>
              Emergency
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'appointment' && styles.activeTab]}
            onPress={() => setActiveTab('appointment')}
          >
            <Text style={[styles.tabText, activeTab === 'appointment' && styles.activeTabText]}>
              Appointments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'nearby' && renderNearbyVets()}
        {activeTab === 'emergency' && renderEmergency()}
        {activeTab === 'appointment' && renderAppointments()}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral.gray,
    textAlign: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeTab: {
    backgroundColor: Colors.primary.saffron,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.gray,
  },
  activeTabText: {
    color: Colors.primary.white,
  },
  tabContent: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.lg,
  },
  vetCard: {
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.neutral.gray,
    marginLeft: Spacing.xs,
  },
  vetDetails: {
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: Colors.neutral.gray,
    lineHeight: 18,
  },
  specializationSection: {
    marginBottom: Spacing.md,
  },
  specializationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.xs,
  },
  specializationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  specializationTag: {
    backgroundColor: Colors.secondary.lightGreen + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  specializationText: {
    fontSize: 12,
    color: Colors.primary.green,
    fontWeight: '500',
  },
  languageSection: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  languageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
  },
  languageText: {
    fontSize: 14,
    color: Colors.neutral.gray,
  },
  vetActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.green,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  callButtonText: {
    color: Colors.primary.white,
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.saffron,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  appointmentButtonText: {
    color: Colors.primary.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.status.error,
  },
  emergencySubtitle: {
    fontSize: 16,
    color: Colors.neutral.gray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  emergencyCard: {
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.status.error,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyInfo: {
    marginBottom: Spacing.md,
  },
  emergencyContactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.xs,
  },
  emergencyDescription: {
    fontSize: 14,
    color: Colors.neutral.gray,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  emergencyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyPhone: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.darkGray,
  },
  availabilityBadge: {
    backgroundColor: Colors.status.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  availabilityText: {
    color: Colors.primary.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  emergencyCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.status.error,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  emergencyCallButtonText: {
    color: Colors.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyTips: {
    backgroundColor: Colors.status.info + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.status.info,
    marginBottom: Spacing.sm,
  },
  tipsList: {
    gap: Spacing.xs,
  },
  tipItem: {
    fontSize: 14,
    color: Colors.neutral.darkGray,
    lineHeight: 18,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 12,
    color: Colors.neutral.gray,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.sm,
  },
  instructions: {
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  instructionItem: {
    fontSize: 14,
    color: Colors.neutral.gray,
    lineHeight: 18,
  },
  appointmentNote: {
    backgroundColor: Colors.status.warning + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.status.warning + '30',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.status.warning,
    marginBottom: Spacing.xs,
  },
  noteText: {
    fontSize: 13,
    color: Colors.neutral.gray,
    lineHeight: 16,
  },
});