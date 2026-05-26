import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

export default function App() {
  const greetings = [
    "Eid Mubarak 🌙",
    "May Allah bless you and your family 🤍",
    "Wishing you joy, peace and happiness ✨",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.moon}>🌙</Text>
          <Text style={styles.title}>Happy Eid</Text>
          <Text style={styles.subtitle}>
            May Allah bless you with happiness, peace and prosperity
          </Text>
        </View>

        {/* Greeting Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Eid Mubarak</Text>
          <Text style={styles.cardText}>
            تقبل الله طاعتكم وكل عام وأنتم بخير
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.buttonText}>Send Wishes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Share Greeting</Text>
          </TouchableOpacity>
        </View>

        {/* Greetings List */}
        <Text style={styles.sectionTitle}>Popular Greetings</Text>

        {greetings.map((item, index) => (
          <View key={index} style={styles.greetingItem}>
            <Text style={styles.greetingText}>{item}</Text>
          </View>
        ))}

        {/* Dua Section */}
        <Text style={styles.sectionTitle}>Dua of Eid</Text>

        <View style={styles.duaCard}>
          <Text style={styles.arabicText}>
            اللهم اجعل هذا العيد عيد خير وبركة وسعادة علينا وعلى المسلمين
          </Text>

          <Text style={styles.translation}>
            O Allah, make this Eid a day of goodness, blessings, and happiness
            for us and all Muslims.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ✨ Celebrate, Share, and Spread Happiness ✨
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B3B2E",
  },

  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  moon: {
    fontSize: 60,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#D4AF37",
  },

  subtitle: {
    textAlign: "center",
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 15,
    opacity: 0.9,
  },

  card: {
    margin: 20,
    padding: 25,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  cardTitle: {
    color: "#D4AF37",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },

  actions: {
    paddingHorizontal: 20,
  },

  primaryButton: {
    backgroundColor: "#D4AF37",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#D4AF37",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#0B3B2E",
    fontWeight: "bold",
    fontSize: 16,
  },

  secondaryText: {
    color: "#D4AF37",
    fontWeight: "600",
    fontSize: 16,
  },

  sectionTitle: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
  },

  greetingItem: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  greetingText: {
    color: "#FFFFFF",
    fontSize: 15,
  },

  duaCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 30,
  },

  arabicText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 36,
  },

  translation: {
    marginTop: 15,
    color: "#DDDDDD",
    textAlign: "center",
    lineHeight: 24,
  },

  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },

  footerText: {
    color: "#D4AF37",
    fontSize: 14,
  },
});