import Pushwoosh from 'pushwoosh-react-native-plugin';

Pushwoosh.init({
  pw_appid: '6F321-F45AD',
  project_number: '667393835268',
});
Pushwoosh.register();

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
