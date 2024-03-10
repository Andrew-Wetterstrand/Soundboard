import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid, Pressable } from 'react-native';
import { Audio } from 'expo-av';

export default preMadeSound = (uri, name) => {
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);
    const [recordingUri, setRecordingUri] = useState(null); // recorded file location
    const [playing, setPlaying] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    useEffect(() => {
        console.log('preMadeSound -> ', uri);
        setRecordingUri(uri.uri);
    }, []);

    const playSound = async () => {

        const { sound } = await Audio.Sound.createAsync(
            { uri: recordingUri });
        setSound(sound);
        await sound.replayAsync();
        setPlaying(true);
        console.log('Playing audion from -> ', recordingUri);

      // set the sound status to false after the sound is done playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) {
          setPlaying(false);
        }
      });
    };

    const stopSound = async () => {
        if (playing) {
            await sound.unloadAsync();
            setSound(null);
            setPlaying(false);
        }
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <>
            {/* Sound buttons */}
            <Pressable
                
                style={{ padding: 10, backgroundColor: 'cyan', margin: 10}} 
                onPress={playing ? stopSound : playSound}   >
                <Text>{ playing ? 'Stop Sound ' + uri.name : 'Play Sound ' + uri.name}</Text>
            </Pressable>
        </>
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
