import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useTheme } from '../../hooks/useTheme';
import { useGroceries } from '../../stores/groceriesStore';
import { useHistory } from '../../stores/historyStore';
import { useIngredients } from '../../stores/ingredientsStore';
import { useProfile } from '../../stores/profileStore';
import { COLORS, styles } from '../../styles/global_style';
import { profileStyles } from '../../styles/profile';

export default function ProfileTab() {
  const { isDark, theme } = useTheme();
  const { profile, updateProfile } = useProfile();
  const { resetMeals } = useIngredients();
  const { clearHistory } = useHistory();
  const { clearAll: clearGroceries } = useGroceries();

  const [showResetModal, setShowResetModal] = useState(false);

  const bg = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  const handleReset = () => {
    resetMeals();
    clearHistory();
    clearGroceries();
    setShowResetModal(false);
  };

  const themeOptions: { value: 'system' | 'light' | 'dark'; label: string }[] = [
    { value: 'system', label: 'Auto' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <View style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={profileStyles.avatarSection}>
          <View style={[profileStyles.avatarCircle, { backgroundColor: theme.card }]}>
            <MaterialIcons name="person" size={48} color={COLORS.primary} />
          </View>
          {profile.name ? (
            <Text style={[profileStyles.avatarName, { color: theme.text }]}>
              {profile.name}
            </Text>
          ) : (
            <Text style={[profileStyles.avatarName, { color: theme.subtext }]}>
              Add your name
            </Text>
          )}
        </View>

        {/* Personal Info */}
        <View style={[profileStyles.sectionCard, { backgroundColor: theme.card }]}>
          <View style={[profileStyles.sectionHeader, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.sectionTitle, { color: theme.subtext }]}>
              Personal Info
            </Text>
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Name</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.name}
              onChangeText={(text) => updateProfile({ name: text })}
              placeholder="Your name"
              placeholderTextColor={theme.subtext}
            />
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Age</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.age > 0 ? profile.age.toString() : ''}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) || text === '') {
                  updateProfile({ age: isNaN(num) ? 0 : num });
                }
              }}
              keyboardType="numeric"
              placeholder="Age"
              placeholderTextColor={theme.subtext}
            />
            <Text style={[profileStyles.inputUnit, { color: theme.subtext }]}>yrs</Text>
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Weight</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.weight > 0 ? profile.weight.toString() : ''}
              onChangeText={(text) => {
                const num = parseFloat(text);
                if (!isNaN(num) || text === '') {
                  updateProfile({ weight: isNaN(num) ? 0 : num });
                }
              }}
              keyboardType="numeric"
              placeholder="70"
              placeholderTextColor={theme.subtext}
            />
            <Text style={[profileStyles.inputUnit, { color: theme.subtext }]}>kg</Text>
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: 'transparent' }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Height</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.height > 0 ? profile.height.toString() : ''}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) || text === '') {
                  updateProfile({ height: isNaN(num) ? 0 : num });
                }
              }}
              keyboardType="numeric"
              placeholder="170"
              placeholderTextColor={theme.subtext}
            />
            <Text style={[profileStyles.inputUnit, { color: theme.subtext }]}>cm</Text>
          </View>
        </View>

        {/* Daily Goals */}
        <View style={[profileStyles.sectionCard, { backgroundColor: theme.card }]}>
          <View style={[profileStyles.sectionHeader, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.sectionTitle, { color: theme.subtext }]}>
              Daily Goals
            </Text>
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Calories</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.dailyCalorieGoal > 0 ? profile.dailyCalorieGoal.toString() : ''}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) || text === '') {
                  updateProfile({ dailyCalorieGoal: isNaN(num) ? 0 : num });
                }
              }}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor={theme.subtext}
            />
            <Text style={[profileStyles.inputUnit, { color: theme.subtext }]}>kcal</Text>
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Protein</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.dailyProteinGoal > 0 ? profile.dailyProteinGoal.toString() : ''}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) || text === '') {
                  updateProfile({ dailyProteinGoal: isNaN(num) ? 0 : num });
                }
              }}
              keyboardType="numeric"
              placeholder="150"
              placeholderTextColor={theme.subtext}
            />
            <Text style={[profileStyles.inputUnit, { color: theme.subtext }]}>g</Text>
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Carbs</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.dailyCarbsGoal > 0 ? profile.dailyCarbsGoal.toString() : ''}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) || text === '') {
                  updateProfile({ dailyCarbsGoal: isNaN(num) ? 0 : num });
                }
              }}
              keyboardType="numeric"
              placeholder="250"
              placeholderTextColor={theme.subtext}
            />
            <Text style={[profileStyles.inputUnit, { color: theme.subtext }]}>g</Text>
          </View>
          <View style={[profileStyles.inputRow, { borderBottomColor: 'transparent' }]}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Fat</Text>
            <TextInput
              style={[profileStyles.inputField, { color: theme.text, borderColor: theme.border }]}
              value={profile.dailyFatGoal > 0 ? profile.dailyFatGoal.toString() : ''}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) || text === '') {
                  updateProfile({ dailyFatGoal: isNaN(num) ? 0 : num });
                }
              }}
              keyboardType="numeric"
              placeholder="65"
              placeholderTextColor={theme.subtext}
            />
            <Text style={[profileStyles.inputUnit, { color: theme.subtext }]}>g</Text>
          </View>
        </View>

        {/* Appearance */}
        <View style={[profileStyles.sectionCard, { backgroundColor: theme.card }]}>
          <View style={[profileStyles.sectionHeader, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.sectionTitle, { color: theme.subtext }]}>
              Appearance
            </Text>
          </View>
          <View style={profileStyles.themeRow}>
            <Text style={[profileStyles.inputLabel, { color: theme.text }]}>Theme</Text>
            <View style={profileStyles.themeOptions}>
              {themeOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    profileStyles.themeOption,
                    { borderColor: theme.border },
                    profile.themeOverride === option.value && profileStyles.themeOptionActive,
                  ]}
                  onPress={() => updateProfile({ themeOverride: option.value })}
                >
                  <Text
                    style={[
                      profileStyles.themeOptionText,
                      { color: theme.text },
                      profile.themeOverride === option.value && profileStyles.themeOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={[profileStyles.sectionCard, { backgroundColor: theme.card }]}>
          <View style={[profileStyles.sectionHeader, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.sectionTitle, { color: theme.subtext }]}>
              Support
            </Text>
          </View>
          <Pressable
            style={[profileStyles.actionRow, { backgroundColor: '#72a4f2' }]}
            onPress={() => Linking.openURL('https://ko-fi.com/U7U31UUWQU')}
          >
            <Text style={{ fontSize: 18, marginRight: 8 }}>☕</Text>
            <Text style={[profileStyles.actionText, { color: '#fff', fontWeight: '600' }]}>
              Support me on Ko-fi
            </Text>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={[profileStyles.sectionCard, { backgroundColor: theme.card }]}>
          <View style={[profileStyles.sectionHeader, { borderBottomColor: theme.border }]}>
            <Text style={[profileStyles.sectionTitle, { color: theme.subtext }]}>
              Actions
            </Text>
          </View>
          <Pressable
            style={profileStyles.actionRow}
            onPress={() => setShowResetModal(true)}
          >
            <MaterialIcons name="refresh" size={24} color="#ef4444" />
            <Text style={[profileStyles.actionText, profileStyles.dangerText]}>
              Reset All Data
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showResetModal}
        title="Reset All Data"
        message="This will reset your meal plan, clear your meal history, and remove all groceries. This action cannot be undone. Are you sure?"
        confirmText="Reset All"
        cancelText="Cancel"
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
        destructive
      />
    </View>
  );
}
