import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from "react-native-gifted-chat";

import firebaseSDK from "../utils/FirebaseSDK";

export default function Chat() {
    const [messages, setMessages] = useState([]);

    useEffect((() => {
        firebaseSDK.refOn(message =>
            useCallback((messages = []) => {
                setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
            }, [])
        );

        return firebaseSDK.refOff();
    }), []);

    const user = {
        name: '유저명',
        email: '유저이메일',
        avatar: '',
        id: firebaseSDK.uid,
        _id: firebaseSDK.uid
    }


    return (
        <GiftedChat
            messages={messages}
            onSend={firebaseSDK.send}
            user={user}
        />
    )
}
