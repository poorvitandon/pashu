import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Plus, QrCode, Calendar, Weight, Activity } from 'lucide-react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';

interface CattleProfile {
  id: string;
  digitalId: string;
  breed: string;
  name: string;
  age: number;
  weight: number;
  healthStatus: 'Good' | 'Fair' | 'Poor';
  lastCheckup: string;
  milkYield: string;
  registrationDate: string;
}

// Mock data for demonstration
const mockCattleProfiles: CattleProfile[] = [
  {
    id: '1',
    digitalId: 'IN-DL-001-2024',
    breed: 'Gir',
    name: 'Lakshmi',
    age: 4,
    weight: 385,
    healthStatus: 'Good',
    lastCheckup: '2024-01-15',
    milkYield: '8 L/day',
    registrationDate: '2024-01-10'
  },
  {
    id: '2',
    digitalId: 'IN-DL-002-2024',
    breed: 'Murrah',
    name: 'Shyama',
    age: 6,
    weight: 520,
    healthStatus: 'Good',
    lastCheckup: '2024-01-12',
    milkYield: '14 L/day',
    registrationDate: '2024-01-08'
  }
];

export default function CattleScreen() {
  const [cattleList, setCattleList] = useState<CattleProfile[]>(mockCattleProfiles);
  const [selectedCattle, setSelectedCattle] = useState<CattleProfile | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return Colors.status.success;
      case 'Fair': return Colors.status.warning;
      case 'Poor': return Colors.status.error;
      default: return Colors.neutral.gray;
    }
  };

  const addNewCattle = () => {
    Alert.alert(
      'Add New Cattle',
      'This feature would integrate with the breed identification system to add new cattle profiles.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const showQR = (cattle: CattleProfile) => {
    setSelectedCattle(cattle);
    setShowQRCode(true);
  };

  const hideQR = () => {
    setShowQRCode(false);
    setSelectedCattle(null);
  };

  return (
    <LinearGradient
      colors={[Colors.secondary.cream, Colors.primary.white]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('myCattle')}</Text>
          <Text style={styles.subtitle}>
            Digital profiles of your registered livestock
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{cattleList.length}</Text>
            <Text style={styles.statLabel}>Total Animals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {cattleList.filter(c => c.healthStatus === 'Good').length}
            </Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {cattleList.reduce((total, cattle) => {
                const milkYieldValue = parseFloat(cattle.milkYield.split(' ')[0]);
                return total + milkYieldValue;
              }, 0)}
            </Text>
            <Text style={styles.statLabel}>L/day Total</Text>
          </View>
        </View>

        {/* Add New Cattle Button */}
        <TouchableOpacity style={styles.addButton} onPress={addNewCattle}>
          <Plus color={Colors.primary.white} size={24} />
          <Text style={styles.addButtonText}>Add New Cattle</Text>
        </TouchableOpacity>

        {/* Cattle List */}
        <View style={styles.cattleList}>
          {cattleList.map((cattle) => (
            <View key={cattle.id} style={styles.cattleCard}>
              <View style={styles.cattleHeader}>
                <View>
                  <Text style={styles.cattleName}>{cattle.name}</Text>
                  <Text style={styles.cattleBreed}>{cattle.breed}</Text>
                  <Text style={styles.digitalId}>ID: {cattle.digitalId}</Text>
                </View>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => showQR(cattle)}
                >
                  <QrCode color={Colors.primary.saffron} size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.cattleDetails}>
                <View style={styles.detailItem}>
                  <Calendar color={Colors.neutral.gray} size={16} />
                  <Text style={styles.detailText}>{cattle.age} years old</Text>
                </View>
                <View style={styles.detailItem}>
                  <Weight color={Colors.neutral.gray} size={16} />
                  <Text style={styles.detailText}>{cattle.weight} kg</Text>
                </View>
                <View style={styles.detailItem}>
                  <Activity 
                    color={getHealthStatusColor(cattle.healthStatus)} 
                    size={16} 
                  />
                  <Text 
                    style={[
                      styles.detailText, 
                      { color: getHealthStatusColor(cattle.healthStatus) }
                    ]}
                  >
                    {cattle.healthStatus}
                  </Text>
                </View>
              </View>

              <View style={styles.cattleFooter}>
                <Text style={styles.milkYield}>
                  🥛 {cattle.milkYield}
                </Text>
                <Text style={styles.lastCheckup}>
                  Last checkup: {new Date(cattle.lastCheckup).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* QR Code Modal */}
        {showQRCode && selectedCattle && (
          <View style={styles.qrModal}>
            <TouchableOpacity style={styles.qrModalOverlay} onPress={hideQR} />
            <View style={styles.qrModalContent}>
              <Text style={styles.qrModalTitle}>Digital ID QR Code</Text>
              <Text style={styles.qrModalSubtitle}>{selectedCattle.name}</Text>
              
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={JSON.stringify({
                    digitalId: selectedCattle.digitalId,
                    breed: selectedCattle.breed,
                    name: selectedCattle.name,
                    owner: user?.name,
                    phone: user?.phone,
                    registrationDate: selectedCattle.registrationDate
                  })}
                  size={200}
                  color={Colors.neutral.darkGray}
                  backgroundColor={Colors.primary.white}
                />
              </View>

              <Text style={styles.qrCodeText}>
                ID: {selectedCattle.digitalId}
              </Text>
              
              <TouchableOpacity style={styles.closeButton} onPress={hideQR}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.saffron,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral.gray,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.green,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  addButtonText: {
    color: Colors.primary.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cattleList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  cattleCard: {
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  cattleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cattleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: 2,
  },
  cattleBreed: {
    fontSize: 16,
    color: Colors.primary.saffron,
    fontWeight: '600',
    marginBottom: 2,
  },
  digitalId: {
    fontSize: 12,
    color: Colors.neutral.gray,
    fontFamily: 'monospace',
  },
  qrButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.secondary.cream,
    borderRadius: BorderRadius.sm,
  },
  cattleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: Colors.neutral.gray,
  },
  cattleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.lightGray,
  },
  milkYield: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.green,
  },
  lastCheckup: {
    fontSize: 12,
    color: Colors.neutral.gray,
  },
  qrModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  qrModalContent: {
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    margin: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  qrModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.sm,
  },
  qrModalSubtitle: {
    fontSize: 16,
    color: Colors.primary.saffron,
    marginBottom: Spacing.lg,
  },
  qrCodeContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  qrCodeText: {
    fontSize: 14,
    color: Colors.neutral.gray,
    fontFamily: 'monospace',
    marginBottom: Spacing.lg,
  },
  closeButton: {
    backgroundColor: Colors.primary.saffron,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  closeButtonText: {
    color: Colors.primary.white,
    fontSize: 16,
    fontWeight: '600',
  },
});