import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { usePanels } from '../../../components/PanelContext';
import { useTheme } from '../../../hooks/useTheme';
import { HistoryIngredient } from '../../../stores/historyStore';
import { calculateProportionalQty, useIngredients } from '../../../stores/ingredientsStore';
import { COLORS } from '../../../styles/global_style';
import { mealSelectionStyles } from '../../../styles/meal_selection';

export default function IngredientSelectorPanel() {
  const { isDark, theme } = useTheme();

  const { closePanel, getPanelData, openPanel, setPanelData } = usePanels();
  const { meals, toggleItem } = useIngredients();

  const panelData = getPanelData('ingredientSelector');
  const mealId = panelData?.mealId;
  const meal = meals.find((m) => m.id === mealId);

  if (!meal) return null;

  const handleConfirm = () => {
    // Build ingredients list with calculated quantities
    const ingredients: HistoryIngredient[] = [];
    
    meal.sections.forEach((section) => {
      const selectedItems = section.items.filter((i) => i.checked);
      selectedItems.forEach((item) => {
        const qtyStr = calculateProportionalQty(section.items, item.id);
        const qtyMatch = qtyStr.match(/^([\d.]+)/);
        const qty = qtyMatch ? parseFloat(qtyMatch[1]) : item.baseQty ?? 0;
        
        ingredients.push({
          id: item.id,
          label: item.label,
          quantity: qty,
          unit: item.unit ?? '',
        });
      });
    });

    // Open confirmation panel with the calculated ingredients
    if (ingredients.length > 0) {
      setPanelData('mealConfirmation', { mealId, ingredients });
      openPanel('mealConfirmation');
    }
  };

  const hasSelectedItems = meal.sections.some((s) =>
    s.items.some((i) => i.checked)
  );

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={() => closePanel('ingredientSelector')}
    >
      <View style={mealSelectionStyles.panelOverlay}>
        <View
          style={[
            mealSelectionStyles.panelContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <View
            style={[
              mealSelectionStyles.panelHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <Text style={[mealSelectionStyles.panelTitle, { color: theme.text }]}>
              {meal.title}
            </Text>
            <Pressable
              style={mealSelectionStyles.panelCloseBtn}
              onPress={() => closePanel('ingredientSelector')}
            >
              <MaterialIcons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {meal.sections.length === 0 ? (
              <Text
                style={[
                  mealSelectionStyles.sectionTitle,
                  { color: theme.subtext, textAlign: 'center', padding: 24 },
                ]}
              >
                No ingredients in this meal. Add some in the Plan tab.
              </Text>
            ) : (
              meal.sections.map((section) => (
                <View key={section.id}>
                  <View style={mealSelectionStyles.sectionHeader}>
                    <Text
                      style={[
                        mealSelectionStyles.sectionTitle,
                        { color: theme.subtext },
                      ]}
                    >
                      {section.title}
                    </Text>
                  </View>
                  {section.items.map((item) => (
                    <Pressable
                      key={item.id}
                      style={[
                        mealSelectionStyles.ingredientRow,
                        { borderBottomColor: theme.border },
                      ]}
                      onPress={() => toggleItem(mealId, section.id, item.id)}
                    >
                      <View style={mealSelectionStyles.ingredientLeft}>
                        <Checkbox
                          value={item.checked}
                          onValueChange={() =>
                            toggleItem(mealId, section.id, item.id)
                          }
                          color={item.checked ? COLORS.primary : undefined}
                          style={mealSelectionStyles.checkbox}
                        />
                        <Text
                          style={[
                            mealSelectionStyles.ingredientLabel,
                            {
                              color: item.checked ? theme.text : theme.subtext,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                      <Text
                        style={[
                          mealSelectionStyles.ingredientQty,
                          { color: item.checked ? COLORS.primary : theme.subtext },
                        ]}
                      >
                        {item.checked
                          ? calculateProportionalQty(section.items, item.id)
                          : `${item.baseQty ?? ''} ${item.unit ?? ''}`.trim()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ))
            )}
          </ScrollView>

          {hasSelectedItems && (
            <Pressable
              style={mealSelectionStyles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={mealSelectionStyles.confirmButtonText}>
                Confirm Selection
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
