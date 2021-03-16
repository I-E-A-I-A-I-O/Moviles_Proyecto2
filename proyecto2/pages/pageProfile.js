import React, {useState} from 'react';
import { ScrollView, Text, View, Button, Image } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';

function pageProfile({ navigation, userData }){

    return (
        <ScrollView >

            <Card containerStyle={{ backgroundColor: '#1F262A', borderColor: '#6699FF' }} >
                    <Card.Image 
                        style={{ width: '100%', height: 250 }}
                        source={{ uri: `../media/avatars/${userData.name}/${userData.avatar}` }}/>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Card.Divider />
                    <Text style={{color: '#6699FF', alignItems: 'center', justifyContent: 'center', fontSize: 25}}>{userData.name}</Text>
                    <Card.Divider />
                </View>
               
                <Card.Divider />               

                <Button title={'Edit Profile'}
                    onPress ={() => {
                        navigation.navigate('pageEditProfile'); 
                }}></Button>

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Card.Divider />
                    <Text style={{color: '#6699FF', alignItems: 'center', justifyContent: 'center', fontSize: 25}}>User Statistics</Text>
                    <Card.Divider />
                </View>

                <Text style={{color: '#6699FF', fontSize: 17}}>Taks Create: {}</Text>
                <Text style={{color: '#6699FF', fontSize: 17}}>Task Completed: {}</Text>
                <Text style={{color: '#6699FF', fontSize: 17}}>Task Pinned: {}</Text>
            </Card>
        </ScrollView>
    )
}

async function requestTaskStasts(){

    
}

const mapStateToProps = (state) => {
    return {
        sessionToken: state.sessionToken,
        userData: state.userData
    }
}


export default connect(mapStateToProps, null)(pageProfile);
