import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Ionicons } from "@expo/vector-icons";

const NewsletterCard = ({ title, content, imageUrl }) => (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <Image
        source={{
          uri: imageUrl || "https://source.unsplash.com/featured/?building",
        }}
        style={styles.image}
      />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <ScrollView
      style={styles.contentScrollView}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.cardContent}>{content}</Text>
    </ScrollView>
  </View>
);

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState({ temp: null, condition: "" });
  const [newsletters, setNewsletters] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const { token } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchNewsletters = async () => {
    try {
      const response = await axios.get(
        "http:/192.168.8.101:5000/api/newsletters"
      );
      setNewsletters(response.data);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    }
  };

  const fetchWeather = async () => {
    const API_KEY = "57b60bd0e9132fc8eaac7d04801d8420";
    const city = "Colombo";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(url);
      const { temp } = response.data.main;
      const condition = response.data.weather[0].main;
      setWeather({ temp, condition });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather({ temp: null, condition: "Cannot get weather data" });
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        "http://192.168.8.101:5000/api/users/me",
        {
          headers: { "x-auth-token": token },
        }
      );
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    setGreeting(getGreeting());
    fetchWeather();
    fetchNewsletters();
    if (token) fetchUserDetails();
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <View style={styles.headerActions}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#fff"
            style={styles.headerIcon}
          />
          <Ionicons name="search-outline" size={22} color="#fff" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentScroll}
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.userInfoSection}>
            <Image
              source={require("../assets/Basic.jpg")}
              style={styles.profilePic}
            />
            <View style={styles.userTextContainer}>
              <Text style={styles.greeting}>
                {greeting},{" "}
                <Text style={styles.userName}>
                  {userDetails ? userDetails.name : "User"}
                </Text>
              </Text>
              <Text style={styles.welcomeBack}>Welcome Back</Text>
            </View>
          </View>

          {/* Weather Display */}
          {weather.temp ? (
            <View style={styles.weatherContainer}>
              <View style={styles.weatherIconContainer}>
                <Ionicons
                  name={
                    weather.condition === "Clear"
                      ? "sunny-outline"
                      : weather.condition === "Clouds"
                      ? "cloudy-outline"
                      : weather.condition === "Rain"
                      ? "rainy-outline"
                      : "thunderstorm-outline"
                  }
                  size={28}
                  color="#6366f1"
                />
              </View>
              <View style={styles.weatherInfo}>
                <Text style={styles.temperature}>{weather.temp}°C</Text>
                <Text style={styles.weatherCondition}>{weather.condition}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherCondition}>{weather.condition}</Text>
            </View>
          )}
        </View>

        {/* Newsletters Title Section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Latest Updates</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {/* Newsletters Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.newsletterRow}
          contentContainerStyle={styles.newsletterContent}
        >
          {newsletters.slice(0, 10).map((newsletter) => (
            <NewsletterCard
              key={newsletter._id}
              title={newsletter.subject}
              content={newsletter.description}
              imageUrl={newsletter.imageUrl}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#6366f1",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 18,
  },
  contentScroll: {
    flex: 1,
    paddingTop: 16,
  },
  welcomeCard: {
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#f1f5f9",
  },
  userTextContainer: {
    marginLeft: 14,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
  userName: {
    fontWeight: "700",
    color: "#0f172a",
  },
  welcomeBack: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  weatherIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  weatherCondition: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6366f1",
  },
  newsletterRow: {
    paddingLeft: 12,
    marginBottom: 24,
  },
  newsletterContent: {
    paddingRight: 12,
    paddingBottom: 5,
  },
  card: {
    width: 260,
    height: 400,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  imageContainer: {
    height: 140,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  contentScrollView: {
    flex: 1,
    maxHeight: 170,
  },
  cardContent: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
});

export default Home;
