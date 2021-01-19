import React from 'react';
import { Chat, ChatList} from "./screens";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='ChatList'>
          <Stack.Screen name='Chat' component={Chat}/>
          <Stack.Screen name='ChatList' component={ChatList}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}
