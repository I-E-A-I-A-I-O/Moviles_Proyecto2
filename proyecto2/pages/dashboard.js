import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Draggable from '../components/flatList';

import { connect } from 'react-redux';

function Dashboard({ navigation, sessionToken, userData }) {
    return (
        <View style={{ flex: 1 }}>
            <Input style={{ color: 'lime' }} label={'Search task'} />
            <Button title={'New task'} onPress={() => {
                navigation.navigate('ModalsStack', { screen: 'createTask' });
            }} />
            <Draggable />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        sessionToken: state.sessionToken,
        userData: state.userData
    }
}

export default connect(mapStateToProps, null)(Dashboard);