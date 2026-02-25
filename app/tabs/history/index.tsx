import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { usePanels } from '../../components/PanelContext';
import { useTheme } from '../../hooks/useTheme';
import { useHistory } from '../../stores/historyStore';
import { COLORS, styles } from '../../styles/global_style';
import { historyStyles } from '../../styles/history';
import HistoryDetailPanel from './panels/history_detail';

const MEAL_ICONS: Record<string, string> = {
  Breakfast: 'light-mode',
  Lunch: 'lunch-dining',
  Snack: 'bakery-dining',
  Dinner: 'dinner-dining',
};

export default function HistoryTab() {
  const { isDark, theme } = useTheme();
  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  const { entries } = useHistory();
  const { openPanel, setPanelData, isPanelOpen } = usePanels();

  const handleEntryPress = (entryId: string) => {
    setPanelData('historyDetail', { entryId });
    openPanel('historyDetail');
  };

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      {entries.length === 0 ? (
        <View style={historyStyles.emptyContainer}>
          <MaterialIcons name="history" size={64} color={theme.subtext} />
          <Text style={[historyStyles.emptyText, { color: theme.subtext }]}>
            No meal history yet.{'\n'}Start by selecting a meal!
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={historyStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(groupedEntries).map(([date, dateEntries]) => (
            <View key={date}>
              <Text style={[historyStyles.dateHeader, { color: theme.subtext }]}>
                {date}
              </Text>
              {dateEntries.map((entry) => (
                <Pressable
                  key={entry.id}
                  style={[historyStyles.entryCard, { backgroundColor: theme.card }]}
                  onPress={() => handleEntryPress(entry.id)}
                >
                  <View style={historyStyles.entryHeader}>
                    <View style={historyStyles.entryLeft}>
                      <View style={historyStyles.mealIcon}>
                        <MaterialIcons
                          name={(MEAL_ICONS[entry.mealType] || 'restaurant') as any}
                          size={24}
                          color={COLORS.primary}
                        />
                      </View>
                      <View style={historyStyles.entryInfo}>
                        <Text style={[historyStyles.mealType, { color: theme.text }]}>
                          {entry.mealType}
                        </Text>
                        <Text style={[historyStyles.entryTime, { color: theme.subtext }]}>
                          {formatTime(entry.date)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[historyStyles.ingredientCount, { color: theme.subtext }]}>
                      {entry.ingredients.length} item{entry.ingredients.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {isPanelOpen('historyDetail') && <HistoryDetailPanel />}
    </View>
  );
}
