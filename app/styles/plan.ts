import { StyleSheet } from "react-native";
import { COLORS } from "./global_style";

export const planStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  mealsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  accordion: {
    borderRadius: 12,
    overflow: "hidden",
  },
  accordionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  accordionContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 12,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  sectionTitleInput: {
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingLeft: 16,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
  },
  itemLabelInput: {
    flex: 1,
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  itemQtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemQtyInput: {
    width: 50,
    textAlign: "center",
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  itemUnitInput: {
    width: 50,
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  itemWeightInput: {
    width: 40,
    textAlign: "center",
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  itemQty: {
    fontSize: 14,
  },
  addButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  addButtonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  addButtonTextLight: {
    color: COLORS.textLight,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 96,
    gap: 12,
  },
  fab: {
    height: 56,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "700",
  },
});
