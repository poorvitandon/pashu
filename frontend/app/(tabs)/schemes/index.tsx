import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ExternalLink, Calendar, IndianRupee, CheckCircle, Filter } from 'lucide-react-native';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { SchemeService, GovernmentScheme } from '@/services/SchemeService';

export default function SchemesScreen() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('All');
  const { t, language } = useLanguage();

  const breeds = ['All', 'Gir', 'Sahiwal', 'Murrah', 'Tharparkar', 'Red Sindhi', 'Kankrej', 'Nili-Ravi'];

  useEffect(() => {
    const allSchemes = SchemeService.getAllSchemes();
    setSchemes(allSchemes);
    setFilteredSchemes(allSchemes);
  }, []);

  useEffect(() => {
    if (selectedBreed === 'All') {
      setFilteredSchemes(schemes);
    } else {
      const filtered = SchemeService.getSchemesByBreed(selectedBreed);
      setFilteredSchemes(filtered);
    }
  }, [selectedBreed, schemes]);

  const openApplicationUrl = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the application URL');
    });
  };

  const getSchemeText = (scheme: GovernmentScheme, key: keyof GovernmentScheme) => {
    if (language === 'hi') {
      const hindiKey = `${key}Hi` as keyof GovernmentScheme;
      return scheme[hindiKey] as string || scheme[key] as string;
    }
    return scheme[key] as string;
  };

  const getSchemeArray = (scheme: GovernmentScheme, key: 'eligibility' | 'eligibilityHi') => {
    if (language === 'hi') {
      return scheme.eligibilityHi;
    }
    return scheme.eligibility;
  };

  return (
    <LinearGradient
      colors={[Colors.secondary.cream, Colors.primary.white]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('availableSchemes')}</Text>
          <Text style={styles.subtitle}>
            Government schemes and subsidies for livestock farmers
          </Text>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Filter color={Colors.neutral.gray} size={20} />
            <Text style={styles.filterTitle}>Filter by Breed</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterButtons}>
              {breeds.map((breed) => (
                <TouchableOpacity
                  key={breed}
                  style={[
                    styles.filterButton,
                    selectedBreed === breed && styles.activeFilterButton
                  ]}
                  onPress={() => setSelectedBreed(breed)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedBreed === breed && styles.activeFilterButtonText
                    ]}
                  >
                    {breed}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results Summary */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} available
            {selectedBreed !== 'All' && ` for ${selectedBreed}`}
          </Text>
        </View>

        {/* Schemes List */}
        <View style={styles.schemesList}>
          {filteredSchemes.map((scheme) => (
            <View key={scheme.id} style={styles.schemeCard}>
              {/* Scheme Header */}
              <View style={styles.schemeHeader}>
                <View style={styles.schemeTitleContainer}>
                  <Text style={styles.schemeName}>
                    {getSchemeText(scheme, 'name')}
                  </Text>
                  {scheme.subsidy && (
                    <View style={styles.subsidyBadge}>
                      <IndianRupee color={Colors.primary.white} size={12} />
                      <Text style={styles.subsidyText}>{scheme.subsidy}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.ministryText}>{scheme.ministry}</Text>
              </View>

              {/* Description */}
              <Text style={styles.schemeDescription}>
                {getSchemeText(scheme, 'description')}
              </Text>

              {/* Benefits */}
              <View style={styles.benefitsSection}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                <Text style={styles.benefitsText}>
                  {getSchemeText(scheme, 'benefits')}
                </Text>
              </View>

              {/* Eligibility */}
              <View style={styles.eligibilitySection}>
                <Text style={styles.eligibilityTitle}>Eligibility:</Text>
                {getSchemeArray(scheme, 'eligibility').map((criterion, index) => (
                  <View key={index} style={styles.eligibilityItem}>
                    <CheckCircle color={Colors.status.success} size={16} />
                    <Text style={styles.eligibilityText}>{criterion}</Text>
                  </View>
                ))}
              </View>

              {/* Applicable Breeds */}
              <View style={styles.breedsSection}>
                <Text style={styles.breedsTitle}>Applicable to:</Text>
                <View style={styles.breedTags}>
                  {scheme.applicableBreeds.slice(0, 3).map((breed, index) => (
                    <View key={index} style={styles.breedTag}>
                      <Text style={styles.breedTagText}>{breed}</Text>
                    </View>
                  ))}
                  {scheme.applicableBreeds.length > 3 && (
                    <View style={styles.breedTag}>
                      <Text style={styles.breedTagText}>
                        +{scheme.applicableBreeds.length - 3} more
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Deadline (if available) */}
              {scheme.deadline && (
                <View style={styles.deadlineSection}>
                  <Calendar color={Colors.status.warning} size={16} />
                  <Text style={styles.deadlineText}>
                    Application deadline: {new Date(scheme.deadline).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => openApplicationUrl(scheme.applicationUrl)}
                >
                  <ExternalLink color={Colors.primary.white} size={16} />
                  <Text style={styles.applyButtonText}>{t('applyNow')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.learnMoreButton}
                  onPress={() => openApplicationUrl(scheme.applicationUrl)}
                >
                  <Text style={styles.learnMoreButtonText}>{t('learnMore')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            For assistance with applications, contact your local veterinary officer
          </Text>
        </View>
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
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.darkGray,
  },
  filterScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary.saffron,
    borderColor: Colors.primary.saffron,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.neutral.gray,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: Colors.primary.white,
  },
  resultsHeader: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.neutral.gray,
    fontStyle: 'italic',
  },
  schemesList: {
    paddingHorizontal: Spacing.lg,
  },
  schemeCard: {
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
  schemeHeader: {
    marginBottom: Spacing.md,
  },
  schemeTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  schemeName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.saffron,
    marginRight: Spacing.sm,
  },
  subsidyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.green,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  subsidyText: {
    color: Colors.primary.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  ministryText: {
    fontSize: 12,
    color: Colors.neutral.gray,
    fontStyle: 'italic',
  },
  schemeDescription: {
    fontSize: 15,
    color: Colors.neutral.darkGray,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  benefitsSection: {
    marginBottom: Spacing.md,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.xs,
  },
  benefitsText: {
    fontSize: 14,
    color: Colors.neutral.gray,
    lineHeight: 18,
  },
  eligibilitySection: {
    marginBottom: Spacing.md,
  },
  eligibilityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.xs,
  },
  eligibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  eligibilityText: {
    fontSize: 13,
    color: Colors.neutral.gray,
    flex: 1,
  },
  breedsSection: {
    marginBottom: Spacing.md,
  },
  breedsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.darkGray,
    marginBottom: Spacing.xs,
  },
  breedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  breedTag: {
    backgroundColor: Colors.secondary.cream,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  breedTagText: {
    fontSize: 11,
    color: Colors.primary.saffron,
    fontWeight: '500',
  },
  deadlineSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.status.warning + '20',
    borderRadius: BorderRadius.sm,
  },
  deadlineText: {
    fontSize: 13,
    color: Colors.status.warning,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.saffron,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  applyButtonText: {
    color: Colors.primary.white,
    fontSize: 14,
    fontWeight: '600',
  },
  learnMoreButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral.offWhite,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
  },
  learnMoreButtonText: {
    color: Colors.neutral.darkGray,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.neutral.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});