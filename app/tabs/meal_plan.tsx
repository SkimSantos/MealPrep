import { router } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import 'react-native-reanimated';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS, styles } from '../styles/global_style';

const CATEGORIES = [
  {
    title: "Breakfast",
    icon: "light-mode",
    alt: "A bowl of oatmeal with fresh berries, representing breakfast.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJPS2Eo2iyZywlhh0LqoPzlu-A5yVtHxOtuwcLHDaj9gPrB8o4SM8liVfJsj9wJ8Zs5k1J1nE1sVY02Lwcie4ENsoV9akxLuU7bdmwf9rfDOo9YwV5a1LbV3A_-vDhGqkmjvCVpPLjaGe_iCdoeYk14ZgREZyYswNIWN7Ry5t92h435EURFFgWzVfLfeVxLTkPOkFoqhMH6o8U1R0SEDptg7bQroqSpuIkzk0S5pz2FRcgk_X7Ynf3xzh2LOHFnDKSs2ga7Xefa-4",
  },
  {
    title: "Lunch",
    icon: "lunch-dining",
    alt: "A fresh green salad with grilled chicken, representing lunch.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwpaiPOvhLCDXB4hrh67yLeYkjcibEsSYH9vyHdYQmHWVy7Ku4KwXSUg4gu75g1AixQbABo0CylqA22__LmZFF-1xaPxsI4RFVLJuZVCIJE4V7-Xc3tx8xUGf6gJhttVOkzjuV2iA1HwyWRfPDXOcjq_zpyLsM8a8lP3iVxy4TfYhIJLnkrqZyrZ1Mk87mU45oi0onrO_oZV2ZaATFi_0ZPcAG9HvdEeHXpIjd9wavFO7AYqsdVMUcuprgp_AfnSYdA9zAfWley88",
  },
  {
    title: "Snack",
    icon: "bakery-dining",
    alt: "A handful of mixed nuts and dried fruit, representing a snack.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl0iTwXPH1wE304OVQU2Z4RdtZ7mN0Slz_LrsrkMxKgYylD51CTjov97qv1fygLZFmwKaNvZoImlPzqp5LhdPkhWN9IDsS6xiXgyR1BWNnVg4GtI008ufuyXpMV7b5wXKa27OzF__93E2FK0GfeFHE3wFU4eRgX1f0GmQHRUulswH3qFjD4eTshmRWHvhXqrBbxzJDWzSUmWqDdJvFRPcDBZi376FvGVxDO5eh_WaA1UPbtr11Ie104kHv9UxCsOL9CyWo3N5h_T8",
  },
  {
    title: "Dinner",
    icon: "dinner-dining",
    alt: "A roasted salmon fillet with asparagus, representing dinner.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgJK7v3kOWrXSN8t-z13qfzL-EuOjHb9u9LSJ038S0ivK4vZc_xAK-lDAZuNnmwAFJwcpZw6RMHENw2GqwtDN77fmianozxher8HWvtUN5KqkcrCjhnLJDQRA5IOajELEO-rFhPzS-4cm_b9Vr6-uqYfiLK8PIXOobIf-mYZ7dhHUIWN1Rwc4GpS25FwVW9rS27jEEww4dAGY-M5Q8bBulRUCVlAHbEWp-L0wEkeU8vMH-6_aRIc-U_XA4D8a9oBnbOt_Trx-vMhM",
  },
];

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function MealPlannerHome() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const text = isDark ? COLORS.textLight : COLORS.textDark;
  const placeholder = "Search for a recipe or ingredient";

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={bg}
        hidden
      />
      <View style={[styles.container, { backgroundColor: bg }]}>
        {/* Scrollable Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.9}
                style={styles.card}
                onPress={() => router.push("/tabs/ingredient_list")}
                accessibilityLabel={item.alt}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  imageStyle={styles.cardImage}
                  style={styles.cardBg}
                >
                  {/* Top-left icon chip */}
                  <View style={styles.chip}>
                    <Icon name={item.icon as any} size={20} color="#fff" />
                  </View>

                  {/* Dark overlay to mimic gradient */}
                  <View style={styles.cardOverlay} />

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.fabWrap}>
          <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
            <Icon name="add" size={22} color={COLORS.textDark} />
            <Text style={styles.fabText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}