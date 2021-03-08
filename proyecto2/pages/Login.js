import React, {useState} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text, Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';

function loginPage({navigation}) {

    const [loading, setLoading] = useState(false);
    const [buttonTitle, setButtonTitle] = useState('Login');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    return(
        <View style={{flex: 1, top: '25%'}} >
            <Text style={styles.title} >Task manager</Text>
            <Input
                onChange={(e) => {
                    setName(e.nativeEvent.text);
                }}
                placeholder={'Name'} label={'Name'} selectionColor={'lime'} 
                style={styles.textFields} leftIcon={<Icon name={'person'} 
                color={'lime'} size={18} />}
            />
            <Input 
                onChange={(e) => {
                    setPassword(e.nativeEvent.text);
                }}
                secureTextEntry={true} label={'Password'} selectionColor={'lime'}
                style={styles.textFields} leftIcon={<Icon name={'lock-closed'} 
                color={'lime'} size={18} />}
                placeholder={'Password'}
            />
            <Button 
                title={buttonTitle} 
                disabled={loading} 
                icon={<ActivityIndicator color={'lime'} animating={loading} />} 
                onPress={() => {
                    setLoading(true);
                    setButtonTitle('');
                    let data = {
                        name: name,
                        password: password
                    };
                    loginRequest(data).then(json => {
                        setButtonTitle('Login');
                        setLoading(false);
                    })
                }}
            />
            <Text 
                style={styles.createAccount}
                onPress={() => {
                    navigation.navigate('Register');
                }}
            >
                Create account
            </Text>
        </View>
    );
}

async function loginRequest(data) {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('password', data.password);
    let response = await fetch('http://192.168.0.101:8000/users/user', {
        method: 'POST',
        body: formData
    });
    let json = await response.json();
    return json;
}

const styles = {
    textFields: {
        color: '#6699FF'
    },
    title:{
        color: 'lime',
        textAlign: 'center',
        fontSize: 28,
        bottom: '8%',
        position: 'relative'
    },
    createAccount:{
        color: 'lime',
        fontSize: 15,
        left: '2%',
        position: 'relative',
        top: '3%'
    }
}

export default loginPage;