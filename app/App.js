import React from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context/src/SafeAreaContext";
import Navigation from "./navigation";
import {StatusBar} from "expo-status-bar";
import useColorScheme from "./hooks/useColorScheme";
import {Provider} from "mobx-react";
import { UserStore, ChatStore } from "./stores";
import Toast from "react-native-toast-message";
import {View, Text} from "react-native";

const stores = {
    UserStore,
    ChatStore
};

const toastConfig = {
    success: ({ text1, props, ...rest }) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'pink' }}>
            <Text>{text1}</Text>
            <Text>{props.guid}</Text>
        </View>
    ),
    error: () => {},
    info: () => {},
    any_custom_type: () => {}
};

export default function App() {
    const colorScheme = useColorScheme();

    return (
        <Provider {...stores}>
            <SafeAreaProvider>
                <Navigation colorScheme={colorScheme}/>
                <StatusBar/>
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            </SafeAreaProvider>
        </Provider>
    );
}
