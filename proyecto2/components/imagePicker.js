import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-action-sheet';

function imagePicker({ onInput, context = 'avatar', initialImage = null }) {
    const [type, setType] = useState('jpg');
    const [avatar, setAvatar] = useState(
        initialImage ? initialImage : context === 'avatar' ?
        'http://www.myteespot.com/images/Images_d/img_P02O9i.jpg' : 'https://www.psionline.com/wp-content/uploads/placeholder-icon.png'
    );

    const options = ['Camera', 'Files'];
    const launchOptions = {
        mediaType: 'photo',
        quality: 1,
        includeBase64: true
    }

    return (
        <Card.Image
            style={{ width: '100%', height: 250 }}
            PlaceholderContent={<ActivityIndicator size={'large'} color={'lime'} />}
            source={{ uri: avatar }}
            onPress={() => {
                ActionSheet.showActionSheetWithOptions({
                    options: options,
                    title: 'Image source'
                }, (input) => {
                    if (input !== undefined) {
                        if (input === 0) {
                            launchCamera(launchOptions, (fileInput) => {
                                if (!fileInput.didCancel) {
                                    setAvatar(`data:image/jpg;base64,${fileInput.base64}`);
                                    setType('jpg');
                                    onInput({ uri: fileInput.uri, type: type });
                                }
                            })
                        }
                        else {
                            launchImageLibrary(launchOptions, (fileInput) => {
                                if (!fileInput.didCancel) {
                                    let fileType = fileInput.fileName.split('.')[1];
                                    let mimeType = `image/${fileType}`;
                                    setAvatar(`data:${mimeType};base64,${fileInput.base64}`);
                                    setType(fileType);
                                    onInput({ uri: fileInput.uri, type: fileType });
                                }
                            })
                        }
                    }
                })
            }}
        />
    );
}

export default imagePicker;