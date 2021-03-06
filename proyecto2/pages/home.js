import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';

function HomeScreen({route, navigation}) {
  const {randomNum} = route.params;
  const [boolValue, setBoolValue] = useState(false);
  let [intValue, setIntValue] = useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => alert('nigga maaffaaakaa')}
          title="Update count"
        />
      ),
    });
  }, [route, navigation, intValue]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        Home Screen {randomNum}. Btw, the bool is {boolValue ? 'true' : 'false'}
      </Text>
      <Button title={'Press to change bool'} onPress={coolShit} />
    </View>
  );
  function coolShit() {
    if (intValue < 3) {
      setIntValue(intValue + 1);
      setBoolValue(!boolValue);
    } else {
      navigation.setOptions({title: 'WOW'});
    }
  }
}

export default HomeScreen;
