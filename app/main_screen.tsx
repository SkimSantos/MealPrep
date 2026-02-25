import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as NavigationBar from 'expo-navigation-bar';
import React from 'react';
import {
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import 'react-native-reanimated';
import Icon from "react-native-vector-icons/MaterialIcons";
import { PanelProvider } from "./components/PanelContext";
import { useTheme } from "./hooks/useTheme";
import { HistoryProvider } from "./stores/historyStore";
import { IngredientsProvider } from "./stores/ingredientsStore";
import { ProfileProvider } from "./stores/profileStore";
import GroceriesTab from "./tabs/groceries";
import HistoryTab from "./tabs/history";
import MealSelectionTab from './tabs/meal_selection';
import PlanTab from './tabs/plan';
import ProfileTab from "./tabs/profile";


import { COLORS, styles } from './styles/global_style';

const Tab = createBottomTabNavigator();

// Hide system navigation bar on Android with immersive mode
async function hideNavigationBar() {
  if (Platform.OS === 'android') {
    await NavigationBar.setVisibilityAsync('hidden');
    await NavigationBar.setBehaviorAsync('inset-swipe');
  }
}

// Initial hide
hideNavigationBar();

// Re-hide when visibility changes (user swipes to show it)
if (Platform.OS === 'android') {
  NavigationBar.addVisibilityListener(({ visibility }) => {
    if (visibility === 'visible') {
      // Auto-hide after 2 seconds
      setTimeout(() => {
        hideNavigationBar();
      }, 2000);
    }
  });
}

export default function MainScreen() {
  return (
    <ProfileProvider>
      <IngredientsProvider>
        <HistoryProvider>
          <PanelProvider>
            <MainContent />
          </PanelProvider>
        </HistoryProvider>
      </IngredientsProvider>
    </ProfileProvider>
  );
}

function MainContent() {
  const { isDark } = useTheme();

  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const text = isDark ? COLORS.textLight : COLORS.textDark;

  return (
      <View style={[styles.safe, { backgroundColor: bg }]}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={bg}
          hidden
        />
        <View style={[styles.container, { backgroundColor: bg }]}>
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
              What are you eating today?
            </Text>
          </View>

          <Tab.Navigator
            screenOptions={{
              headerShown: false,
            }}
            tabBar={(props) => <MyBottomBar {...props} />}
          >
            <Tab.Screen
              name="Meals"
              component={MealSelectionTab}
              options={{ tabBarLabel: "Meals" }}
            />
            <Tab.Screen
              name="Plan"
              component={PlanTab}
              options={{ tabBarLabel: "Plan" }}
            />
            <Tab.Screen
              name="History"
              component={HistoryTab}
              options={{ tabBarLabel: "History" }}
            />
            <Tab.Screen
              name="Groceries"
              component={GroceriesTab}
              options={{ tabBarLabel: "Groceries" }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileTab}
              options={{ tabBarLabel: "Profile" }}
            />
          </Tab.Navigator>
        </View>
      </View>
  );
}

const ICONS: Record<string, string> = {
  Meals: "restaurant",
  Plan: "calendar-month",
  History: "history",
  Groceries: "shopping-cart",
  Profile: "person",
};

function NavItem({
  label,
  icon,
  active,
  isDark,
  onPress,
}: {
  label: string;
  icon: string;
  active?: boolean;
  isDark: boolean;
  onPress: () => void;
}) {
  const inactiveColor = isDark ? "rgba(246,248,247,0.5)" : "rgba(18,32,23,0.5)";
  return (
    <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.navIconBox}>
        <Icon
          name={icon as any}
          size={24}
          color={active ? COLORS.primary : inactiveColor}
        />
      </View>
      <Text
        style={[
          styles.navLabel,
          { color: active ? COLORS.primary : inactiveColor },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/** Your bottom bar, wired to React Navigation */
function MyBottomBar(
  { state, descriptors, navigation }: BottomTabBarProps
) {
  const { isDark } = useTheme();
  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  return (
    <View
      style={[
        styles.bottomBar,
        {
          backgroundColor: bg,
          borderTopColor: isDark ? "rgba(246,248,247,0.10)" : "rgba(18,32,23,0.10)",
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title ?? route.name;
        const icon = ICONS[route.name] ?? "circle";
        const active = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!active && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <NavItem
            key={route.key}
            label={label}
            icon={icon ?? "circle"}
            active={active}
            isDark={isDark}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}