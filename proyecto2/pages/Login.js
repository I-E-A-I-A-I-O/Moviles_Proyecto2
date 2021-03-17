import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import toast from 'react-native-toast-message';
import { Text, Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { saveSessionToken } from '../actions/saveSessionToken';
import { saveUserData } from '../actions/saveUserData';
import { saveTasksData } from '../actions/saveTasksData';
import { savePinnedTasks } from '../actions/savePinnedTasks';
import Pushwoosh from 'pushwoosh-react-native-plugin';
import { fetchTasks } from '../components/fetchTasks';

class loginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: false, buttonTitle: 'Login', name: '', password: '' };
    }

    fetchProfile = async (token) => {
        let response = await fetch('http://moviles-proyecto2.herokuapp.com/users/user', {
            method: 'GET',
            headers: {
                'authToken': token
            }
        }).catch(err => {
            console.log(err);
            toast.show({ type: 'error', position: 'bottom', autoHide: true, text1: 'Network error. Try again later' });
        });
        let json = await response.json();
        if (json.title !== 'Error') {
            this.props.reduxUserData(json.content);
            Pushwoosh.setUserId(json.content.name);
            this.props.navigation.navigate('ModalsStack');
        }
        else {
            toast.show({ type: json.title.toLowerCase(), position: 'bottom', autoHide: true, text1: json.content });
        }
    }

    getTasks = async (token) => {
        let results = await fetchTasks(token);
        if (results) {
            this.props.reduxSavePinned(results.content.pinned);
            this.props.reduxSaveTasks(results.content.tasks);
        }
        else {
            toast.show({ type: 'error', position: 'bottom', autoHide: true, text1: 'Error retrieving tasks.' });
        }
    }

    componentDidMount(){
        if (this.props.sessionToken.length > 0){
            this.props.navigation.navigate('ModalsStack');
        }
    }

    render() {
        return (
            <View style={{ flex: 1, top: '25%' }} >
                <Text style={styles.title} >Task manager</Text>
                <Input
                    onChange={(e) => {
                        this.setState({ name: e.nativeEvent.text });
                    }}
                    placeholder={'Name'} label={'Name'} selectionColor={'#e94560'}
                    style={styles.textFields} leftIcon={<Icon name={'person'}
                        color={'#e94560'} size={18} />}
                />
                <Input
                    onChange={(e) => {
                        this.setState({ password: e.nativeEvent.text });
                    }}
                    secureTextEntry={true} label={'Password'} selectionColor={'#e94560'}
                    style={styles.textFields} leftIcon={<Icon name={'lock-closed'}
                        color={'#e94560'} size={18} />}
                    placeholder={'Password'}
                />
                <Button
                    title={this.state.buttonTitle}
                    disabled={this.state.loading}
                    icon={<ActivityIndicator color={'#e94560'} animating={this.state.loading} />}
                    onPress={() => {
                        this.setState({ loading: true, buttonTitle: '' });
                        let data = {
                            name: this.state.name,
                            password: this.state.password
                        };
                        loginRequest(data).then(json => {
                            this.setState({ loading: false, buttonTitle: 'Login' });
                            if (json.title !== 'Success') {
                                toast.show({ type: 'error', position: 'bottom', autoHide: true, text1: json.content });
                            }
                            else {
                                this.props.reduxSaveSessionToken(json.content);
                                this.fetchProfile(json.content);
                                this.getTasks(json.content);
                            }
                        }).catch(err => {
                            console.log(err);
                            toast.show({ type: 'error', position: 'bottom', autoHide: true, text1: 'Network error. Try again later' });
                        })
                    }}
                />
                <Text
                    style={styles.createAccount}
                    onPress={() => {
                        this.props.navigation.navigate('Register');
                    }}
                >
                    Create account
                </Text>
            </View>
        )
    }
}

async function loginRequest(data) {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('password', data.password);
    let response = await fetch('http://moviles-proyecto2.herokuapp.com/users/user', {
        method: 'POST',
        body: formData
    }).catch(err => {
        console.log(err);
    });
    return response ? await response.json() : null;
}

const styles = {
    textFields: {
        color: 'white'
    },
    title: {
        color: '#dbd8e3',
        textAlign: 'center',
        fontSize: 38,
        bottom: '8%',
        position: 'relative'
    },
    createAccount: {
        color: '#3282b8',
        fontWeight: 'bold',
        fontSize: 15,
        left: '2%',
        position: 'relative',
        top: '3%'
    }
}

const mapStateToProps = (state) => {
    return {
        sessionToken: state.sessionToken
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        reduxSaveSessionToken: (sessionToken) => {
            dispatch(saveSessionToken(sessionToken));
        },
        reduxUserData: (userData) => {
            dispatch(saveUserData(userData));
        },
        reduxSaveTasks: (tasksData) => {
            dispatch(saveTasksData(tasksData));
        },
        reduxSavePinned: (pinnedTasks) => {
            dispatch(savePinnedTasks(pinnedTasks));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(loginPage);
