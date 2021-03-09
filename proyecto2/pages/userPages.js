import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';

import Dashboard from './dashboard';

const Tab = createBottomTabNavigator();

function UserPages({ navigation }) {
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

export default UserPages;