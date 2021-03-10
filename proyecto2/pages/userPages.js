import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Dashboard from './dashboard';
import pageProfile from './pageProfile'
import pageEditProfile from './pageEditProfile';

const Tab = createBottomTabNavigator();

function UserPages({ navigation }) {
    return (
        <Tab.Navigator initialRouteName={'Dashboard'} >
            <Tab.Screen
                name={'dashboard'} component={Dashboard}
                options={
                    {
                        tabBarIcon: (focused) => (
                            <IonIcons size={25} name={focused ? 'clipboard' : 'clipboard-outline'} color={focused ? 'lime' : 'green'} />
                        ),
                    }
                }
            />
            <Tab.Screen
                name={'pageProfile'} component={pageProfile}
                options={
                    {
                        tabBarIcon: (focused) => (
                            <IonIcons size={25} name={focused ? 'clipboard' : 'clipboard-outline'} color={focused ? 'lime' : 'green'} />
                        ),
                        title:' Profile'
                    }
                }
            />
            <Tab.Screen name={'pageEditProfile'} component={pageEditProfile} options={{title: ''}} />

        </Tab.Navigator>
    )
}

export default UserPages;