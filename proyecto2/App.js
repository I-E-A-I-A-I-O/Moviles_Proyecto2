import 'react-native-gesture-handler';
import React from 'react';
import {useColorScheme, DeviceEventEmitter} from 'react-native';

import {
  NavigationContainer,
  DarkTheme
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Notifications} from 'react-native-notifications';
import Pushwoosh from 'pushwoosh-react-native-plugin';

import Login from './pages/Login';
import Register from './pages/Register';

import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  const scheme = useColorScheme();

  Notifications.registerRemoteNotifications();

  Notifications.events().registerNotificationReceivedForeground(
    (notification: Notification, completion) => {
      console.log(
        `Notification received in foreground: ${notification.title} : ${notification.body}`,
      );
      Notifications.postLocalNotification({
        body: notification.body,
        title: notification.title,
      });
      completion({alert: false, sound: false, badge: false});
    },
  );

  Notifications.events().registerNotificationOpened(
    (notification: Notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    },
  );

  // Request permissions on iOS, refresh token on Android
  Notifications.registerRemoteNotifications();

  Notifications.events().registerRemoteNotificationsRegistered(
    (event: Registered) => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken);
    },
  );
  Notifications.events().registerRemoteNotificationsRegistrationFailed(
    (event: RegistrationError) => {
      console.error(event);
    },
  );

  Pushwoosh.init({
    pw_appid: '6F321-F45AD',
    project_number: '667393835268',
  });
  Pushwoosh.register((success, fail) => {
    Pushwoosh.setUserId(success);
    let body = {userId: success, time: '23:59'};
    fetch('http://192.168.0.101:8000/notifications', {
      method: 'POST',
      body: JSON.stringify(body),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(json => {
      console.log(json);
    })
  });

  // this event is fired when the push is received in the app
  DeviceEventEmitter.addListener('pushReceived', (e: Event) => {
    console.warn('pushReceived: ' + JSON.stringify(e));
    // shows a push is received. Implement passive reaction to a push, such as UI update or data download.
  });

  // this event is fired when user clicks on notification
  DeviceEventEmitter.addListener('pushOpened', (e: Event) => {
    console.warn('pushOpened: ' + JSON.stringify(e));
    // shows a user tapped the notification. Implement user interaction, such as showing push details
  });

  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator initialRouteName='login' >
            <Stack.Screen name={'Login'} component={Login} options={{title: ''}} />
            <Stack.Screen name={'Register'} component={Register} options={{title: 'Create a new account'}} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
