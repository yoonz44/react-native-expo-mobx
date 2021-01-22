import React, {useEffect, useState} from 'react';
import {GiftedChat} from "react-native-gifted-chat";
import Constants from 'expo-constants';

import {database} from '../components/Firebase/firebase';

export default function Chat({route}) {
    const { roomId } = route.params;
    const chatList = database.ref(`room/${roomId}`);

    const [messages, setMessages] = useState([]);
    const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const [loadEarlier, setLoadEarlier] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [keyArr, setKeyArr] = useState([]);
    const [valueArr, setValueArr] = useState([]);

    let chatListLength;
    let pageSize = 20;

    useEffect((() => {
        setIsMounted(true);

        const onReceive = (snapshot) => {
            if (!snapshot.val()) {
                return;
            }

            setKeyArr([...keyArr, snapshot.key]);
            setValueArr([...valueArr, snapshot.val().createdAt]);

            const message = snapshot.val();

            const form = {
                _id: snapshot.key,
                text: message.text,
                createdAt: message.createdAt,
                user: {
                    _id: message.user._id,
                    name: message.user.name
                }
            };

            if (chatListLength < pageSize + 1) {
                setLoadEarlier(false);
            }

            chatListLength -= 1;

            setMessages(previousMessages => GiftedChat.append(previousMessages, form));
        }

        chatList
            .once('value', snapshot => {
                chatListLength = snapshot.numChildren();

                if (chatListLength < pageSize + 1) {
                    pageSize = chatListLength - 1;
                }

                chatList
                    .orderByChild('createdAt')
                    .limitToLast(pageSize)
                    .on("child_added", onReceive);
            })

        return () => {
            setIsMounted(false);
            chatList.off();
        }
    }), []);

    const earlierMessages = () => {
        chatList
            .orderByChild('createdAt')
            .endAt(valueArr[0], keyArr[0])
            .limit(pageSize)
            .once('value', snapshot => {
                console.log(snapshot);

                setValueArr([]);
                setKeyArr([]);
            })
        // chatList
        //     .orderByChild('createdAt')
        //     .startAt(lastValue, lastKey)
        //     .limitToLast(pageSize + 1)
        //     .on("child_added", snapshot => {
                // setLastKey(snapshot.key);
                // setLastValue(snapshot.val().createdAt);
                //
                // const message = snapshot.val();
                //
                // const form = {
                //     _id: snapshot.key,
                //     text: message.text,
                //     createdAt: message.createdAt,
                //     user: {
                //         _id: message.user._id,
                //         name: message.user.name
                //     }
                // };
                //
                // if (chatListLength < pageSize + 1) {
                //     setLoadEarlier(false);
                // }
                //
                // chatListLength -= 1;
                //
                // setMessages(previousMessages => GiftedChat.prepend(previousMessages, form));
            // });
    };

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

    const onLoadEarlier = () => {
        setIsLoadingEarlier(true);

        setTimeout(() => {
            if (isMounted) {
                earlierMessages();
                setIsLoadingEarlier(false);
            }
        }, 1500) // simulating network
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: Constants.deviceId,
                name: `user-${Constants.deviceId}`
            }}
            loadEarlier={loadEarlier}
            isLoadingEarlier={isLoadingEarlier}
            onLoadEarlier={onLoadEarlier}
            infiniteScroll
        />
    )
}
