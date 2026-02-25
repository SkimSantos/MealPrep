import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePanels } from '../../../components/PanelContext';
import { useTheme } from '../../../hooks/useTheme';
import { useGroceries } from '../../../stores/groceriesStore';
import { COLORS } from '../../../styles/global_style';
import { groceriesStyles } from '../../../styles/groceries';

export default function AddItemPanel() {
  const { isDark, theme } = useTheme();

  const { closePanel } = usePanels();
  const { addItem } = useGroceries();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      addItem({
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        quantity: quantity ? parseFloat(quantity) : undefined,
        unit: unit.trim() || undefined,
        checked: false,
      });
      setName('');
      setQuantity('');
      setUnit('');
      closePanel('addGroceryItem');
    }
  };

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={() => closePanel('addGroceryItem')}
    >
      <View style={groceriesStyles.panelOverlay}>
        <View
          style={[
            groceriesStyles.panelContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <View
            style={[
              groceriesStyles.panelHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <Text style={[groceriesStyles.panelTitle, { color: theme.text }]}>
              Add Item
            </Text>
            <Pressable
              style={groceriesStyles.panelCloseBtn}
              onPress={() => closePanel('addGroceryItem')}
            >
              <MaterialIcons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={groceriesStyles.panelContent}>
            <Text style={[groceriesStyles.inputLabel, { color: theme.subtext }]}>
              Item Name *
            </Text>
            <TextInput
              style={[
                groceriesStyles.textInput,
                { color: theme.text, borderColor: theme.border },
              ]}
              placeholder="e.g., Chicken breast"
              placeholderTextColor={theme.subtext}
              value={name}
              onChangeText={setName}
              autoFocus
            />

            <View style={groceriesStyles.rowInputs}>
              <View style={groceriesStyles.halfInput}>
                <Text style={[groceriesStyles.inputLabel, { color: theme.subtext }]}>
                  Quantity
                </Text>
                <TextInput
                  style={[
                    groceriesStyles.textInput,
                    { color: theme.text, borderColor: theme.border },
                  ]}
                  placeholder="e.g., 2"
                  placeholderTextColor={theme.subtext}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
              <View style={groceriesStyles.halfInput}>
                <Text style={[groceriesStyles.inputLabel, { color: theme.subtext }]}>
                  Unit
                </Text>
                <TextInput
                  style={[
                    groceriesStyles.textInput,
                    { color: theme.text, borderColor: theme.border },
                  ]}
                  placeholder="e.g., lbs"
                  placeholderTextColor={theme.subtext}
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            <Pressable
              style={[
                groceriesStyles.addButton,
                !name.trim() && { opacity: 0.5 },
              ]}
              onPress={handleAdd}
              disabled={!name.trim()}
            >
              <Text style={groceriesStyles.addButtonText}>Add to List</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
