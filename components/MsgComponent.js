import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants'; // Verifique o caminho correto para suas constantes de cores

const MsgComponent = ({ sender, message }) => {
    return (
        <View style={[styles.container, { justifyContent: sender ? 'flex-end' : 'flex-start' }]}>
            <View style={[styles.messageBubble, { backgroundColor: sender ? COLORS.primary : COLORS.secondaryWhite }]}>
                <Text style={{ color: sender ? COLORS.white : COLORS.black }}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 8,
        paddingHorizontal: 12,
    },
    messageBubble: {
        borderRadius: 12,
        padding: 8,
        maxWidth: '80%',
    },
});

export default MsgComponent;
