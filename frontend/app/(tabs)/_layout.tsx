import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Camera, FileText, Heart, Users } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary.saffron,
        tabBarInactiveTintColor: Colors.neutral.gray,
        tabBarStyle: {
          backgroundColor: Colors.primary.white,
          borderTopWidth: 1,
          borderTopColor: Colors.neutral.lightGray,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="identify"
        options={{
          title: t('identify'),
          tabBarIcon: ({ color, size }) => (
            <Camera color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cattle"
        options={{
          title: t('myCattle'),
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schemes"
        options={{
          title: t('schemes'),
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="vet"
        options={{
          title: t('vetSupport'),
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}