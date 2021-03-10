import React, {useState} from 'react';
import { ScrollView, Text, View, Button } from 'react-native';
import { Card} from 'react-native-elements';
import ImagePicker from '../components/imagePicker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function pageProfile({navigation},name, email, pass){
    let [fileURI, setFileURI] = useState(null);
    let [type, setType] = useState('jpg');
    let data = { name: name, email:email, pass: pass }

    const fileInput = (data) => {
        setType(data.type);
        setFileURI(data.uri);
    }

    return (
        <ScrollView onInput = {() => init(data)}>
            <Card containerStyle={{ backgroundColor: '#1F262A', borderColor: '#6699FF' }} >
                    <ImagePicker onInput={fileInput} />
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Card.Divider />
                    <Text style={{color: '#6699FF', alignItems: 'center', justifyContent: 'center', fontSize: 25}}>{name}</Text>
                    <Card.Divider />
                </View>

                <Text style={{color: '#6699FF', fontSize: 17}}>Password: {pass}</Text>
                <Card.Divider />
                <Text style={{color: '#6699FF', fontSize: 17}}>Email: {email}</Text>
           
                <Card.Divider />

                <Button title="EDIT PROFILE"></Button>
            </Card>
        </ScrollView>
    );
}

function init (data){
    let form = new FormData();
    form.append("name", data.name);
    form.append("pass", data.pass);

    if(form.get("name") === "" || form.get("pass") === "" ){ return; }

    fetch("http://192.168.0.101:8000/users/dataProfile",{
        method: 'POST',
        body: form,
    }).then(res => res.json())
    .then(data => {
       if(data.message === ""){}

    }).catch((error) => {
        alert('Hubo un problema con la petición Fetch:' + error);
    });

}

export default pageProfile;