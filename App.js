import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform, PermissionsAndroid, Pressable } from 'react-native';
import RecordButton from './recordButton';
import PreMadeSounds from './preMadeSounds';
import { Asset } from 'expo-asset';

export default function App() {
    const soundBoardObjects = new Array(6).fill(null);

    const mp3s = [
        { name: "Pricemaster", uri: Asset.fromModule(require("./sounds/Pricemaster.mp3")).uri },
        { name: "Tasty", uri: Asset.fromModule(require("./sounds/Tasty.mp3")).uri },
        { name: "Vector", uri: Asset.fromModule(require("./sounds/Vector.mp3")).uri },
      ];

    return (
        <View style={styles.container}>
            <Text>Soundboard App</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {soundBoardObjects.map((item, index) => (
                <RecordButton key={index} />
            ))}
            
            {/* broken params but works */}
            {mp3s.map((item, index) => (
                <PreMadeSounds key={index} uri={item.uri} name={item.name} />
            ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 100,
        //justifyContent: 'center',
    },
});
