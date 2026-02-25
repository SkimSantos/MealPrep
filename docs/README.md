# MealPrep Documentation

Complete XML-based documentation for the MealPrep application - a React Native meal planning, grocery management, and nutritional tracking application.

## Documentation Files

### 1. **DOCUMENTATION_INDEX.xml** ⭐ START HERE
Central index and quick reference guide.
- File location guide
- Common tasks
- Key types and constants
- Color and theme reference
- AsyncStorage keys reference
- ID generation patterns
- Troubleshooting guide

### 2. **PROJECT_OVERVIEW.xml**
High-level project overview and architecture.
- Project metadata and purpose
- Key features (with file references)
- System architecture patterns
- Data flow diagrams
- Technology stack and dependencies
- Project directory structure
- Build and run instructions
- Conventions and best practices

### 3. **STORES.xml** (Largest: 42KB)
Complete documentation of all global state management.

#### Documented Stores:
- **profileStore.tsx**: User profile and settings
  - UserProfile type (name, age, weight, height, goals, theme)
  - CRUD operations
  - Async persistence with AsyncStorage
  - Example usage

- **ingredientsStore.tsx**: Meal planning state
  - Item, Section, Meal types
  - Hierarchical Meal → Section → Item structure
  - 13 mutation functions for complete CRUD
  - Proportional quantity calculation algorithm
  - Detailed function documentation with examples

- **historyStore.tsx**: Meal history tracking
  - HistoryEntry and HistoryIngredient types
  - Meal logging with timestamps
  - Entry management (add, update, remove, clear)

- **groceriesStore.ts**: Shopping list management
  - GroceryItem type
  - Custom hook implementation
  - Item management functions
  - Clear checked and clear all operations

### 4. **COMPONENTS_AND_HOOKS.xml**
Shared UI components and custom React hooks.

#### Documented Components:
- **PanelContext**: Global modal/overlay management
  - PanelProvider component
  - Panel state and data management
  - openPanel, closePanel, togglePanel operations
  - usePanels hook documentation

- **ConfirmationModal**: Reusable confirmation dialog
  - Standard and destructive modes
  - Theme-aware styling
  - Customizable button text
  - Icon support

#### Documented Hooks:
- **useTheme**: Theme management hook
  - Light/dark mode support
  - System preference detection
  - User override options
  - Theme color structure

### 5. **DATA_AND_CONFIGURATION.xml**
Static data and configuration files.

#### Data Files:
- **ingredients.json**: Complete ingredient database
  - 9 categories
  - 100+ ingredients with defaults
  - Default quantities and units

#### Configuration:
- **global_style.ts**: App design system
  - Color palette (primary, secondary, light/dark)
  - Typography definitions
  - Spacing system
  - StyleSheet definitions

- **constants/theme.ts**: Expo theme configuration
  - Platform-specific colors
  - Font definitions
  - Light/dark mode themes

## Quick Start

1. **Start with DOCUMENTATION_INDEX.xml** for quick references and common tasks
2. **Check PROJECT_OVERVIEW.xml** to understand the overall architecture
3. **Refer to specific store documentation** in STORES.xml when working with state
4. **Reference COMPONENTS_AND_HOOKS.xml** when building UI components
5. **Use DATA_AND_CONFIGURATION.xml** for design system and color information

## Key Information

### Color Palette
- **Primary**: #38e07b (Green) - Buttons, highlights
- **Secondary**: #2a4232 (Dark Green) - Secondary elements
- **Light Background**: #f6f8f7
- **Dark Background**: #122017
- **Light Text**: #0e1a13
- **Dark Text**: #e1e3e2

### Storage Keys
- `@profile_state_v1` - User profile
- `@ingredients_state_v2` - Meal planning
- `@history_state_v1` - Meal history
- `@groceries_state_v1` - Grocery list

### File Organization
```
app/
├── stores/              # Global state management
├── tabs/               # Screen components (plan, meal_selection, groceries, history, profile)
├── components/         # Shared components (PanelContext, ConfirmationModal)
├── hooks/             # Custom hooks (useTheme)
├── styles/            # StyleSheets and design system
├── data/              # Static data (ingredients.json)
├── _layout.tsx        # Root navigation
└── main_screen.tsx    # Tab navigation setup
```

## Architecture

### State Management
- **React Context API** with **AsyncStorage** persistence
- Four main providers: Profile, Ingredients, History, Groceries
- Hydration pattern prevents data loss during initial load

### Persistence Pattern
1. Component mounts → Load from AsyncStorage
2. During load: `isHydratingRef.current = true`
3. State updated with loaded data
4. Skip first state change after load: `hasEverSavedRef`
5. Auto-save every subsequent change to AsyncStorage

### Data Flow
User action → Store mutation → State update → Auto-save to AsyncStorage → Component re-renders

## Important Conventions

### Naming
- **Components/Providers**: PascalCase (ProfileProvider, ConfirmationModal)
- **Hooks**: camelCase with 'use' prefix (useProfile, useTheme)
- **Files**: kebab-case (panel-context.tsx)
- **Types**: PascalCase (UserProfile, Item)
- **Constants**: UPPER_SNAKE_CASE (COLORS, STORAGE_KEY)

### ID Generation
Prevent collisions in rapid creation:
```
`${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
```

### Code Style
- Use immutable updates with spread operator
- Wrap AsyncStorage operations in try-catch
- Use StyleSheet.create() for all styles
- Use theme-aware colors from COLORS
- Arrow functions for all definitions

## Proportional Quantity Calculation

The app calculates proportional quantities when multiple ingredients are selected:
- Formula: `(itemWeight / totalWeight) * baseQty`
- Example: 3 proteins with equal weight, each gets 1/3 of base quantity
- Guard against division by zero when no items are selected

## Common Tasks

See DOCUMENTATION_INDEX.xml for complete task list:
- Add new ingredient
- Change primary color
- Add new meal plan feature
- Create new global modal
- Support new theme
- Track new user data

## Notes

- All files are XML for easy parsing and transformation
- Type definitions match actual TypeScript code
- Code examples are simplified; refer to source for full implementations
- All paths are relative to project root
- Documentation updated: 2026-02-25

---

For more information, open the specific XML files in your editor or XML viewer for formatted display.
