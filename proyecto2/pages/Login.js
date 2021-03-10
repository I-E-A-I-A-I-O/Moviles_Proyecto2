import React, { useState } from 'react';
import { ActivityIndicator, View, ToastAndroid } from 'react-native';
import { Text, Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { saveSessionToken } from '../actions/saveSessionToken';
import { saveUserData } from '../actions/saveUserData';
import Pushwoosh from 'pushwoosh-react-native-plugin';

function loginPage({ navigation, reduxSaveSessionToken, reduxUserData }) {

    const [loading, setLoading] = useState(false);
    const [buttonTitle, setButtonTitle] = useState('Login');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const fetchProfile = async (token) => {
        let response = await fetch('http://192.168.0.101:8000/users/user', {
            method: 'GET',
            headers: {
                'authToken': token
            }
        }).catch(err => {
            console.log(err);
            ToastAndroid.showWithGravity('Network error. Check internet connection.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        });
        let json = await response.json();
        if (json.title !== 'Error'){
            reduxUserData(json.content);
            Pushwoosh.setUserId(json.content.name);
            navigation.navigate('ModalsStack');
        }
        else{
            ToastAndroid.showWithGravity(json.content, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    }

    return (
        <View style={{ flex: 1, top: '25%' }} >
            <Text style={styles.title} >Task manager</Text>
            <Input
                onChange={(e) => {
                    setName(e.nativeEvent.text);
                }}
                placeholder={'Name'} label={'Name'} selectionColor={'lime'}
                style={styles.textFields} leftIcon={<Icon name={'person'}
                    color={'lime'} size={18} />}
            />
            <Input
                onChange={(e) => {
                    setPassword(e.nativeEvent.text);
                }}
                secureTextEntry={true} label={'Password'} selectionColor={'lime'}
                style={styles.textFields} leftIcon={<Icon name={'lock-closed'}
                    color={'lime'} size={18} />}
                placeholder={'Password'}
            />
            <Button
                title={buttonTitle}
                disabled={loading}
                icon={<ActivityIndicator color={'lime'} animating={loading} />}
                onPress={() => {
                    setLoading(true);
                    setButtonTitle('');
                    let data = {
                        name: name,
                        password: password
                    };
                    loginRequest(data).then(json => {
                        setButtonTitle('Login');
                        setLoading(false);
                        if (json.title !== 'Success') {
                            ToastAndroid.showWithGravity(json.content, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        }
                        else {
                            reduxSaveSessionToken(json.content);
                            fetchProfile(json.content);
                        }
                    }).catch(err => {
                        console.log(err);
                        ToastAndroid.showWithGravity('Network error. Check internet connection.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    })
                }}
            />
            <Text
                style={styles.createAccount}
                onPress={() => {
                    navigation.navigate('Register');
                }}
            >
                Create account
            </Text>
        </View>
    );
}

async function loginRequest(data) {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('password', data.password);
    let response = await fetch('http://192.168.0.101:8000/users/user', {
        method: 'POST',
        body: formData
    });
    let json = await response.json();
    return json;
}

const styles = {
    textFields: {
        color: '#6699FF'
    },
    title: {
        color: 'lime',
        textAlign: 'center',
        fontSize: 28,
        bottom: '8%',
        position: 'relative'
    },
    createAccount: {
        color: 'lime',
        fontSize: 15,
        left: '2%',
        position: 'relative',
        top: '3%'
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        reduxSaveSessionToken: (sessionToken) => {
            dispatch(saveSessionToken(sessionToken));
        },
        reduxUserData: (userData) => {
            dispatch(saveUserData(userData));
        }
    }
}

export default connect(null, mapDispatchToProps)(loginPage);