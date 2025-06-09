# Component Hierarchy for Task Management AI

## 🧱 Layout Structure

- **MainLayout** (src/components/layout/MainLayout.tsx)

  - Provides global page layout
  - Contains:

    - `<Navigation />`
    - `<main>{children}</main>`

- **Navigation** (src/components/layout/Navigation.tsx)

  - Displays top navigation bar with links
  - Pages: Dashboard, Tasks, Calendar, Batches, Analytics

---

## 📄 Pages Structure (in src/app)

- `/` → **DashboardPage**

  - Uses `<MainLayout>`
  - Shows dashboard cards: Total Tasks, Completed Today, Active Batches

- `/tasks` → **TasksPage**

  - Lists tasks
  - Includes filters and batch actions

- `/calendar` → **CalendarPage**

  - Displays tasks and batches in calendar view
  - Uses `react-big-calendar`

- `/batches` → **BatchesPage**

  - Shows list of task batches
  - Supports editing & scheduling

- `/analytics` → **AnalyticsPage**

  - Visualizes productivity data
  - Charts: time spent, completed tasks, focus areas

---

## 🧩 Components by Folder

### 🔹 `components/ui`

- **Button**
- **Input**
- **Label**
- **Textarea**
- **Select**
- **Card**
- **Badge**
- **Dialog**
- **DropdownMenu**

### 🔹 `components/forms`

- **TaskForm**

  - Used to create/edit tasks
  - Integrated with `react-hook-form`, `zod`

- **BatchForm**

  - Used to create/edit batches

### 🔹 `components/dashboard`

- **StatsCard**

  - Displays metric cards on dashboard

- **TaskOverview**

  - Shows summarized task data

---

## 🧠 State Management (Zustand)

- **taskStore.ts** in `src/stores`

  - `tasks[]`, `batches[]`
  - Actions: add, update, delete task/batch

---

## 📦 Other Key Folders

- `src/types/` → TypeScript interfaces: `Task`, `Batch`, `UserSettings`
- `src/lib/` → Utility functions
- `src/hooks/` → Custom hooks (e.g., useFilteredTasks)
- `src/utils/` → Helper functions

---

## 📝 Notes

- UI built using **shadcn/ui** for styling
- Responsive layout with Tailwind CSS
- Form validation: **react-hook-form** + **zod**
- Navigation highlights active page using `usePathname`
