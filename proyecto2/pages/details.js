import React, { useState } from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import actionSheet from 'react-native-action-sheet';

function DetailsScreen({route, navigation}) {

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
          let options = [
            'Camera',
            'Files'
          ];
          actionSheet.showActionSheetWithOptions({options: options, title: 'Image source'}, (selected) => {
            console.log(selected);
            if (selected !== undefined){
              if (selected === 0){
                launchCamera({quality: 1, includeBase64: true, mediaType: 'photo'}, (response) => {
                  if (response.didCancel){console.log('canceled');}
                  else{console.log('input');}
                });
              }
              else{
                launchImageLibrary({quality: 1, includeBase64: true, mediaType: 'photo'}, (response) => {
                  if (response.didCancel){console.log('canceled');}
                  else{console.log('input');}
                });
              }
            }
          })
          /*launchCamera({quality: 1, includeBase64: true, mediaType: 'photo'}, (response) => {
            if (response.didCancel){
              console.log('Canceled')
            }
            else{
              console.log(response.base64);
            }
          })*/
        }}
      />
    </View>
  );
}

export default DetailsScreen;
