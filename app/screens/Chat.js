import React, {useEffect, useState} from 'react';
import {GiftedChat} from "react-native-gifted-chat";
import Constants from 'expo-constants';

import {database} from '../components/Firebase/firebase';

export default function Chat({route}) {
    const [messages, setMessages] = useState([]);
    const { roomId } = route.params;

    useEffect((() => {
        const chatList = database.ref(`room/${roomId}`);

        const onReceive = data => {
            const message = data.val();
            const form = {
                _id: data.key,
                text: message.text,
                createdAt: message.createdAt,
                user: {
                    _id: message.user._id,
                    name: message.user.name
                }
            };

            setMessages(previousMessages => GiftedChat.append(previousMessages, form));
        }

        chatList
            .orderByChild('createdAt')
            .limitToLast(20)
            .on("child_added", onReceive);

        return () => chatList.off();
    }), []);

    const onSend = (messages) => {
        const today = new Date();
        const timestamp = today.toISOString();

        messages.forEach(message => {
            database
                .ref(`room/${roomId}`)
                .push({
                    text: message.text,
                    user: message.user,
                    createdAt: timestamp
                });
        })
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: Constants.deviceId,
                name: `user-${Constants.deviceId}`
            }}
            infiniteScroll={true}
            loadEarlier={true}
            isLoadingEarlier={false}
            onLoadEarlier={() => console.log(100)}
        />
    )
}
