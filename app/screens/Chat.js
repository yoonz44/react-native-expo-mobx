import React, {useEffect, useState} from 'react';
import {GiftedChat, Bubble} from "react-native-gifted-chat";
import Constants from 'expo-constants';

import {database} from '../components/Firebase/firebase';
import Loading from "../components/Loading";

export default function Chat({route}) {
    const {roomId} = route.params;
    const chatList = database.ref(`room/${roomId}`);

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const [loadEarlier, setLoadEarlier] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [keyArr, setKeyArr] = useState([]);
    const [tempArr, setTempArr] = useState([]);

    let chatListLength;
    let pageSize = 20;

    useEffect((() => {
        setIsMounted(true);

        chatList
            .once('value')
            .then(snapshot => {
                chatListLength = snapshot.numChildren();

                if (chatListLength < pageSize + 1) {
                    pageSize = chatListLength - 1;
                }

                chatList
                    .orderByKey()
                    .limitToLast(pageSize)
                    .on("child_added", onReceive);

                setLoading(false);
            });

        return () => {
            setIsMounted(false);
            chatList.off();
        }
    }), []);

    const onReceive = (snapshot) => {
        if (!snapshot.val()) {
            return;
        }

        setKeyArr((prevArr) => [...prevArr, snapshot.key]);

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

    const earlierMessages = async () => {
        const lastKey = keyArr[0];
        console.log(lastKey)
        await setKeyArr([]);
        await setTempArr([]);
        console.log(keyArr);
        await chatList
            .orderByKey()
            .endAt(lastKey)
            .limitToLast(pageSize + 1)
            .once('value', snapshot => {
                console.log(200);

                console.log(300);
                console.log(keyArr.length, tempArr.length);

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

                    setTempArr((prevArr) => [...prevArr, form]);
                    setKeyArr((prevArr) => [...prevArr, snapshot.key]);

                    if (chatListLength < pageSize + 1) {
                        setLoadEarlier(false);
                    }

                    chatListLength -= 1;
                });

                setTempArr(tempArr.shift());
                setTempArr([...tempArr.reverse()]);

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

    const onLoadEarlier = async () => {
        setIsLoadingEarlier(true);

        if (isMounted) {
            await earlierMessages();
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
        return <Loading />;
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
