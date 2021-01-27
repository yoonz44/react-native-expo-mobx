import React, {useEffect, useState} from 'react';
import {GiftedChat, Bubble} from "react-native-gifted-chat";
import Constants from 'expo-constants';

import {database} from '../components/Firebase/firebase';
import Loading from "../components/Loading";

let keyArr = [];
let chatArr = [];
let chatListLength = 0;
let pageSize = 20;

export default function Chat({route}) {
    const {roomId} = route.params;
    const chatList = database.ref(`room/${roomId}`);

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const [loadEarlier, setLoadEarlier] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        keyArr = [];
        chatArr = [];
        chatListLength = 0;
        pageSize = 20;

        chatList
            .once('value')
            .then(snapshot => {
                chatListLength = snapshot.numChildren();

                if (chatListLength !== 0) {
                    if (chatListLength <= pageSize) {
                        pageSize = chatListLength;
                    } else {
                        setLoadEarlier(true);
                        chatListLength -= pageSize;
                    }

                    chatList
                        .orderByKey()
                        .limitToLast(pageSize)
                        .on("child_added", onReceive);
                } else {
                    chatList
                        .orderByKey()
                        .on("child_added", onReceive);

                    setLoading(false);
                }
            });

        return () => {
            setIsMounted(false);
            chatList.off();
        }
    }, []);

    const onReceive = (snapshot) => {
        if (!snapshot.val()) {
            return;
        }

        keyArr.push(snapshot.key);

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

        setMessages(previousMessages => GiftedChat.append(previousMessages, form));

        setLoading(false);
    }

    const earlierMessages = () => {
        const lastKey = keyArr[0];

        keyArr = [];
        chatArr = [];

        chatList
            .orderByKey()
            .endAt(lastKey)
            .limitToLast(pageSize + 1)
            .once('value')
            .then(snapshot => {
                snapshot.forEach(data => {
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

                    if (data.key !== lastKey) {
                        chatArr.push(form);
                        keyArr.push(data.key);

                        chatListLength -= 1;
                    }
                });

                if (chatListLength === 0) {
                    setLoadEarlier(false);
                }

                if (chatListLength <= pageSize) {
                    pageSize = chatListLength;
                }

                chatArr.reverse();

                setMessages(previousMessages => GiftedChat.prepend(previousMessages, chatArr));

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

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#d3d3d3',
                    },
                }}
            />
        );
    }

    if (loading) {
        return <Loading/>;
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: Constants.deviceId,
                name: `user-${Constants.deviceId}`
            }}
            renderBubble={renderBubble}
            loadEarlier={loadEarlier}
            isLoadingEarlier={isLoadingEarlier}
            onLoadEarlier={onLoadEarlier}
            infiniteScroll
        />
    )
}
