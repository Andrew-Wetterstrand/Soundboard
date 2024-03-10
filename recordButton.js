import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid, Pressable } from 'react-native';
import { Audio } from 'expo-av';

export default recordButton = () => {
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);
    const [recordingUri, setRecordingUri] = useState(null); // recorded file location
    const [playing, setPlaying] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();


    const startRecording = async () => {
        if (!recording) {
            //check permissions
            if (permissionResponse.status !== 'granted') {
                console.log("Requesting permissions")
                await requestPermission();
            }
            console.log("Permission is -> ", permissionResponse.status)

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
                const uri = recording.getURI();
                setRecordingUri(uri);
                setRecording(null);
            } catch (error) {
                console.error('Failed to stop recording', error);
            }
        }
    };

    const playSound = async () => {
        if (recording) {
            console.log('recordingUri is null or undefined');
            return;
        }

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
                onPress={recordingUri ? playSound : null}   
                onLongPress={recording ? stopRecording : startRecording}>
                <Text>{
                    recordingUri && !recording
                        ? 'Play Sound or Hold to Record Again'
                        : recording
                            ? 'Hold to Stop Recording'
                            : 'Hold to Start Recording'
                    }</Text>
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
