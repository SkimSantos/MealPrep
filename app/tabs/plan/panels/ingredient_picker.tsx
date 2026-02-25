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
import ingredientsData from '../../../data/ingredients.json';
import { useTheme } from '../../../hooks/useTheme';
import { Item, useIngredients } from '../../../stores/ingredientsStore';
import { COLORS } from '../../../styles/global_style';
import { mealSelectionStyles } from '../../../styles/meal_selection';

type IngredientOption = {
  id: string;
  name: string;
  defaultUnit: string;
  defaultQty: number;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  ingredients: IngredientOption[];
};

export default function IngredientPickerPanel() {
  const { theme } = useTheme();
  const { closePanel, getPanelData, openPanel, setPanelData } = usePanels();
  const { addItem } = useIngredients();

  const panelData = getPanelData('ingredientPicker');
  const mealId = panelData?.mealId as string;
  const sectionId = panelData?.sectionId as string;

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!mealId || !sectionId) return null;

  const categories: Category[] = ingredientsData.categories;

  const handleSelectIngredient = (ingredient: IngredientOption) => {
    const newItem: Item = {
      id: `${ingredient.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: ingredient.name,
      checked: false,
      baseQty: ingredient.defaultQty,
      unit: ingredient.defaultUnit,
      weight: 1,
    };
    addItem(mealId, sectionId, newItem);
    closePanel('ingredientPicker');
  };

  const handleCustomIngredient = () => {
    setPanelData('customIngredient', { mealId, sectionId });
    openPanel('customIngredient');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const filteredCategories = searchQuery.trim()
    ? categories.map((cat) => ({
        ...cat,
        ingredients: cat.ingredients.filter((ing) =>
          ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.ingredients.length > 0)
    : categories;

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={() => closePanel('ingredientPicker')}
    >
      <View style={mealSelectionStyles.panelOverlay}>
        <View
          style={[
            mealSelectionStyles.panelContainer,
            { backgroundColor: theme.background, maxHeight: '90%' },
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
              onPress={() => closePanel('ingredientPicker')}
            >
              <MaterialIcons name="close" size={24} color={theme.text} />
            </Pressable>
            <Text style={[mealSelectionStyles.panelTitle, { color: theme.text, flex: 1, textAlign: 'center' }]}>
              Add Ingredient
            </Text>
            <View style={mealSelectionStyles.panelCloseBtn} />
          </View>

          {/* Search Bar */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.card,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <MaterialIcons name="search" size={20} color={theme.subtext} />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: theme.text,
                }}
                placeholder="Search ingredients..."
                placeholderTextColor={theme.subtext}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="clear" size={20} color={theme.subtext} />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredCategories.map((category) => (
              <View key={category.id}>
                <Pressable
                  onPress={() => toggleCategory(category.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: theme.card,
                    marginHorizontal: 16,
                    marginTop: 8,
                    borderRadius: 12,
                  }}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={22}
                    color={COLORS.primary}
                  />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      fontWeight: '600',
                      color: theme.text,
                    }}
                  >
                    {category.name}
                  </Text>
                  <Text style={{ color: theme.subtext, marginRight: 8 }}>
                    {category.ingredients.length}
                  </Text>
                  <MaterialIcons
                    name="expand-more"
                    size={22}
                    color={theme.text}
                    style={{
                      transform: [
                        { rotate: expandedCategory === category.id ? '180deg' : '0deg' },
                      ],
                    }}
                  />
                </Pressable>

                {(expandedCategory === category.id || searchQuery.trim()) && (
                  <View style={{ paddingHorizontal: 16 }}>
                    {category.ingredients.map((ingredient) => (
                      <Pressable
                        key={ingredient.id}
                        onPress={() => handleSelectIngredient(ingredient)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: theme.border,
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 15,
                            color: theme.text,
                          }}
                        >
                          {ingredient.name}
                        </Text>
                        <Text style={{ color: theme.subtext, fontSize: 13 }}>
                          {ingredient.defaultQty} {ingredient.defaultUnit}
                        </Text>
                        <MaterialIcons
                          name="add-circle-outline"
                          size={22}
                          color={COLORS.primary}
                          style={{ marginLeft: 12 }}
                        />
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Custom Ingredient Button */}
            <Pressable
              onPress={handleCustomIngredient}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 16,
                marginHorizontal: 16,
                marginTop: 16,
                marginBottom: 24,
                backgroundColor: COLORS.primary,
                borderRadius: 12,
              }}
            >
              <MaterialIcons name="add-circle" size={22} color={COLORS.textDark} />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.textDark,
                }}
              >
                Add Custom Ingredient
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
