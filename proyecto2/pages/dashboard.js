import React, { useState } from 'react';
import { View, Modal, ActivityIndicator, ToastAndroid } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Draggable from '../components/flatList';
import { fetchTasks } from '../components/fetchTasks';
import { saveTasksData } from '../actions/saveTasksData';
import { savePinnedTasks } from '../actions/savePinnedTasks';

import { connect } from 'react-redux';

function Dashboard({ navigation, sessionToken, userData, reduxSavePinned, reduxSaveTasks }) {

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('New task / Refresh');

    const refresh = async (token) => {
        setLoading(true);
        setTitle('');
        let results = await fetchTasks(token);
        setLoading(false);
        setTitle('New task / Refresh');
        if (results) {
            alert(JSON.stringify(results))
            reduxSavePinned(results.content.pinned);
            reduxSaveTasks(results.content.tasks);
            ToastAndroid.show('Tasks updated.', ToastAndroid.SHORT);
        }
        else{
            ToastAndroid.show('Error fetching new tasks.', ToastAndroid.SHORT);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Input style={{ color: 'lime' }} label={'Search task'} />
            <Button
                title={title}
                disabled={loading}
                icon={
                    <ActivityIndicator animating={loading} color={'lime'} />
                }
                onPress={() => {
                    navigation.navigate('ModalsStack', { screen: 'createTask' });
                }}
                onLongPress={() => {
                    refresh(sessionToken);
                }}
            />
            <Draggable type={'pinned'} />
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

const mapDispatchToProps = (dispatch) => {
    return {
        reduxSaveTasks: (tasks) => {
            dispatch(saveTasksData(tasks));
        },
        reduxSavePinned: (pinned) => {
            dispatch(savePinnedTasks(pinned));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);