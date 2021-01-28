import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Image,
    Text,
    Linking,
} from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';

const CustomSidebarMenu = (props) => {
    const BASE_PATH =
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DrawerContentScrollView>
                <DrawerItem
                    label="Visit Us"
                    onPress={() => Linking.openURL('https://aboutreact.com/')}
                />
                <View style={styles.customItem}>
                    <Text
                        onPress={() => {
                            Linking.openURL('https://aboutreact.com/');
                        }}>
                        Rate Us
                    </Text>
                    <Image
                        source={{ uri: BASE_PATH + 'star_filled.png' }}
                        style={styles.iconStyle}
                    />
                </View>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    iconStyle: {
        width: 15,
        height: 15,
        marginHorizontal: 5,
    },
    customItem: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CustomSidebarMenu;
