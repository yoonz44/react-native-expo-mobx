import {Chat, ChatList} from "../screens";
import NotFoundScreen from "../screens/NotFoundScreen";
import * as React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {inject, observer} from "mobx-react";
import Hamburger from "../components/Hamburger";

const Stack = createStackNavigator();

const RootNavigator = inject("ChatStore")(observer(({ChatStore}) => {
    return (
        <Stack.Navigator initialRouteName='ChatList' screenOptions={{headerShown: true}}>
            <Stack.Screen
                name='Chat'
                component={Chat}
                options={{
                    headerRight: () => (
                        <Hamburger toggle={() => ChatStore.setSideOpen(!ChatStore.isSideOpen)}/>
                    )
                }}
            />
            <Stack.Screen
                name='ChatList'
                component={ChatList}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
        </Stack.Navigator>
    );
}));

export default RootNavigator;
