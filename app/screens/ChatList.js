import React from 'react';
import {StyleSheet, Text, View, Button} from "react-native";
import { StatusBar } from 'expo-status-bar';

export default function ChatList({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>채팅 리스트으</Text>
            <Button
                title='채팅룸-1'
                onPress={() => navigation.navigate('Chat')}
            />
            <StatusBar/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
