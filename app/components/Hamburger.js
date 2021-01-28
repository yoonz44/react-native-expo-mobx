import React from "react";
import {Image, StyleSheet, TouchableOpacity} from "react-native";

const Hamburger = (props) => {
    return (
        <TouchableOpacity
            onPress={() => props.toggle()}
            style={styles.button}
        >
            <Image
                source={require("../assets/images/logo.png")}
                style={{width: 32, height: 32}}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginRight: 6,
    },
});

export default Hamburger;
