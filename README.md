# Kriya 🚀

Kriya is a premium, offline-first productivity application built with React Native and Expo. It is designed to help students, developers, and professionals stay focused, build consistent habits, and manage their daily tasks with a beautiful and intuitive user interface.

## ✨ Features

- **Personalized Roles:** Custom experience tailored for Students, Developers, Medical Professionals, and Teachers.
- **Task Management:** Create, categorize, and prioritize tasks with due dates.
- **Habit Tracking:** Build long-term consistency with daily habit tracking and visual streak counters.
- **Focus Timer:** Integrated Pomodoro timer with Focus and Break modes. Link sessions directly to tasks for better tracking.
- **Dynamic Dashboard:** Get a bird's-eye view of your daily progress, statistics, and motivational quotes.
- **Premium Themes:** Choose between **Dark**, **Warm Light**, and **AMOLED** themes to match your style.
- **Analytics:** Visualize your focus time and completion rates to understand your productivity patterns.
- **Offline First:** All your data is saved locally on your device for privacy and speed.

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation:** [React Navigation](https://reactnavigation.org/) (Bottom Tabs & Native Stack)
- **State Management:** React Context API + `useReducer`
- **Persistence:** [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Icons:** [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Visuals:** [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) & [React Native SVG](https://github.com/software-mansion/react-native-svg)
- **Date Utilities:** [date-fns](https://date-fns.org/)

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Buttons, Cards, Inputs, etc.)
├── constants/      # Design system, themes, and configuration data
├── context/        # Global state management (App, Theme, Subscription)
├── hooks/          # Custom React hooks (useStats, etc.)
├── navigation/     # App routing logic and navigators
├── screens/        # Main screen components (Dashboard, Tasks, Focus, etc.)
└── utils/          # Helper and utility functions
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Expo Go](https://expo.dev/client) app on your mobile device or an emulator (Android Studio / Xcode)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kriya-app.git
   cd kriya-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**
   Scan the QR code displayed in your terminal using the Expo Go app, or press `i` for iOS simulator or `a` for Android emulator.

## 🤝 Contributing

Kriya is an open-source project and contributions are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code is well-documented and follows the existing project structure.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for productivity.
