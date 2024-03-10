import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform, PermissionsAndroid } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);

    useEffect(() => {
        requestMicrophonePermission();
    }, []);

    const requestMicrophonePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permission',
                        message: 'This app requires microphone permission to record audio.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Microphone permission granted');
                } else {
                    console.log('Microphone permission denied');
                }
            } catch (error) {
                console.error('Error requesting microphone permission:', error);
            }
        }
    };

    const startRecording = async () => {
        if (!recording) {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to record audio was denied');
                return;
            }

            const recordingInstance = new Audio.Recording();
            try {
                await recordingInstance.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                await recordingInstance.startAsync();
                setRecording(recordingInstance);
            } catch (error) {
                console.error('Failed to start recording', error);
            }
        }
    };

    const stopRecording = async () => {
        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
                setRecording(null);
            } catch (error) {
                console.error('Failed to stop recording', error);
            }
        }
    };

    const playSound = async () => {
        if (recording) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(
            require('./assets/recorded_sound.mp3')          //add sound file pathing
        );
        setSound(sound);
        await sound.playAsync();
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <Text>Soundboard App</Text>
            {/* Sound buttons */}
            <Button title="Record" onPress={startRecording} />
            <Button title="Stop" onPress={stopRecording} />
            <Button title="Play Recorded Sound" onPress={playSound} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});