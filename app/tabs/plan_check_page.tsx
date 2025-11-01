import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
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
    renameSection,
    addSection,
    removeSection,
    addItem,
    updateItem,
    removeItem
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

  const addNewSection = (mid: string) => {
    const meal = meals.find(m => m.id === mid);
    if(meal === undefined) return;
    let sectionCount = meal.sections.length;
    if(sectionCount === undefined) sectionCount = 0;
    let sectionName = "section" + sectionCount.toString;
    while(meal.sections.filter(s => s.id === sectionName).length > 0) {
      sectionCount++;
      sectionName = "Section "+sectionCount.toString;
    }
    const newSection: Section = {id:sectionName, title:"New Section", items:[]}
    addSection(mid, newSection)
  }

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
                      SectionItem(
                        meal.id, 
                        s, 
                        isDark, 
                        isEditing(meal.id, s.id), 
                        toggleEditing, 
                        renameSection, 
                        addItem, 
                        updateItem, 
                        removeItem,
                        removeSection,
                      )
                    ))
                  )}
                  <TouchableOpacity activeOpacity={0.9}
                    style={[styles.subFab, {backgroundColor: COLORS.secondary, shadowColor: COLORS.secondary}]}
                    onPress={() => addNewSection(meal.id)}
                  >
                    <MaterialIcons name="add" size={15} color={COLORS.textLight} />
                    <Text style={[styles.fabText, {color: COLORS.textLight}]}>Add Section</Text>
                  </TouchableOpacity>
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

function SectionItem(mID: string, s: Section, isDark: boolean, isEditing: boolean,
  toggle: (mid: string, sid: string) => void,
  renameSec: (mid: string, sid: string, text: string) => void,
  addItem: (mid: string, sid: string, newItem: Item) => void,
  updateItem: (mid: string, sid: string, iid: string, patch: Partial<Item>) => void,
  removeItem: (mid:string, sid:string, iid:string) => void,
  removeSection: (mid: string, sid: string) => void
) {
  const theme = isDark ? COLORS.dark : COLORS.light;

  const setSectionTitle = (title: string) => (renameSec(mID, s.id, title))
  const addNewItem = () => {
    let itemCount = s.items.length;
    let itemNewName = "item" + itemCount.toString;
    while(s.items.filter(i => i.id === itemNewName).length > 0) {
      itemCount++;
      itemNewName = "item"+itemCount.toString;
    }
    const newItem: Item = {id:"item"+itemCount, label:"new item", checked:false, baseQty:1, unit:"U"}
    addItem(mID, s.id, newItem);
  }

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
            {isEditing ? (
              <View style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
                <TextInput
                  onChangeText={newText => setSectionTitle(newText)}
                  placeholder={s.title}
                  defaultValue={s.title}
                  style={[styles.inputTitle, { color: theme.text, borderColor: theme.text }]}
                />
                <Pressable style={styles.iconBtn} onPress={() => removeSection(mID, s.id)}>
                  <MaterialIcons
                    name={"delete"}
                    size={22}
                    color={theme.text}
                  />
                </Pressable>
              </View>
            ) : (
              <View>
                <Text
                  style={[styles.sectionTitle, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {s.title}
                </Text>
              </View>
            )
            }
            <Pressable style={styles.iconBtn} onPress={() => toggle(mID, s.id)}>
              <MaterialIcons
                name={isEditing ? "done" : "edit"}
                size={22}
                color={theme.text}
              />
            </Pressable>
          </View>
          {isEditing ? (
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
                IngredientItem(mID, s.id, i, isDark, isEditing, updateItem, removeItem)
              ))
            )}
            <TouchableOpacity style={styles.subFab} activeOpacity={0.9} onPress={() => addNewItem()}>
              <MaterialIcons name="add" size={16} color={COLORS.textDark} />
              <Text style={styles.fabText}>Add Item</Text>
            </TouchableOpacity>
          </View>
          ):(
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
                IngredientItem(mID, s.id, i, isDark, isEditing, updateItem, removeItem)
              ))
            )}
          </View>
          )}
        </View>
      </View>
    </View>
  )
}

function IngredientItem(mID: string, sID: string, i: Item, isDark: boolean, isEditing: boolean,
  updateItem: (mid: string, sid: string, iid: string, patch: Partial<Item>) => void,
  removeItem: (mid:string, sid:string, iid:string) => void
) {
  const theme = isDark ? COLORS.dark : COLORS.light;
  const setItem = (type: number, text: string) => {
    switch (type) {
      case 0:
        i.label = text;
        updateItem(mID, sID, i.id, i);
        break;
      case 1:
        const newNumber: number = parseFloat(text);
        i.baseQty = newNumber ? newNumber : 0;
        updateItem(mID, sID, i.id, i);
        break;
      case 2:
        i.unit = text;
        updateItem(mID, sID, i.id, i);
        break;
      default:
        updateItem(mID, sID, i.id, i);
    }
  }

  return (
    <View key={i.id} style={styles.itemsRow}>
      {isEditing ? (
        <View style={styles.itemLeft}>
          <View style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}>
            <TextInput
              onChangeText={newLabel => setItem(0, newLabel)}
              placeholder={i.label}
              defaultValue={i.label}
              style={{
                color: theme.subtext,
              }}
            />
            <View style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              alignItems: "center",
            }}>
              <TextInput
                onChangeText={newNumber => setItem(1, newNumber)}
                keyboardType='numeric'
                placeholder={i.baseQty?.toString()}
                defaultValue={i.baseQty?.toString()}
                style={{
                  color: theme.subtext,
                }}
              />
              <TextInput
                onChangeText={newText => setItem(2, newText)}
                placeholder={i.unit}
                defaultValue={i.unit}
                style={{
                  color: theme.subtext,
                }}
              />
              <Pressable style={styles.iconBtn} onPress={() => removeItem(mID, sID, i.id)}>
                <MaterialIcons
                  name={"delete"}
                  size={15}
                  color={theme.text}
                />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.itemLeft}>
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
        </View>
      )}
    </View>
  )
}