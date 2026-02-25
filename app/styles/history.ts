import { StyleSheet } from "react-native";

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  entryCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  entryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(56, 224, 123, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  entryInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: "600",
  },
  entryTime: {
    fontSize: 12,
    marginTop: 2,
  },
  ingredientCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Detail Panel
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
  panelHeaderLeft: {
    flex: 1,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  panelSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  panelCloseBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  panelContent: {
    padding: 16,
  },
  ingredientsList: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ingredientLabel: {
    fontSize: 16,
    flex: 1,
  },
  ingredientQty: {
    fontSize: 14,
    fontWeight: "600",
  },
  notesContainer: {
    marginTop: 16,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 22,
  },
  notesInput: {
    fontSize: 16,
    lineHeight: 22,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  deleteButton: {
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
