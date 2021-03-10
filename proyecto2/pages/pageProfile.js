import React, {useState} from 'react';
import { ScrollView, Text, View, Button } from 'react-native';
import { Card} from 'react-native-elements';
import ImagePicker from '../components/imagePicker';
import { connect } from 'react-redux';

function pageProfile({ navigation }){
    let [fileURI, setFileURI] = useState(null);
    let [type, setType] = useState('jpg');

    const fileInput = (data) => {
        setType(data.type);
        setFileURI(data.uri);
    }

    return (
        <ScrollView onScroll={()=> init()}>
            <Card containerStyle={{ backgroundColor: '#1F262A', borderColor: '#6699FF' }} >
                    <ImagePicker onInput={fileInput} />
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Card.Divider />
                    <Text style={{color: '#6699FF', alignItems: 'center', justifyContent: 'center', fontSize: 25}}></Text>
                    <Card.Divider />
                </View>
                
                <Text style={{color: '#6699FF', fontSize: 17}}></Text>
                <Card.Divider />
                <Text style={{color: '#6699FF', fontSize: 17}}></Text>
           
                <Card.Divider />               

                <Button title={'Edit Profile'}
                    onPress ={() => {
                        navigation.navigate('pageEditProfile'); 
                }}></Button>

            </Card>
        </ScrollView>
    )
}

export default pageProfile;