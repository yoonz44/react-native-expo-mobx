import React from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context/src/SafeAreaContext";
import Navigation from "./navigation";
import {StatusBar} from "expo-status-bar";
import useColorScheme from "./hooks/useColorScheme";
import {Provider} from "mobx-react";
import UserStore from "./stores/UserStore";

const stores = {
    UserStore,
};

export default function App() {
    const colorScheme = useColorScheme();

    return (
        <Provider {...stores}>
            <SafeAreaProvider>
                <Navigation colorScheme={colorScheme}/>
                <StatusBar/>
            </SafeAreaProvider>
        </Provider>
    );
}
