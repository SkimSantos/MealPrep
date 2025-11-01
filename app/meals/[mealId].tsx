import { MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Platform,
  Pressable,
  Text,
  useColorScheme,
  View
} from "react-native";
import { COLORS, styles } from '../styles/global_style';

import { useIngredients } from "../ingredientsStore";

type Item = { id: string; label: string; checked: boolean; baseQty?: number; unit?: string };
type Section = { id: string; title: string; items: Item[] };

type mealProps = {
  name: string;
  callback: void;
}

export default function IngredientListPage(props: mealProps) {
  const { mealId } = useLocalSearchParams<{ mealId: string }>();
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

  const meal = meals.find((m) => m.id === mealId);

  const data =
    meal?.sections.flatMap((sec) => [
      { type: "section" as const, id: `s-${sec.id}`, title: sec.title },
      ...sec.items.map((it) => ({
        type: "row" as const,
        id: `${sec.id}-${it.id}`,
        secId: sec.id,
        item: it,
      })),
    ]) ?? [];

  const formatQty = (baseQty?: number, unit?: string) => {
    if (baseQty == null) return "";
    const scaled = +(baseQty).toFixed(2);
    return `${stripTrailingZeros(scaled)} ${unit ?? ""}`.trim();
  };

  const stripTrailingZeros = (n: number) => {
    const s = n.toString();
    return s.includes(".") ? s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1") : s;
  };

  if (!meal) {
    return (
      <View style={[styles.safe, { backgroundColor: theme.background, padding: 16 }]}>
        <Text style={{ color: theme.text, fontSize: 16, marginBottom: 12 }}>
          Meal not found. { mealId }
        </Text>
        <Pressable onPress={() => {
          resetMeals();
          router.back()
        }} style={[styles.chip, { borderColor: theme.border }]}>
          <Text style={{ color: theme.text }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Top App Bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: withOpacity(theme.background, 0.8),
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable style={styles.iconBtn} onPress={() => (router.canGoBack() ? router.back() : null)}>
          <MaterialIcons
            name={Platform.OS === "ios" ? "arrow-back-ios-new" : "arrow-back"}
            size={22}
            color={theme.text}
          />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>{ meal.title }</Text>
        <View style={styles.iconBtn} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Sections + Items */}
        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }} // space for sticky footer
          data={data}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            if (item.type === "section") {
              return (
                <View style={[styles.cardIngredient, { backgroundColor: theme.card }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{item.title}</Text>
                </View>
              );
            }
            // item
            const it = item.item;
            return (
              <View
                style={[
                  styles.cardInnerRow,
                  { backgroundColor: theme.card, borderBottomColor: theme.border },
                ]}
              >
                <View style={styles.checkboxRow}>
                  <Checkbox
                    value={it.checked}
                    onValueChange={() => toggleItem(mealId, item.secId, it.id)}
                    color={it.checked ? COLORS.primary : undefined}
                    style={styles.checkbox}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: it.checked ? "#6b7280" : theme.text, // gray-500 when checked
                      },
                    ]}
                  >
                    {it.label} - {formatQty(it.baseQty, it.unit)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* Sticky Footer */}
      {/* <View
        style={[
          styles.footer,
          {
            backgroundColor: withOpacity(theme.background, 0.8),
            borderTopColor: theme.border,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            // Do something (e.g., save to a list)
            
          }}
          style={[styles.ctaBtn, { backgroundColor: COLORS.primary }]}
        >
          <Text
            style={[
              styles.ctaText,
              { color: isDark ? COLORS.dark.background : COLORS.light.text },
            ]}
          >
            Confirm Selection
          </Text>
        </Pressable>
      </View> */}
    </View>
  );
}

function withOpacity(hex: string, opacity: number) {
  // hex like #rrggbb
  // opacity 0..1
  const o = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return hex + o;
}