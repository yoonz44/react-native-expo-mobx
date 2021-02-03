import React, {useEffect, useState} from 'react';
import {Button, FlatList, SafeAreaView, Text, TouchableHighlight, View, StyleSheet} from "react-native";

const data = Array(30).fill(1).map((value, index) => {
    return {
        title: `룸-${index + 1}`,
        key: String(index + 1)
    }
});

export default function ChatList({navigation}) {
    const [channelList, setChannelList] = useState([]);

    useEffect(() => {
        fetch('https://back.talkpic.kr/api/channel/today', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(responseJson => {
                setChannelList(responseJson);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ItemSeparatorComponent={Platform.OS !== 'android' && (highlighted => (
                    <View style={[styles.separator, highlighted && {marginLeft: 0}]}/>
                ))}
                data={channelList}
                renderItem={({item, index, separators}) => (
                    <TouchableHighlight
                        key={item.id}
                        onPress={() => navigation.navigate('Chat', {
                            roomId: item.id
                        })}
                        onShowUnderlay={separators.highlight}
                        onHideUnderlay={separators.unhighlight}
                    >
                        <View style={{backgroundColor: 'white'}}>
                            <Text>{`${item.broad_caster}-${item.category}`}</Text>
                            <Button
                                title={item.program_name}
                                onPress={() => navigation.navigate('Chat', {
                                    roomId: item.id
                                })}
                            />
                        </View>
                    </TouchableHighlight>
                )}
            />
        </SafeAreaView>
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
