import React from 'react';
import {Button, FlatList, ScrollView, Text, TouchableHighlight, View, StyleSheet} from "react-native";

const data = Array(30).fill(1).map((value, index) => {
    return {
        title: `룸-${index + 1}`,
        key: index + 1
    }
});

export default function ChatList({navigation}) {
    return (
        <FlatList
            ItemSeparatorComponent={Platform.OS !== 'android' && (highlighted => (
                <View style={[styles.separator, highlighted && {marginLeft: 0}]}/>
            ))}
            data={data}
            renderItem={({item, index, separators}) => (
                <TouchableHighlight
                    key={item.key}
                    onPress={() => this._onPress(item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <View style={{backgroundColor: 'white'}}>
                        <Text>{item.title}</Text>
                        <Button
                            title={item.title}
                            onPress={() => navigation.navigate('Chat', {
                                roomId: item.key
                            })}
                        />
                    </View>
                </TouchableHighlight>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});
