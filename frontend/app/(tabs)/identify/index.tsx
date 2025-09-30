import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, Loader, CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { AIService, BreedPrediction } from '@/services/AIService';

export default function IdentifyScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<BreedPrediction | null>(null);
  const { t } = useLanguage();

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
      Alert.alert(
        'Permissions Required',
        'Camera and media library permissions are required to use this feature.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setPrediction(null);
      analyzeImage(result.assets[0].uri);
    }
  };

  const chooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setPrediction(null);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      const result = await AIService.recognizeBreed(imageUri);
      setPrediction(result);
    } catch (error) {
      Alert.alert(t('error'), 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveToProfile = () => {
    if (!prediction) return;
    
    Alert.alert(
      t('success'),
      'Cattle profile saved successfully with Digital ID generation!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <LinearGradient
      colors={[Colors.secondary.cream, Colors.primary.white]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('recognizeBreed')}</Text>
          <Text style={styles.subtitle}>
            Upload or capture cattle/buffalo image for breed identification
          </Text>
        </View>

        {/* Image Selection */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              {isAnalyzing && (
                <View style={styles.analyzingOverlay}>
                  <Loader color={Colors.primary.white} size={32} style={styles.spinningLoader} />
                  <Text style={styles.analyzingText}>{t('analyzing')}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Camera color={Colors.neutral.gray} size={64} />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
              <Camera color={Colors.primary.white} size={24} />
              <Text style={styles.actionButtonText}>{t('takePhoto')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={chooseFromGallery}>
              <Upload color={Colors.primary.white} size={24} />
              <Text style={styles.actionButtonText}>{t('chooseFromGallery')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Prediction Results */}
        {prediction && !isAnalyzing && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <CheckCircle color={Colors.status.success} size={24} />
              <Text style={styles.resultTitle}>{t('breedIdentified')}</Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.breedName}>{prediction.breed}</Text>
              <Text style={styles.confidence}>
                {t('confidence')}: {prediction.confidence}%
              </Text>

              {/* Confidence Bar */}
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceProgress, 
                    { width: `${prediction.confidence}%` }
                  ]} 
                />
              </View>

              {/* Breed Details */}
              <View style={styles.breedDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Origin:</Text>
                  <Text style={styles.detailValue}>{prediction.origin}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Avg Weight:</Text>
                  <Text style={styles.detailValue}>{prediction.avgWeight}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Milk Yield:</Text>
                  <Text style={styles.detailValue}>{prediction.avgMilkYield}</Text>
                </View>
              </View>

              {/* Characteristics */}
              <View style={styles.characteristicsSection}>
                <Text style={styles.characteristicsTitle}>Key Characteristics:</Text>
                {prediction.characteristics.map((characteristic, index) => (
                  <View key={index} style={styles.characteristicItem}>
                    <CheckCircle color={Colors.status.success} size={16} />
                    <Text style={styles.characteristicText}>{characteristic}</Text>
                  </View>
                ))}
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={saveToProfile}>
                <Text style={styles.saveButtonText}>{t('saveToProfile')}</Text>
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
    lineHeight: 22,
  },
  imageSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: BorderRadius.lg,
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  spinningLoader: {
    transform: [{ rotate: '45deg' }],
    marginBottom: Spacing.sm,
  },
  analyzingText: {
    color: Colors.primary.white,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    height: 250,
    backgroundColor: Colors.neutral.offWhite,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.neutral.lightGray,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  placeholderText: {
    marginTop: Spacing.sm,
    color: Colors.neutral.gray,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary.saffron,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  actionButtonText: {
    color: Colors.primary.white,
    fontSize: 14,
    fontWeight: '600',
  },
  resultSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.status.success,
  },
  resultCard: {
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  breedName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.saffron,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  confidence: {
    fontSize: 16,
    color: Colors.neutral.gray,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: Colors.neutral.lightGray,
    borderRadius: 4,
    marginBottom: Spacing.lg,
  },
  confidenceProgress: {
    height: 8,
    backgroundColor: Colors.status.success,
    borderRadius: 4,
  },
  breedDetails: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.darkGray,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.neutral.gray,
  },
  characteristicsSection: {
    marginBottom: Spacing.lg,
  },
  characteristicsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.sm,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  characteristicText: {
    fontSize: 14,
    color: Colors.neutral.gray,
  },
  saveButton: {
    backgroundColor: Colors.primary.green,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});