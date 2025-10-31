import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from 'react';
import {
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import 'react-native-reanimated';
import Icon from "react-native-vector-icons/MaterialIcons";
import GroceriesPage from "./groceries_page";
import MealPlannerHome from './meal_plan';
import PlanCheckPage from './plan_check_page';
import ProfilePage from "./profile_page";


import { COLORS, styles } from '../styles/global_style';

const Tab = createBottomTabNavigator();

export const unstable_settings = {
    anchor: '(tabs)',
};

type contentProps = {
    mealPressCall: void;
    setMealCall: (name: string) => void;
}

export default function BottomBarNavigation(props: contentProps) {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
    const text = isDark ? COLORS.textLight : COLORS.textDark;

    return (
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
    )
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