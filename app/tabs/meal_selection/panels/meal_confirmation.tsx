import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePanels } from '../../../components/PanelContext';
import { useTheme } from '../../../hooks/useTheme';
import { useHistory, HistoryIngredient } from '../../../stores/historyStore';
import { useIngredients } from '../../../stores/ingredientsStore';
import { COLORS } from '../../../styles/global_style';
import { mealSelectionStyles } from '../../../styles/meal_selection';

export default function MealConfirmationPanel() {
  const { isDark, theme } = useTheme();

  const { closePanel, openPanel, getPanelData } = usePanels();
  const { meals, toggleItem } = useIngredients();
  const { addEntry } = useHistory();

  const panelData = getPanelData('mealConfirmation');
  const mealId = panelData?.mealId;
  const ingredients: HistoryIngredient[] = panelData?.ingredients ?? [];
  const meal = meals.find((m) => m.id === mealId);

  const [notes, setNotes] = useState('');

  if (!meal || ingredients.length === 0) return null;

  const handleEat = () => {
    // Add to history
    addEntry({
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mealType: meal.title,
      date: new Date().toISOString(),
      ingredients,
      notes,
    });

    // Reset checked state for all items in this meal
    meal.sections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.checked) {
          toggleItem(mealId, section.id, item.id);
        }
      });
    });

    // Close both panels
    setNotes('');
    closePanel('mealConfirmation');
    closePanel('ingredientSelector');
  };

  const handleBack = () => {
    closePanel('mealConfirmation');
  };

  const handleViewPlate = () => {
    openPanel('plateVisualization', { mealName: meal.title, ingredients });
  };

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={handleBack}
    >
      <View style={mealSelectionStyles.panelOverlay}>
        <View
          style={[
            mealSelectionStyles.panelContainer,
            { backgroundColor: theme.background },
          ]}
        >
          {/* Header */}
          <View
            style={[
              mealSelectionStyles.panelHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <Pressable
              style={mealSelectionStyles.panelCloseBtn}
              onPress={handleBack}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.text} />
            </Pressable>
            <Text style={[mealSelectionStyles.panelTitle, { color: theme.text, flex: 1, textAlign: 'center' }]}>
              {meal.title}
            </Text>
            <View style={mealSelectionStyles.panelCloseBtn} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Summary Header */}
            <View style={mealSelectionStyles.sectionHeader}>
              <Text style={[mealSelectionStyles.sectionTitle, { color: theme.subtext }]}>
                Your Portions
              </Text>
            </View>

            {/* Ingredients List */}
            {ingredients.map((ingredient, index) => (
              <View
                key={`${ingredient.id}-${index}`}
                style={[
                  mealSelectionStyles.ingredientRow,
                  { borderBottomColor: theme.border },
                ]}
              >
                <View style={mealSelectionStyles.ingredientLeft}>
                  <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
                  <Text
                    style={[
                      mealSelectionStyles.ingredientLabel,
                      { color: theme.text },
                    ]}
                  >
                    {ingredient.label}
                  </Text>
                </View>
                <Text
                  style={[
                    mealSelectionStyles.ingredientQty,
                    { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
                  ]}
                >
                  {ingredient.quantity} {ingredient.unit}
                </Text>
              </View>
            ))}

            {/* Notes Section */}
            <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
              <Text
                style={[
                  mealSelectionStyles.sectionTitle,
                  { color: theme.subtext, marginBottom: 8 },
                ]}
              >
                Notes (optional)
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 12,
                  padding: 14,
                  color: theme.text,
                  minHeight: 100,
                  textAlignVertical: 'top',
                  fontSize: 16,
                }}
                placeholder="How was your meal? Any observations..."
                placeholderTextColor={theme.subtext}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </ScrollView>

          {/* View Plate Button */}
          <Pressable
            style={[
              mealSelectionStyles.confirmButton,
              { backgroundColor: theme.card, marginBottom: 8 },
            ]}
            onPress={handleViewPlate}
          >
            <MaterialIcons name="pie-chart" size={20} color={theme.text} style={{ marginRight: 8 }} />
            <Text style={[mealSelectionStyles.confirmButtonText, { color: theme.text }]}>
              View Plate
            </Text>
          </Pressable>

          {/* Eat Button */}
          <Pressable
            style={[
              mealSelectionStyles.confirmButton,
              { marginBottom: 16 },
            ]}
            onPress={handleEat}
          >
            <MaterialIcons name="restaurant" size={20} color={COLORS.textDark} style={{ marginRight: 8 }} />
            <Text style={mealSelectionStyles.confirmButtonText}>
              Eat
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
