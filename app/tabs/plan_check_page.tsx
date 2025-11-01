import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View
} from "react-native";
import 'react-native-reanimated';
import { Item, Section, useIngredients } from '../ingredientsStore';
import { COLORS, styles } from '../styles/global_style';

export default function PlanCheckPage() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = isDark ? COLORS.dark : COLORS.light;

  const {
    ready,
    meals,
    toggleItem,
    resetMeals,
    // (you can also use addItem/removeItem/updateItem/addSection/etc. here)
  } = useIngredients();

  const toggleOpen = (mealId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => ({ ...o, [mealId]: !o[mealId] }));
  };

  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const keyOf = (mealId: string, sectionId: string) => `${mealId}:${sectionId}`;

  const isEditing = (mealId: string, sectionId: string) => !!editing[keyOf(mealId, sectionId)];
  const toggleEditing = (mealId: string, sectionId: string) =>
    setEditing(prev => ({ ...prev, [keyOf(mealId, sectionId)]: !prev[keyOf(mealId, sectionId)] }));


  const [open, setOpen] = useState<Record<string, boolean>>({});

  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const text = isDark ? COLORS.textLight : COLORS.textDark;
  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        bounces
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        {/* <View style={styles.statsWrap}>
          {stats.map((s) => (
            <View
              key={s.id}
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.subtext }]}>
                {s.label}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {s.value}
              </Text>
            </View>
          ))}
        </View> */}

        {/* Accordions (Meals) */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
          {meals.map((meal) => (
            <View
              key={meal.id}
              style={[styles.accordion, { backgroundColor: theme.card }]}
            >
              <Pressable
                onPress={() => toggleOpen(meal.id)}
                style={[styles.accordionHeader]}
                android_ripple={{ color: withOpacity(COLORS.primary, 0.15) }}
              >
                <Text
                  style={[styles.accordionTitle, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {meal.title}
                </Text>
                <MaterialIcons
                  name="expand-more"
                  size={22}
                  color={theme.text}
                  style={{ transform: [{ rotate: open[meal.id] ? "180deg" : "0deg" }] }}
                />
              </Pressable>

              {open[meal.id] && (
                <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                  {meal.sections.length === 0 ? (
                    <Text
                      style={{
                        color: theme.subtext,
                        textAlign: "center",
                        paddingVertical: 12,
                      }}
                    >
                      No Items
                    </Text>
                  ) : (
                    meal.sections.map((s) => (
                      SectionItem(meal.id, s, isDark, isEditing(meal.id, s.id), toggleEditing)
                    ))
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom bar (static UI; replace with Tabs if you prefer real navigation) */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: withOpacity(bg, 0.8), borderTopColor: theme.border },
        ]}
      >
        <BottomItem icon="home" label="Home" active={false} color={theme} />
        <BottomItem icon="menu-book" label="Plans" active color={theme} />
        <BottomItem icon="shopping-cart" label="Groceries" active={false} color={theme} />
        <BottomItem icon="person" label="Profile" active={false} color={theme} />
      </View>
    </View>
  );
}

function BottomItem({
  icon,
  label,
  active,
  color,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
  color: { text: string; subtext: string };
}) {
  return (
    <Pressable style={styles.bottomItem}>
      <MaterialIcons
        name={icon}
        size={22}
        color={active ? COLORS.primary : color.subtext}
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: active ? COLORS.primary : color.subtext,
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function withOpacity(hex: string, opacity: number) {
  const o = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return hex + o;
}

function SectionItem(mID: string, s: Section, isDark: boolean, isEditing: boolean, toggle:(mid: string, sid: string) => void) {
  const theme = isDark ? COLORS.dark : COLORS.light;

  return (
    <View key={s.id} style={styles.sectionRow}>
      <View style={styles.sectionLeft}>
        <View style={{ justifyContent: "center" }}>
          <View style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}>
            <Text
              style={[styles.sectionTitle, { color: theme.text }]}
              numberOfLines={1}
            >
              {s.title}
            </Text>
            <Pressable style={styles.iconBtn} onPress={() => toggle(mID, s.id)}>
              <MaterialIcons
                name={"edit"}
                size={22}
                color={theme.text}
              />
            </Pressable>
          </View>
          <View style={{ paddingHorizontal: 25 }}>
            {s.items.length === 0 ? (
              <Text
                style={{
                  color: theme.subtext,
                  textAlign: "center",
                }}
              >
                No items
              </Text>
            ) : (
              s.items.map((i) => (
                IngredientItem(mID, s.id, i, isDark, isEditing)
              ))
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

function IngredientItem(mID: string, sID: string, i: Item, isDark: boolean, isEditing: boolean) {
  const theme = isDark ? COLORS.dark : COLORS.light;

  return (
    <View key={i.id} style={styles.itemsRow}>
      <View style={styles.itemLeft}>
        {isEditing ? (
          <Text> Editing Mode </Text>
        ) : (
          <View style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}>
            <Text style={{
              color: theme.subtext,
            }}>
              {i.label}
            </Text>
            <Text style={{
              color: theme.subtext,
            }}>
              {i.baseQty} {i.unit}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}