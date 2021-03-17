import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, ToastAndroid } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import ImagePicker from '../components/imagePicker';

function registerPage({ navigation }) {
    let [name, setName] = useState('');
    let [password, setPassword] = useState('');
    let [confirm, setConfirm] = useState('');
    let [email, setEmail] = useState('');
    let [buttonTitle, setButtonTitle] = useState('Register');
    let [loading, setLoading] = useState(false);
    let [fileURI, setFileURI] = useState(null);
    let [type, setType] = useState('jpg');

    const fileInput = (data) => {
        setType(data.type);
        setFileURI(data.uri);
    }

    return (
        <ScrollView>
            <Card containerStyle={{ backgroundColor: '#393e46', borderColor: 'black' }} >
                <ImagePicker onInput={fileInput} />
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
                    let data = {
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
                }} icon={<ActivityIndicator color={'#e94560'} animating={loading} />}
                    disabled={loading}
                />
            </Card>
        </ScrollView>
    );
}

async function fetchData(data) {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirm', data.confirm);
    if (data.avatar) {
        formData.append('avatar', {
            type: 'image/' + data.type,
            name: 'avatar.' + data.type,
            uri: data.avatar
        });
    }
    let request = await fetch('http://moviles-proyecto2.herokuapp.com/users/', {
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
        color: 'white'
    }
}

export default registerPage