import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';

import { saveUserData } from '../actions/saveUserData';

import Dashboard from './dashboard';

const Tab = createBottomTabNavigator();

function UserPages({ navigation, sessionToken, reduxUserData, userData }) {
    fetchProfile(sessionToken).then(profile => {
        if (profile) {
            if (profile.title === 'Error') {
                navigation.goBack();
            }
            else {
                reduxUserData(profile.content);
            }
        }
        else {
            navigation.goBack();
        }
    })
    return (
        <Tab.Navigator initialRouteName={'Dashboard'} >
            <Tab.Screen
                name={'Dashboard'} component={Dashboard}
                options={
                    {
                        tabBarIcon: (focused) => (
                            <IonIcons size={25} name={focused ? 'clipboard' : 'clipboard-outline'} color={focused ? 'lime' : 'green'} />
                        ),
                    }
                }
            />
        </Tab.Navigator>
    )
}

const mapStateToProps = (state) => {
    return {
        sessionToken: state.sessionToken,
        userData: state.userData
    }
}

async function fetchProfile(token) {
    let response = await fetch('http://192.168.0.101:8000/users/user', {
        method: 'GET',
        headers: {
            'authToken': token
        }
    }).catch(err => {
        console.log(err);
        return null;
    });
    return await response.json();
}

const mapDispatchToProps = (dispatch) => {
    return {
        reduxUserData: (userData) => {
            dispatch(saveUserData(userData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPages);