import React from 'react';
import {Avatar} from 'react-native-elements';
import {View} from 'react-native';
import {connect} from 'react-redux';

function UserAvatar({userData}) {
    return(
        <View style={{padding: 10}} >
            <Avatar rounded source={{uri: userData.avatar}} />
        </View>
    )
}

const matchStateToProps = (state) => {
    return {
        userData: state.userData
    }
}

export default connect(matchStateToProps, null)(UserAvatar);