import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import Dashboard from './dashboard';
import pageProfile from './pageProfile'
import pageEditProfile from './pageEditProfile';

const Tab = createBottomTabNavigator();

function UserPages({ navigation }) {
  return (
    <Tab.Navigator
    initialRouteName={'Dashboard'}
    >
    <Tab.Screen
    name={'pageProfile'} component={pageProfile}
    options={
      {
        tabBarIcon: (focused) => (
          <Icon
          type={'font-awesome-5'}
          size={25} name={focused ? 'user-circle' : 'user-circle-outline'}
          color={focused ? '#e94560' : '#84142d'} />
        ),
        title:' Profile'
      }
    }
    />
    <Tab.Screen
    name={'Dashboard'}
    component={Dashboard}
    options={
      {
        tabBarIcon: (focused) => (
          <Icon size={25}
          type={'font-awesome-5'}
          name={focused ? 'clipboard' : 'clipboard-outline'}
          color={focused ? '#e94560' : '#84142d'}
          />
        ),
      }
    }
    />
    <Tab.Screen name={'pageEditProfile'} component={pageEditProfile} options={{title: ''}} />

    </Tab.Navigator>
  )
}

export default UserPages;
