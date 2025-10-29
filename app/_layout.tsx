import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import 'react-native-reanimated';
import Icon from "react-native-vector-icons/MaterialIcons";

import BottomBarNavigation from "./bottom_bar";
import IngredientListPage from "./ingredient_list";

import { COLORS, styles } from './styles/global_style';

const Tab = createBottomTabNavigator();

const [selectedTab, setSelectedTab] = useState("meal");
const [selectedMeal, setSelectedMeal] = useState("none")

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const text = isDark ? COLORS.textLight : COLORS.textDark;

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={bg}
        hidden={true}
      />
      <View style={[styles.container, { backgroundColor: bg, display: selectedTab === "meal" ? "flex" : "none"}]}>
        {/* Top App Bar */}
        <View style={styles.topBarWrap}>
          <View style={styles.topBar}>
            <View style={styles.logoWrap}>
              <Icon name="restaurant-menu" size={28} color={COLORS.primary} />
            </View>
            <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8}>
              <Icon
                name="account-circle"
                size={30}
                color={isDark ? COLORS.textLight : COLORS.textDark}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.title,
              { color: text },
            ]}
          >
            What are you planning today?
          </Text>
        </View>

        <BottomBarNavigation mealPressCall={onMealPressed(true)} setMealCall={setSelectedMeal}></BottomBarNavigation>
      </View>
      <View style={[styles.container, { backgroundColor: bg, display: selectedTab === "list" ? "flex" : "none"}]}>
            <IngredientListPage name={selectedMeal} callback={onMealPressed(false)}></IngredientListPage>
      </View>
    </View>
  );
}

function onMealPressed(setList: boolean) {
  setList ? setSelectedTab("list") : setSelectedTab("meal")
}