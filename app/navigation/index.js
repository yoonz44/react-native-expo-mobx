import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import NotFoundScreen from '../screens/NotFoundScreen';
import LinkingConfiguration from './LinkingConfiguration';
import {Chat, ChatList} from "../screens";
import NavigationDrawerStructure from "../components/NavigationDrawerStructure";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator({navigation}) {
    return (
        <Stack.Navigator initialRouteName='ChatList' screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name='Chat'
                component={Chat}
            />
            <Stack.Screen name='ChatList' component={ChatList}/>
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
        </Stack.Navigator>
    );
}
