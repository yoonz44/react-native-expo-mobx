import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from "react-native-gifted-chat";

import {database, auth} from '../components/Firebase/firebase';

export default function Chat() {
    const [messages, setMessages] = useState([]);

    useEffect((() => {
        const chatList = database.ref('messages');

        const onReceive = data => {
            const message = data.val();
            const form = {
                _id: data.key,
                text: message.text,
                //createdAt: new Date(message.createdAt),
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
            .on("child_added", onReceive);

        return () => chatList.off();
    }), []);

    const onSend = (messages) => {
        const today = new Date();
        const timestamp = today.toISOString();

        messages.forEach(message => {
            database
                .ref('messages')
                .push({
                    text: message.text,
                    user: message.user,
                    createDate: timestamp
                });
        })
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
                name: 'user-1'
            }}
            infiniteScroll={true}
            loadEarlier={true}
        />
    )
}
