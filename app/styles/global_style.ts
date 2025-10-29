import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#38e07b",
  backgroundLight: "#f6f8f7",
  backgroundDark: "#122017",
  textLight: "#f6f8f7",
  textDark: "#122017",
};

export const FONT = {
  regular: "Epilogue-Regular",
  bold: "Epilogue-Bold",
  medium: "Epilogue-Medium",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const CARD_ASPECT_RATIO = 4 / 5;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topBarWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrap: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  avatarBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBox: {
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  searchIcon: {
    paddingLeft: 12,
    paddingRight: 8,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // leave room for bottom nav + FAB
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15 as any, // RN doesn't support gap < 0.73; cast for TS convenience
  },
  card: {
    flexBasis: "45%",
    maxWidth: "45%",
    aspectRatio: CARD_ASPECT_RATIO,
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
    backgroundColor: "rgba(0,0,0,0.35)", // simple overlay to mimic gradient
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    padding: 12,
    zIndex: 2,
  },
  fabWrap: {
    position: "absolute",
    right: 16,
    bottom: 96, // above bottom bar
    zIndex: 10,
  },
  fab: {
    height: 56,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8 as any,
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
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    flexDirection: "row",
    gap: 8 as any,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4 as any,
  },
  navIconBox: {
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
