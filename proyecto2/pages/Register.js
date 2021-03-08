import React, { useState } from 'react';
import {ActivityIndicator, ScrollView, ToastAndroid} from 'react-native';
import {Card, Input, Button} from 'react-native-elements';
import ActionSheet from 'react-native-action-sheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFB from 'react-native-fetch-blob';

function registerPage({navigation}) {
    let [avatar, setAvatar] = useState('http://www.myteespot.com/images/Images_d/img_P02O9i.jpg');
    let [name, setName] = useState('');
    let [password, setPassword] = useState('');
    let [confirm, setConfirm] = useState('');
    let [email, setEmail] = useState('');
    let [buttonTitle, setButtonTitle] = useState('Register');
    let [loading, setLoading] = useState(false);
    let [fileURI, setFileURI] = useState(null);
    let [type, setType] = useState('jpg');
    const options = ['Camera', 'Files'];
    const launchOptions = {
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
        saveToPhotos: true
    }
    return(
        <ScrollView>
            <Card containerStyle={{backgroundColor: '#1F262A', borderColor: 'black'}} >
                <Card.Image
                    style={{width: '100%', height: 250}}
                    PlaceholderContent={<ActivityIndicator size={'large'} color={'lime'} />}
                    source={{uri: avatar}}
                    onPress={() => {
                        ActionSheet.showActionSheetWithOptions({options: options, 
                            title: 'Image source'}, (input) => {
                                if (input !== undefined){
                                    if (input === 0){
                                        launchCamera(launchOptions, (fileInput) => {
                                            if (!fileInput.didCancel){
                                                setAvatar(`data:image/jpg;base64,${fileInput.base64}`);
                                                setType('jpg');
                                                setFileURI(fileInput.uri);
                                            }
                                        })
                                    }
                                    else{
                                        launchImageLibrary(launchOptions, (fileInput) => {
                                            if (!fileInput.didCancel){
                                                let fileType = fileInput.fileName.split('.')[1];
                                                let mimeType = `image/${fileType}`;
                                                setAvatar(`data:${mimeType};base64,${fileInput.base64}`);
                                                setType(fileType);
                                                setFileURI(fileInput.uri);
                                            }
                                        })
                                    }
                                }
                            })
                        }}
                />
                <Card.Divider />
                <Input
                onChange={(e) => {
                    setName(e.nativeEvent.text);
                }} 
                style={styles.textFields} label={'Name'} placeholder={'Name'} />
                <Input 
                onChange={(e) => {
                    setEmail(e.nativeEvent.text);
                }} 
                style={styles.textFields} label={'Email'} keyboardType={'email-address'} placeholder={'Email'} />
                <Input 
                onChange={(e) => {
                    setPassword(e.nativeEvent.text);
                }} 
                style={styles.textFields} label={'Password'} secureTextEntry={true} placeholder={'Password'} />
                <Input 
                onChange={(e) => {
                    setConfirm(e.nativeEvent.text);
                }} 
                style={styles.textFields} label={'Confirm password'} secureTextEntry={true} placeholder={'Confirm password'} />
                <Button title={buttonTitle} onPress={() => {
                    setButtonTitle('');
                    setLoading(true);
                   let data ={
                       name: name,
                       email: email,
                       password: password,
                       confirm: confirm,
                       avatar: fileURI,
                       type: type
                   }
                   fetchData(data).then(json => {
                       setButtonTitle('Register');
                       setLoading(false);
                       ToastAndroid.showWithGravity(json.content, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                   });
                }} icon={<ActivityIndicator color={'lime'} animating={loading} />} 
                disabled={loading}
                />
            </Card>
        </ScrollView>
    );
}

async function fetchData (data) {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirm', data.confirm);
    if (data.avatar){
        formData.append('avatar', {
            type: 'image/' + data.type,
            name: 'avatar.' + data.type,
            uri: data.avatar
        });
    }
    let request = await fetch('http://192.168.0.101:8000/users/',{
        method: 'POST',
        body: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        }
    })
    return await request.json();
}

const styles = {
    textFields: {
        color: '#6699FF'
    }
}

export default registerPage