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
import ConfirmationModal from '../../../components/ConfirmationModal';
import { usePanels } from '../../../components/PanelContext';
import { useTheme } from '../../../hooks/useTheme';
import { useHistory } from '../../../stores/historyStore';
import { COLORS } from '../../../styles/global_style';
import { historyStyles } from '../../../styles/history';

export default function HistoryDetailPanel() {
  const { isDark, theme } = useTheme();

  const { closePanel, getPanelData } = usePanels();
  const { entries, updateEntry, removeEntry } = useHistory();

  const panelData = getPanelData('historyDetail');
  const entryId = panelData?.entryId;
  const entry = entries.find((e) => e.id === entryId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notes, setNotes] = useState(entry?.notes ?? '');

  if (!entry) return null;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })} at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  };

  const handleSaveNotes = () => {
    updateEntry(entry.id, { notes });
  };

  const handleDelete = () => {
    removeEntry(entry.id);
    setShowDeleteModal(false);
    closePanel('historyDetail');
  };

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={() => closePanel('historyDetail')}
    >
      <View style={historyStyles.panelOverlay}>
        <View
          style={[
            historyStyles.panelContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <View
            style={[
              historyStyles.panelHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <View style={historyStyles.panelHeaderLeft}>
              <Text style={[historyStyles.panelTitle, { color: theme.text }]}>
                {entry.mealType}
              </Text>
              <Text style={[historyStyles.panelSubtitle, { color: theme.subtext }]}>
                {formatDateTime(entry.date)}
              </Text>
            </View>
            <Pressable
              style={historyStyles.panelCloseBtn}
              onPress={() => {
                handleSaveNotes();
                closePanel('historyDetail');
              }}
            >
              <MaterialIcons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView style={historyStyles.panelContent}>
            <View style={historyStyles.ingredientsList}>
              <Text style={[historyStyles.ingredientsTitle, { color: theme.subtext }]}>
                Ingredients
              </Text>
              {entry.ingredients.map((ingredient, index) => (
                <View
                  key={`${ingredient.id}-${index}`}
                  style={[
                    historyStyles.ingredientRow,
                    { borderBottomColor: theme.border },
                  ]}
                >
                  <Text style={[historyStyles.ingredientLabel, { color: theme.text }]}>
                    {ingredient.label}
                  </Text>
                  <Text style={[historyStyles.ingredientQty, { color: COLORS.primary }]}>
                    {ingredient.quantity} {ingredient.unit}
                  </Text>
                </View>
              ))}
            </View>

            <View style={historyStyles.notesContainer}>
              <Text style={[historyStyles.notesTitle, { color: theme.subtext }]}>
                Notes
              </Text>
              <TextInput
                style={[
                  historyStyles.notesInput,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Add notes about this meal..."
                placeholderTextColor={theme.subtext}
                value={notes}
                onChangeText={setNotes}
                onBlur={handleSaveNotes}
                multiline
              />
            </View>

            <Pressable
              style={historyStyles.deleteButton}
              onPress={() => setShowDeleteModal(true)}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={historyStyles.deleteButtonText}>Delete Entry</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Entry"
        message="Are you sure you want to delete this meal from your history?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        destructive
      />
    </Modal>
  );
}
