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
    const [tempArr, setTempArr] = useState([]);

    let chatListLength;
    let pageSize = 20;

    useEffect((() => {
        setIsMounted(true);

        const onReceive = (snapshot) => {
            if (!snapshot.val()) {
                return;
            }

            setKeyArr(keyArr => [...keyArr, snapshot.key]);
            setValueArr(valueArr => [...valueArr, snapshot.val().createdAt]);

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
                    .orderByKey()
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
            .orderByKey()
            .endAt(keyArr[0])
            .limitToLast(pageSize + 1)
            .once('value', async snapshot  => {
                console.log(200);
                setValueArr([]);
                setKeyArr([]);
                setTempArr([]);
                console.log(300);
                console.log(valueArr.length, keyArr.length, tempArr.length);

                await snapshot.forEach(data => {
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

                    // setTempArr([...tempArr, form]);
                    // setKeyArr(keyArr => [...keyArr, snapshot.key]);
                    // setValueArr(valueArr => [...valueArr, snapshot.val().createdAt]);

                    if (chatListLength < pageSize + 1) {
                        setLoadEarlier(false);
                    }

                    chatListLength -= 1;
                });

                // setTempArr(tempArr.shift());
                // setTempArr([...tempArr.reverse()]);

                if (chatListLength < pageSize + 1) {
                    pageSize = chatListLength - 1;
                }

                setMessages(previousMessages => GiftedChat.prepend(previousMessages, tempArr));
                setIsLoadingEarlier(false);
            })
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

        if (isMounted) {
            earlierMessages();
        }
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
