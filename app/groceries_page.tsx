import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    useColorScheme,
    View
} from "react-native";
import 'react-native-reanimated';
import { COLORS, styles } from './styles/global_style';

export default function GroceriesPage() {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    
    const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
    const text = isDark ? COLORS.textLight : COLORS.textDark;
    const placeholder = "Search for a recipe or ingredient";
    return (
        <View style={[styles.safe, { backgroundColor: bg }]}>
              <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={bg}
                hidden
              />
              <View style={[styles.container, { backgroundColor: bg }]}>
                {/* Scrollable Content */}
                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                > 
                    <View>
                         <Text style={styles.cardTitle} numberOfLines={2}>
                            Groceries Page. Not Done Yet
                        </Text>
                    </View>
                </ScrollView>
              </View>
            </View>
    )
}