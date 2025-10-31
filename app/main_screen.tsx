import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from 'react';
import {
    StatusBar,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import 'react-native-reanimated';
import Icon from "react-native-vector-icons/MaterialIcons";
import GroceriesPage from "./tabs/groceries_page";
import MealPlannerHome from './tabs/meal_plan';
import PlanCheckPage from './tabs/plan_check_page';
import ProfilePage from "./tabs/profile_page";


import { COLORS, styles } from './styles/global_style';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

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
            What are you planning today?
          </Text>
        </View>

        <Tab.Navigator
          screenOptions={{
            headerShown: false,// <- ensures state doesn't persist when switching tabs
          }}
          // Plug in YOUR bottom bar component:
          tabBar={(props) => <MyBottomBar {...props} isDark={isDark} bg={bg} />}
        >
          <Tab.Screen
            name="Home"
            component={MealPlannerHome}
            options={{ tabBarLabel: "Home" }}
          />
          <Tab.Screen
            name="MyPlan"
            component={PlanCheckPage}
            options={{ tabBarLabel: "My Plan" }}
          />
          <Tab.Screen
            name="Groceries"
            component={GroceriesPage}
            options={{ tabBarLabel: "Groceries" }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfilePage}
            options={{ tabBarLabel: "Profile" }}
          />

        </Tab.Navigator>
      </View>
    </View>
  );
}

const ICONS: Record<string, string> = {
  Home: "home",
  MyPlan: "calendar-month",
  Groceries: "shopping-cart",
  Settings: "settings",
};

function NavItem({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.navIconBox}>
        <Icon
          name={icon as any}
          size={24}
          color={active ? COLORS.primary : "rgba(246,248,247,0.5)"}
        />
      </View>
      <Text
        style={[
          styles.navLabel,
          { color: active ? COLORS.primary : "rgba(246,248,247,0.5)" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/** Your bottom bar, wired to React Navigation */
function MyBottomBar(
  { state, descriptors, navigation }: BottomTabBarProps & { isDark: boolean; bg: string }
) {
  const isDark = (arguments[0] as any).isDark; // (TS shortcut in snippet)
  const bg = (arguments[0] as any).bg;

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
        const icon = ICONS[route.name] ?? "circle"; // 👈 get icon by route name
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
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}