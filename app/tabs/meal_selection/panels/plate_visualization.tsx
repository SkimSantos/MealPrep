import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { usePanels } from '../../../components/PanelContext';
import { useTheme } from '../../../hooks/useTheme';
import { HistoryIngredient } from '../../../stores/historyStore';
import { COLORS } from '../../../styles/global_style';
import { mealSelectionStyles } from '../../../styles/meal_selection';

const PLATE_COLORS = [
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#2196F3', // Blue
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FF5722', // Deep Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#F44336', // Red
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLATE_SIZE = Math.min(SCREEN_WIDTH - 80, 300);
const PLATE_RADIUS = PLATE_SIZE / 2;

export default function PlateVisualizationPanel() {
  const { theme } = useTheme();
  const { closePanel, getPanelData } = usePanels();

  const panelData = getPanelData('plateVisualization');
  const mealName = panelData?.mealName as string;
  const ingredients: HistoryIngredient[] = panelData?.ingredients ?? [];

  if (!ingredients.length) return null;

  // Calculate total weight for proportions
  const totalQuantity = ingredients.reduce((sum, ing) => sum + ing.quantity, 0);

  // Calculate circle sizes that will fit on the plate
  const calculateCircleSizes = (): number[] => {
    const baseMinSize = 40;
    const usableDiameter = (PLATE_RADIUS - 15) * 2; // Usable plate diameter
    
    // Calculate raw proportional sizes
    const rawSizes = ingredients.map(ing => {
      const proportion = ing.quantity / totalQuantity;
      // Base size on proportion, with minimum
      return Math.max(baseMinSize, proportion * PLATE_SIZE * 0.8);
    });
    
    // Sort to find the two largest
    const sortedSizes = [...rawSizes].sort((a, b) => b - a);
    
    // Key constraint: the two largest circles must fit side by side
    // Their combined diameters + gap must be <= usable diameter
    const gap = 10;
    let scaleFactor = 1;
    
    if (sortedSizes.length >= 2) {
      const twoLargestWidth = sortedSizes[0] + sortedSizes[1] + gap;
      if (twoLargestWidth > usableDiameter) {
        scaleFactor = usableDiameter / twoLargestWidth;
      }
    } else if (sortedSizes.length === 1) {
      // Single circle: max 80% of usable diameter
      if (sortedSizes[0] > usableDiameter * 0.8) {
        scaleFactor = (usableDiameter * 0.8) / sortedSizes[0];
      }
    }
    
    // Also check total area coverage
    const usableRadius = PLATE_RADIUS - 15;
    const scaledSizes = rawSizes.map(s => s * scaleFactor);
    const totalArea = scaledSizes.reduce((sum, size) => sum + Math.PI * (size / 2) ** 2, 0);
    const plateArea = Math.PI * usableRadius ** 2;
    const maxCoverage = 0.6;
    
    if (totalArea > plateArea * maxCoverage) {
      const areaScaleFactor = Math.sqrt((plateArea * maxCoverage) / totalArea);
      scaleFactor *= areaScaleFactor;
    }
    
    // Apply scale factor with min size preserved
    return rawSizes.map(size => 
      Math.max(baseMinSize, size * scaleFactor)
    );
  };

  const circleSizes = calculateCircleSizes();

  // Position circles on the plate
  const positionCircles = () => {
    const positioned: { x: number; y: number; size: number; ingredient: HistoryIngredient; color: string }[] = [];
    
    // Sort by size (largest first for better packing)
    const ingredientsWithSizes = ingredients.map((ing, i) => ({ 
      ingredient: ing, 
      size: circleSizes[i],
      originalIndex: i 
    }));
    const sortedIngredients = [...ingredientsWithSizes].sort((a, b) => b.size - a.size);
    
    const usableRadius = PLATE_RADIUS - 10;
    const gap = 6;
    
    // Helper to check if position is valid
    const isValidPosition = (x: number, y: number, size: number): boolean => {
      // Check plate bounds
      const distFromCenter = Math.sqrt(Math.pow(x - PLATE_RADIUS, 2) + Math.pow(y - PLATE_RADIUS, 2));
      if (distFromCenter + size / 2 > usableRadius) return false;
      
      // Check collisions with existing circles
      for (const other of positioned) {
        const dist = Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));
        if (dist < (size / 2 + other.size / 2 + gap)) return false;
      }
      return true;
    };
    
    // For 2 items: place them side by side horizontally
    if (sortedIngredients.length === 2) {
      const [first, second] = sortedIngredients;
      const totalWidth = first.size + second.size + gap;
      const startX = PLATE_RADIUS - totalWidth / 2 + first.size / 2;
      
      positioned.push({
        x: startX,
        y: PLATE_RADIUS,
        size: first.size,
        ingredient: first.ingredient,
        color: PLATE_COLORS[first.originalIndex % PLATE_COLORS.length]
      });
      
      positioned.push({
        x: startX + first.size / 2 + gap + second.size / 2,
        y: PLATE_RADIUS,
        size: second.size,
        ingredient: second.ingredient,
        color: PLATE_COLORS[second.originalIndex % PLATE_COLORS.length]
      });
      
      return positioned;
    }
    
    // For 3+ items: place first two side by side, then pack others around
    if (sortedIngredients.length >= 3) {
      const [first, second, ...rest] = sortedIngredients;
      const topRowWidth = first.size + second.size + gap;
      const startX = PLATE_RADIUS - topRowWidth / 2 + first.size / 2;
      
      // Place first two side by side at top
      const topY = PLATE_RADIUS - Math.max(first.size, second.size) * 0.2;
      
      positioned.push({
        x: startX,
        y: topY,
        size: first.size,
        ingredient: first.ingredient,
        color: PLATE_COLORS[first.originalIndex % PLATE_COLORS.length]
      });
      
      positioned.push({
        x: startX + first.size / 2 + gap + second.size / 2,
        y: topY,
        size: second.size,
        ingredient: second.ingredient,
        color: PLATE_COLORS[second.originalIndex % PLATE_COLORS.length]
      });
      
      // Place remaining circles below
      rest.forEach((item) => {
        const size = item.size;
        const color = PLATE_COLORS[item.originalIndex % PLATE_COLORS.length];
        let bestPos = { x: PLATE_RADIUS, y: PLATE_RADIUS };
        let placed = false;
        
        // Try placing below existing circles
        for (const existing of positioned) {
          if (placed) break;
          const minDist = existing.size / 2 + size / 2 + gap;
          
          // Prefer bottom positions
          for (let angle = Math.PI / 4; angle < Math.PI * 3 / 4; angle += Math.PI / 24) {
            const x = existing.x + minDist * Math.cos(angle);
            const y = existing.y + minDist * Math.sin(angle);
            
            if (isValidPosition(x, y, size)) {
              bestPos = { x, y };
              placed = true;
              break;
            }
          }
        }
        
        // Fallback: find any valid position
        if (!placed) {
          for (let radius = 0; radius <= usableRadius && !placed; radius += 5) {
            for (let angle = 0; angle < Math.PI * 2 && !placed; angle += Math.PI / 16) {
              const x = PLATE_RADIUS + radius * Math.cos(angle);
              const y = PLATE_RADIUS + radius * Math.sin(angle);
              
              if (isValidPosition(x, y, size)) {
                bestPos = { x, y };
                placed = true;
              }
            }
          }
        }
        
        positioned.push({ ...bestPos, size, ingredient: item.ingredient, color });
      });
      
      return positioned;
    }
    
    // Single item: center it
    if (sortedIngredients.length === 1) {
      const item = sortedIngredients[0];
      positioned.push({
        x: PLATE_RADIUS,
        y: PLATE_RADIUS,
        size: item.size,
        ingredient: item.ingredient,
        color: PLATE_COLORS[item.originalIndex % PLATE_COLORS.length]
      });
    }
    
    return positioned;
  };

  const circles = positionCircles();

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={() => closePanel('plateVisualization')}
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
              onPress={() => closePanel('plateVisualization')}
            >
              <MaterialIcons name="close" size={24} color={theme.text} />
            </Pressable>
            <Text style={[mealSelectionStyles.panelTitle, { color: theme.text, flex: 1, textAlign: 'center' }]}>
              Your Plate
            </Text>
            <View style={mealSelectionStyles.panelCloseBtn} />
          </View>

          {/* Meal Name */}
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600', color: theme.text, marginTop: 16 }}>
            {mealName}
          </Text>

          {/* Plate Container */}
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            {/* Plate */}
            <View
              style={{
                width: PLATE_SIZE,
                height: PLATE_SIZE,
                borderRadius: PLATE_SIZE / 2,
                backgroundColor: theme.card,
                borderWidth: 8,
                borderColor: theme.border,
                position: 'relative',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {/* Inner plate ring */}
              <View
                style={{
                  position: 'absolute',
                  top: 15,
                  left: 15,
                  right: 15,
                  bottom: 15,
                  borderRadius: (PLATE_SIZE - 30) / 2,
                  borderWidth: 2,
                  borderColor: theme.border,
                  opacity: 0.3,
                }}
              />
              
              {/* Food circles */}
              {circles.map(({ x, y, size, ingredient, color }, index) => (
                <View
                  key={`${ingredient.id}-${index}`}
                  style={{
                    position: 'absolute',
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: Math.max(9, Math.min(12, size / 5)),
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                    numberOfLines={2}
                  >
                    {ingredient.label.split(' ')[0]}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: Math.max(8, Math.min(10, size / 6)),
                      fontWeight: '500',
                    }}
                  >
                    {ingredient.quantity}{ingredient.unit}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Legend */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtext, marginBottom: 12 }}>
              Ingredients
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {circles.map(({ ingredient, color }, index) => (
                <View
                  key={`legend-${ingredient.id}-${index}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.card,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: color,
                      marginRight: 6,
                    }}
                  />
                  <Text style={{ color: theme.text, fontSize: 12 }}>
                    {ingredient.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Close Button */}
          <Pressable
            style={[
              mealSelectionStyles.confirmButton,
              { marginBottom: 16 },
            ]}
            onPress={() => closePanel('plateVisualization')}
          >
            <MaterialIcons name="check" size={20} color={COLORS.textDark} style={{ marginRight: 8 }} />
            <Text style={mealSelectionStyles.confirmButtonText}>
              Got it
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
