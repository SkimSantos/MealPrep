import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { usePanels } from '../../components/PanelContext';
import { useTheme } from '../../hooks/useTheme';
import { Item, Section, useIngredients } from '../../stores/ingredientsStore';
import { COLORS, styles } from '../../styles/global_style';
import { planStyles } from '../../styles/plan';
import CustomIngredientPanel from './panels/custom_ingredient';
import IngredientPickerPanel from './panels/ingredient_picker';

export default function PlanTab() {
  const { isDark, theme } = useTheme();
  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const { openPanel, setPanelData, isPanelOpen } = usePanels();

  const {
    meals,
    addMeal,
    removeMeal,
    addSection,
    removeSection,
    renameSection,
    updateItem,
    removeItem,
    resetMeals,
  } = useIngredients();

  const [openMeals, setOpenMeals] = useState<Record<string, boolean>>({});
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMealName, setNewMealName] = useState('');

  const toggleMealOpen = (mealId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenMeals((prev) => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  const keyOf = (mealId: string, sectionId: string) => `${mealId}:${sectionId}`;
  const isEditing = (mealId: string, sectionId: string) =>
    !!editingSections[keyOf(mealId, sectionId)];
  const toggleEditing = (mealId: string, sectionId: string) =>
    setEditingSections((prev) => ({
      ...prev,
      [keyOf(mealId, sectionId)]: !prev[keyOf(mealId, sectionId)],
    }));

  const handleAddMeal = () => {
    if (newMealName.trim()) {
      const id = newMealName.trim().replace(/\s+/g, '_');
      addMeal({ id, title: newMealName.trim(), sections: [] });
      setNewMealName('');
      setShowAddMealModal(false);
    }
  };

  const handleAddSection = (mealId: string) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return;
    let count = meal.sections.length;
    let sectionId = `section${count}`;
    while (meal.sections.some((s) => s.id === sectionId)) {
      count++;
      sectionId = `section${count}`;
    }
    const newSection: Section = { id: sectionId, title: 'New Section', items: [] };
    addSection(mealId, newSection);
  };

  const handleAddItem = (mealId: string, sectionId: string) => {
    setPanelData('ingredientPicker', { mealId, sectionId });
    openPanel('ingredientPicker');
  };

  const handleReset = () => {
    resetMeals();
    setShowResetModal(false);
  };

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={planStyles.scrollContent}
        bounces
        showsVerticalScrollIndicator={false}
      >
        <View style={planStyles.mealsContainer}>
          {meals.map((meal) => (
            <View
              key={meal.id}
              style={[planStyles.accordion, { backgroundColor: theme.card }]}
            >
              <Pressable
                onPress={() => toggleMealOpen(meal.id)}
                style={planStyles.accordionHeader}
              >
                <Text style={[planStyles.accordionTitle, { color: theme.text }]}>
                  {meal.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pressable
                    style={planStyles.iconBtn}
                    onPress={() => removeMeal(meal.id)}
                  >
                    <MaterialIcons name="delete-outline" size={20} color={theme.subtext} />
                  </Pressable>
                  <MaterialIcons
                    name="expand-more"
                    size={22}
                    color={theme.text}
                    style={{ transform: [{ rotate: openMeals[meal.id] ? '180deg' : '0deg' }] }}
                  />
                </View>
              </Pressable>

              {openMeals[meal.id] && (
                <View style={planStyles.accordionContent}>
                  {meal.sections.length === 0 ? (
                    <Text style={[planStyles.emptyText, { color: theme.subtext }]}>
                      No sections yet
                    </Text>
                  ) : (
                    meal.sections.map((section) => (
                      <SectionEditor
                        key={section.id}
                        mealId={meal.id}
                        section={section}
                        theme={theme}
                        isEditing={isEditing(meal.id, section.id)}
                        toggleEditing={() => toggleEditing(meal.id, section.id)}
                        renameSection={renameSection}
                        removeSection={removeSection}
                        addItem={() => handleAddItem(meal.id, section.id)}
                        updateItem={updateItem}
                        removeItem={removeItem}
                      />
                    ))
                  )}
                  <TouchableOpacity
                    style={[planStyles.addButton, planStyles.addButtonSecondary]}
                    onPress={() => handleAddSection(meal.id)}
                  >
                    <MaterialIcons name="add" size={16} color={COLORS.textLight} />
                    <Text style={[planStyles.addButtonText, planStyles.addButtonTextLight]}>
                      Add Section
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={planStyles.fabContainer}>
        <TouchableOpacity
          style={[planStyles.fab, { backgroundColor: '#ef4444' }]}
          onPress={() => setShowResetModal(true)}
        >
          <MaterialIcons name="refresh" size={22} color="#fff" />
          <Text style={[planStyles.fabText, { color: '#fff' }]}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={planStyles.fab}
          onPress={() => setShowAddMealModal(true)}
        >
          <MaterialIcons name="add" size={22} color={COLORS.textDark} />
          <Text style={planStyles.fabText}>Add Meal</Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        visible={showResetModal}
        title="Reset Plan"
        message="Are you sure you want to reset your entire meal plan? This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
        destructive
      />

      {showAddMealModal && (
        <>
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 99,
            }}
            onPress={() => {
              setNewMealName('');
              setShowAddMealModal(false);
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: '40%',
              left: 20,
              right: 20,
              backgroundColor: theme.card,
              borderRadius: 16,
              padding: 24,
              zIndex: 100,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text, marginBottom: 16 }}>
              Add New Meal
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: theme.text,
                marginBottom: 16,
              }}
              placeholder="Meal name (e.g., Breakfast)"
              placeholderTextColor={theme.subtext}
              value={newMealName}
              onChangeText={setNewMealName}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setNewMealName('');
                  setShowAddMealModal(false);
                }}
              >
                <Text style={{ color: theme.text, fontWeight: '600' }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: COLORS.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleAddMeal}
              >
                <Text style={{ color: COLORS.textDark, fontWeight: '600' }}>Add</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      {isPanelOpen('ingredientPicker') && <IngredientPickerPanel />}
      {isPanelOpen('customIngredient') && <CustomIngredientPanel />}
    </View>
  );
}

type SectionEditorProps = {
  mealId: string;
  section: Section;
  theme: typeof COLORS.dark;
  isEditing: boolean;
  toggleEditing: () => void;
  renameSection: (mealId: string, sectionId: string, title: string) => void;
  removeSection: (mealId: string, sectionId: string) => void;
  addItem: () => void;
  updateItem: (mealId: string, sectionId: string, itemId: string, patch: Partial<Item>) => void;
  removeItem: (mealId: string, sectionId: string, itemId: string) => void;
};

function SectionEditor({
  mealId,
  section,
  theme,
  isEditing,
  toggleEditing,
  renameSection,
  removeSection,
  addItem,
  updateItem,
  removeItem,
}: SectionEditorProps) {
  return (
    <View style={planStyles.sectionContainer}>
      <View style={planStyles.sectionHeader}>
        {isEditing ? (
          <>
            <TextInput
              style={[
                planStyles.sectionTitleInput,
                { color: theme.text, borderColor: theme.border },
              ]}
              defaultValue={section.title}
              onChangeText={(text) => renameSection(mealId, section.id, text)}
            />
            <Pressable
              style={planStyles.iconBtn}
              onPress={() => removeSection(mealId, section.id)}
            >
              <MaterialIcons name="delete" size={20} color="#ef4444" />
            </Pressable>
          </>
        ) : (
          <Text style={[planStyles.sectionTitle, { color: theme.text }]}>
            {section.title}
          </Text>
        )}
        <Pressable style={planStyles.iconBtn} onPress={toggleEditing}>
          <MaterialIcons
            name={isEditing ? 'done' : 'edit'}
            size={20}
            color={theme.text}
          />
        </Pressable>
      </View>

      {section.items.length === 0 ? (
        <Text style={[planStyles.emptyText, { color: theme.subtext, paddingLeft: 16 }]}>
          No items
        </Text>
      ) : (
        section.items.map((item) => (
          <ItemEditor
            key={item.id}
            mealId={mealId}
            sectionId={section.id}
            item={item}
            theme={theme}
            isEditing={isEditing}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        ))
      )}

      {isEditing && (
        <TouchableOpacity style={planStyles.addButton} onPress={addItem}>
          <MaterialIcons name="add" size={16} color={COLORS.textDark} />
          <Text style={planStyles.addButtonText}>Add Ingredient</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

type ItemEditorProps = {
  mealId: string;
  sectionId: string;
  item: Item;
  theme: typeof COLORS.dark;
  isEditing: boolean;
  updateItem: (mealId: string, sectionId: string, itemId: string, patch: Partial<Item>) => void;
  removeItem: (mealId: string, sectionId: string, itemId: string) => void;
};

function ItemEditor({
  mealId,
  sectionId,
  item,
  theme,
  isEditing,
  updateItem,
  removeItem,
}: ItemEditorProps) {
  if (isEditing) {
    return (
      <View style={planStyles.itemRow}>
        <TextInput
          style={[planStyles.itemLabelInput, { color: theme.text, borderColor: theme.border }]}
          defaultValue={item.label}
          onChangeText={(text) => updateItem(mealId, sectionId, item.id, { label: text })}
        />
        <View style={planStyles.itemQtyContainer}>
          <TextInput
            style={[planStyles.itemQtyInput, { color: theme.text, borderColor: theme.border }]}
            defaultValue={item.baseQty?.toString()}
            keyboardType="numeric"
            onChangeText={(text) => {
              const qty = parseFloat(text);
              if (!isNaN(qty)) {
                updateItem(mealId, sectionId, item.id, { baseQty: qty });
              }
            }}
          />
          <TextInput
            style={[planStyles.itemUnitInput, { color: theme.text, borderColor: theme.border }]}
            defaultValue={item.unit}
            onChangeText={(text) => updateItem(mealId, sectionId, item.id, { unit: text })}
          />
          <TextInput
            style={[planStyles.itemWeightInput, { color: theme.subtext, borderColor: theme.border }]}
            defaultValue={item.weight?.toString() ?? '1'}
            keyboardType="numeric"
            placeholder="W"
            onChangeText={(text) => {
              const w = parseFloat(text);
              if (!isNaN(w)) {
                updateItem(mealId, sectionId, item.id, { weight: w });
              }
            }}
          />
          <Pressable
            style={planStyles.iconBtn}
            onPress={() => removeItem(mealId, sectionId, item.id)}
          >
            <MaterialIcons name="delete" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={planStyles.itemRow}>
      <Text style={[planStyles.itemLabel, { color: theme.text }]}>{item.label}</Text>
      <Text style={[planStyles.itemQty, { color: theme.subtext }]}>
        {item.baseQty} {item.unit}
      </Text>
    </View>
  );
}
