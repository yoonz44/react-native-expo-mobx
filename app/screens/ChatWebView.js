import {WebView} from 'react-native-webview';
import React from "react";

const ChatWebView = ({route}) => {
    const {uri} = route.params;

    return (
        <WebView source={{ uri: uri }}/>
    )
}

export default ChatWebView;
