import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from "react-native-gifted-chat";

import {database, auth} from '../components/Firebase/firebase';

export default function Chat() {
    const [messages, setMessages] = useState([]);

    useEffect((() => {
        const onReceive = data => {
            const message = data.val();
            const form = {
                _id: data.key,
                text: message.text,
                //createdAt: new Date(message.createdAt),
                createDate: message.createdAt,
                user: {
                    _id: message.user._id,
                    name: message.user.name
                }
            };

            setMessages(previousMessages => GiftedChat.append(previousMessages, form));
        }

        database
            .ref('messages')
            .orderByChild('createDate')
            .on("child_added", onReceive);

        return database.ref('messages').off();
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
                _id: '',
                name: 'user-1'
            }}
        />
    )
}
