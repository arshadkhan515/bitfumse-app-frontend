import React from "react";
import ReactDOM from "react-dom/client";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import App from "./App";
import "./index.css";
import { ModalsProvider } from "@mantine/modals";
import { store } from './app/store'
import { Provider } from 'react-redux'


const MainApp = () => {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useHotkeys([["ctrl+k", () => toggleColorScheme()]]);
  return (
    <Provider store={store}>
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, fontFamily: "Poppins, sans-serif" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider position="top-right" zIndex={2077}>
            <App />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<MainApp />);
