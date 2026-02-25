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

export default function CustomIngredientPanel() {
  const { theme } = useTheme();
  const { closePanel, getPanelData } = usePanels();
  const { addItem } = useIngredients();

  const panelData = getPanelData('customIngredient');
  const mealId = panelData?.mealId as string;
  const sectionId = panelData?.sectionId as string;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('g');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!mealId || !sectionId) return null;

  const categories = [
    ...ingredientsData.categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon })),
    { id: 'custom', name: 'Custom', icon: 'add-circle' },
  ];

  const handleAdd = () => {
    if (!name.trim()) return;

    const qty = parseFloat(quantity) || 1;
    const newItem: Item = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: name.trim(),
      checked: false,
      baseQty: qty,
      unit: unit.trim() || 'units',
      weight: 1,
    };

    addItem(mealId, sectionId, newItem);
    closePanel('customIngredient');
    closePanel('ingredientPicker');
  };

  const handleBack = () => {
    closePanel('customIngredient');
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
            { backgroundColor: theme.background, maxHeight: '85%' },
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
              Custom Ingredient
            </Text>
            <View style={mealSelectionStyles.panelCloseBtn} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
          >
            {/* Name Input */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtext, marginBottom: 8 }}>
              Name *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                padding: 14,
                fontSize: 16,
                color: theme.text,
                marginBottom: 20,
                backgroundColor: theme.card,
              }}
              placeholder="e.g., Protein Powder"
              placeholderTextColor={theme.subtext}
              value={name}
              onChangeText={setName}
              autoFocus
            />

            {/* Quantity & Unit */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtext, marginBottom: 8 }}>
                  Default Quantity
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 16,
                    color: theme.text,
                    backgroundColor: theme.card,
                  }}
                  placeholder="1"
                  placeholderTextColor={theme.subtext}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtext, marginBottom: 8 }}>
                  Unit
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 16,
                    color: theme.text,
                    backgroundColor: theme.card,
                  }}
                  placeholder="g, ml, units..."
                  placeholderTextColor={theme.subtext}
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            {/* Category Selector */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtext, marginBottom: 8 }}>
              Category (optional)
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selectedCategory === cat.id ? COLORS.primary : theme.card,
                    borderWidth: 1,
                    borderColor: selectedCategory === cat.id ? COLORS.primary : theme.border,
                  }}
                >
                  <MaterialIcons
                    name={cat.icon as any}
                    size={16}
                    color={selectedCategory === cat.id ? COLORS.textDark : theme.text}
                  />
                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: 13,
                      fontWeight: '500',
                      color: selectedCategory === cat.id ? COLORS.textDark : theme.text,
                    }}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Add Button */}
          <Pressable
            onPress={handleAdd}
            style={[
              mealSelectionStyles.confirmButton,
              {
                marginBottom: 16,
                opacity: name.trim() ? 1 : 0.5,
              },
            ]}
            disabled={!name.trim()}
          >
            <MaterialIcons name="add" size={20} color={COLORS.textDark} style={{ marginRight: 8 }} />
            <Text style={mealSelectionStyles.confirmButtonText}>
              Add Ingredient
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
