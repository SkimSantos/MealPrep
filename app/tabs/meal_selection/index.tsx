import React from 'react';
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { usePanels } from '../../components/PanelContext';
import { useTheme } from '../../hooks/useTheme';
import { useIngredients } from '../../stores/ingredientsStore';
import { COLORS, styles } from '../../styles/global_style';
import { mealSelectionStyles } from '../../styles/meal_selection';
import IngredientSelectorPanel from './panels/ingredient_selector';
import MealConfirmationPanel from './panels/meal_confirmation';
import PlateVisualizationPanel from './panels/plate_visualization';

const MEAL_IMAGES: Record<string, { icon: string; image: string }> = {
  Breakfast: {
    icon: "light-mode",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJPS2Eo2iyZywlhh0LqoPzlu-A5yVtHxOtuwcLHDaj9gPrB8o4SM8liVfJsj9wJ8Zs5k1J1nE1sVY02Lwcie4ENsoV9akxLuU7bdmwf9rfDOo9YwV5a1LbV3A_-vDhGqkmjvCVpPLjaGe_iCdoeYk14ZgREZyYswNIWN7Ry5t92h435EURFFgWzVfLfeVxLTkPOkFoqhMH6o8U1R0SEDptg7bQroqSpuIkzk0S5pz2FRcgk_X7Ynf3xzh2LOHFnDKSs2ga7Xefa-4",
  },
  Lunch: {
    icon: "lunch-dining",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwpaiPOvhLCDXB4hrh67yLeYkjcibEsSYH9vyHdYQmHWVy7Ku4KwXSUg4gu75g1AixQbABo0CylqA22__LmZFF-1xaPxsI4RFVLJuZVCIJE4V7-Xc3tx8xUGf6gJhttVOkzjuV2iA1HwyWRfPDXOcjq_zpyLsM8a8lP3iVxy4TfYhIJLnkrqZyrZ1Mk87mU45oi0onrO_oZV2ZaATFi_0ZPcAG9HvdEeHXpIjd9wavFO7AYqsdVMUcuprgp_AfnSYdA9zAfWley88",
  },
  Snack: {
    icon: "bakery-dining",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl0iTwXPH1wE304OVQU2Z4RdtZ7mN0Slz_LrsrkMxKgYylD51CTjov97qv1fygLZFmwKaNvZoImlPzqp5LhdPkhWN9IDsS6xiXgyR1BWNnVg4GtI008ufuyXpMV7b5wXKa27OzF__93E2FK0GfeFHE3wFU4eRgX1f0GmQHRUulswH3qFjD4eTshmRWHvhXqrBbxzJDWzSUmWqDdJvFRPcDBZi376FvGVxDO5eh_WaA1UPbtr11Ie104kHv9UxCsOL9CyWo3N5h_T8",
  },
  Dinner: {
    icon: "dinner-dining",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgJK7v3kOWrXSN8t-z13qfzL-EuOjHb9u9LSJ038S0ivK4vZc_xAK-lDAZuNnmwAFJwcpZw6RMHENw2GqwtDN77fmianozxher8HWvtUN5KqkcrCjhnLJDQRA5IOajELEO-rFhPzS-4cm_b9Vr6-uqYfiLK8PIXOobIf-mYZ7dhHUIWN1Rwc4GpS25FwVW9rS27jEEww4dAGY-M5Q8bBulRUCVlAHbEWp-L0wEkeU8vMH-6_aRIc-U_XA4D8a9oBnbOt_Trx-vMhM",
  },
};

const DEFAULT_IMAGE = {
  icon: "restaurant",
  image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
};

export default function MealSelectionTab() {
  const { isDark } = useTheme();
  const { meals } = useIngredients();
  const { openPanel, setPanelData, isPanelOpen } = usePanels();

  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  const handleMealPress = (mealId: string) => {
    setPanelData('ingredientSelector', { mealId });
    openPanel('ingredientSelector');
  };

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={mealSelectionStyles.grid}>
          {meals.map((meal) => {
            const mealVisual = MEAL_IMAGES[meal.title] || DEFAULT_IMAGE;
            return (
              <TouchableOpacity
                key={meal.id}
                activeOpacity={0.9}
                style={mealSelectionStyles.card}
                onPress={() => handleMealPress(meal.id)}
                accessibilityLabel={`Select ${meal.title}`}
              >
                <ImageBackground
                  source={{ uri: mealVisual.image }}
                  resizeMode="cover"
                  imageStyle={mealSelectionStyles.cardImage}
                  style={mealSelectionStyles.cardBg}
                >
                  <View style={mealSelectionStyles.chip}>
                    <Icon name={mealVisual.icon as any} size={20} color="#fff" />
                  </View>
                  <View style={mealSelectionStyles.cardOverlay} />
                  <Text style={mealSelectionStyles.cardTitle} numberOfLines={2}>
                    {meal.title}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {isPanelOpen('ingredientSelector') && <IngredientSelectorPanel />}
      {isPanelOpen('mealConfirmation') && <MealConfirmationPanel />}
      {isPanelOpen('plateVisualization') && <PlateVisualizationPanel />}
    </View>
  );
}
