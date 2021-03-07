import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function DetailsScreen({route, navigation}) {
  const {deviceToken} = route.params;
  console.log('THE TOKEN ISSSSS ' + deviceToken);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Button
        title={'aweno'}
        onPress={() => {
          navigation.navigate('Home', {
            randomNum: Math.floor(Math.random() * 100),
          });
        }}
        icon={<Icon name={'airplane-outline'} size={20} color={'cyan'} />}
      />
      <Button
        title={'go to example'}
        onPress={() => {
          navigation.navigate('Example');
        }}
      />
    </View>
  );
}

export default DetailsScreen;
