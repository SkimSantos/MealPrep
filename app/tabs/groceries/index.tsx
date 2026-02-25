import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { usePanels } from '../../components/PanelContext';
import { useTheme } from '../../hooks/useTheme';
import { useGroceries } from '../../stores/groceriesStore';
import { COLORS, styles } from '../../styles/global_style';
import { groceriesStyles } from '../../styles/groceries';
import AddItemPanel from './panels/add_item';

export default function GroceriesTab() {
  const { isDark, theme } = useTheme();
  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  const { items, toggleItem, removeItem, clearChecked, clearAll } = useGroceries();
  const { openPanel, isPanelOpen } = usePanels();

  const [showClearModal, setShowClearModal] = React.useState(false);

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      {items.length > 0 && (
        <View style={groceriesStyles.headerActions}>
          {checkedCount > 0 && (
            <Pressable
              style={[groceriesStyles.headerButton, { backgroundColor: theme.card }]}
              onPress={clearChecked}
            >
              <MaterialIcons name="delete-sweep" size={18} color={theme.text} />
              <Text style={[groceriesStyles.headerButtonText, { color: theme.text }]}>
                Clear Checked ({checkedCount})
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[groceriesStyles.headerButton, { backgroundColor: '#ef4444' }]}
            onPress={() => setShowClearModal(true)}
          >
            <MaterialIcons name="delete" size={18} color="#fff" />
            <Text style={[groceriesStyles.headerButtonText, { color: '#fff' }]}>
              Clear All
            </Text>
          </Pressable>
        </View>
      )}

      {items.length === 0 ? (
        <View style={groceriesStyles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={64} color={theme.subtext} />
          <Text style={[groceriesStyles.emptyText, { color: theme.subtext }]}>
            Your grocery list is empty.{'\n'}Tap + to add items.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={groceriesStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <View
              key={item.id}
              style={[groceriesStyles.itemCard, { backgroundColor: theme.card }]}
            >
              <Checkbox
                value={item.checked}
                onValueChange={() => toggleItem(item.id)}
                color={item.checked ? COLORS.primary : undefined}
                style={groceriesStyles.checkbox}
              />
              <View style={groceriesStyles.itemContent}>
                <Text
                  style={[
                    groceriesStyles.itemName,
                    { color: theme.text },
                    item.checked && groceriesStyles.itemNameChecked,
                  ]}
                >
                  {item.name}
                </Text>
                {(item.quantity || item.unit) && (
                  <Text style={[groceriesStyles.itemQty, { color: theme.subtext }]}>
                    {item.quantity} {item.unit}
                  </Text>
                )}
                <Pressable
                  style={groceriesStyles.deleteBtn}
                  onPress={() => removeItem(item.id)}
                >
                  <MaterialIcons name="close" size={20} color={theme.subtext} />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={groceriesStyles.fab}
        onPress={() => openPanel('addGroceryItem')}
      >
        <MaterialIcons name="add" size={28} color={COLORS.textDark} />
      </TouchableOpacity>

      {isPanelOpen('addGroceryItem') && <AddItemPanel />}

      <ConfirmationModal
        visible={showClearModal}
        title="Clear All Items"
        message="Are you sure you want to remove all items from your grocery list?"
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={() => {
          clearAll();
          setShowClearModal(false);
        }}
        onCancel={() => setShowClearModal(false)}
        destructive
      />
    </View>
  );
}
