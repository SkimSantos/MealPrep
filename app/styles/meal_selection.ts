import { StyleSheet } from "react-native";
import { COLORS } from "./global_style";

export const mealSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  card: {
    flexGrow: 1,
    flexBasis: "45%",
    minWidth: 150,
    maxWidth: "48%",
    aspectRatio: 4 / 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardBg: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardImage: {
    borderRadius: 12,
  },
  chip: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.20)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
    zIndex: 2,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    padding: 12,
    zIndex: 2,
  },
  // Ingredient Selector Panel
  panelOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  panelContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 24,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  panelCloseBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ingredientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  ingredientLabel: {
    fontSize: 16,
    flex: 1,
  },
  ingredientQty: {
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
});
