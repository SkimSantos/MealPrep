import { StyleSheet } from "react-native";
import { COLORS } from "./global_style";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarName: {
    fontSize: 22,
    fontWeight: "700",
  },
  sectionCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputLabel: {
    fontSize: 16,
    flex: 1,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
    minWidth: 80,
  },
  inputField: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
    minWidth: 80,
    borderBottomWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  inputUnit: {
    fontSize: 14,
    marginLeft: 4,
    width: 30,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  themeOptions: {
    flexDirection: "row",
    gap: 8,
  },
  themeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  themeOptionTextActive: {
    color: COLORS.textDark,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    flex: 1,
  },
  dangerText: {
    color: "#ef4444",
  },
  saveButton: {
    marginTop: 8,
    marginHorizontal: 16,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
});
