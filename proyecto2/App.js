import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';

import { Notifications } from 'react-native-notifications';

import Pushwoosh from 'pushwoosh-react-native-plugin';

import Login from './pages/Login';
import Register from './pages/Register';

import ModalsStack from './pages/modalsStack';

import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';

const Stack = createStackNavigator();

const App: () => React$Node = () => {

  Notifications.registerRemoteNotifications();

  Notifications.events().registerNotificationReceivedForeground(
    (notification: Notification, completion) => {
      let u = JSON.parse(notification.payload.u);
      console.log(
        `Notification received in foreground: ${notification.title} : ${u.task_id}`,
      );
      Notifications.postLocalNotification({
        title: notification.title
      });
      completeTask(u.task_id);
    },
  );

  Notifications.events().registerNotificationReceivedBackground(
    (notification: Notification, completion) => {
      let u = JSON.parse(notification.payload.u);
      console.log(
        `Notification received in background: ${notification.title} : ${u.task_id}`,
      );
      completion({ alert: true, sound: true, badge: true });
      completeTask(u.task_id);
    }
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
  Pushwoosh.register((success, fail) => { });

  const completeTask = (taskId) =>{
    fetch(`http://192.168.0.101:8000/tasks/task/${taskId}`, {
      method: 'PUT'
    });
  }

  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator initialRouteName='login' >
            <Stack.Screen name={'Login'} component={Login} options={{ title: '' }} />
            <Stack.Screen name={'Register'} component={Register} options={{ title: 'Create a new account' }} />
            <Stack.Screen name={'ModalsStack'} component={ModalsStack}
              options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
