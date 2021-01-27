import {TouchableOpacity, Image, View} from "react-native";
import React from "react";
import { SimpleLineIcons } from "@expo/vector-icons";

const NavigationDrawerStructure = (props) => {
    const toggleDrawer = () => {
        props.navigationProps.toggleDrawer();
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={toggleDrawer}>
                <SimpleLineIcons
                    name="menu"
                    size={24}
                    color="black"
                />
                {/*<Image*/}
                {/*    source={{*/}
                {/*        uri:*/}
                {/*            'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',*/}
                {/*    }}*/}
                {/*    style={{ width: 25, height: 25, marginLeft: 5 }}*/}
                {/*/>*/}
            </TouchableOpacity>
        </View>
    );
};

export default NavigationDrawerStructure;
