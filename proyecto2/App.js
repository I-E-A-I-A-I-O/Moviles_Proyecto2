import 'react-native-gesture-handler';

import { Notifications} from 'react-native-notifications';

Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
  let id = JSON.parse(notification.payload.u).task_id;
  completeTask(id);
  Notifications.postLocalNotification({title: notification.title})
  completion({alert: true, sound: true, badge: true});
})

Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
  let id = JSON.parse(notification.payload.u).task_id;
  completeTask(id);
})

const completeTask = async (taskId) => {
  fetch(`http://192.168.0.101:8000/tasks/task/${taskId}`, {
    method: 'PUT'
  }).catch(err => {
    console.error(err);
  });
}

import Pushwoosh from 'pushwoosh-react-native-plugin';

Pushwoosh.init({
  pw_appid: '6F321-F45AD',
  project_number: '667393835268',
});
Pushwoosh.register((success, fail) => { });

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './pages/Login';
import Register from './pages/Register';
import ModalsStack from './pages/modalsStack';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { not } from 'react-native-reanimated';

const Stack = createStackNavigator();

const App: () => React$Node = () => {

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
