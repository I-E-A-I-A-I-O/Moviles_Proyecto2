import React, { useState } from 'react';
import { View, ActivityIndicator, ToastAndroid } from 'react-native';
import { Button, Input } from 'react-native-elements';
import RNToastMessage from 'react-native-toast-message';
import Draggable from '../components/flatList';
import { fetchTasks } from '../components/fetchTasks';
import { saveTasksData } from '../actions/saveTasksData';
import { normalToPinned } from '../actions/normalToPinned';
import { pinnedToNormal } from '../actions/pinnedToNormal';
import { savePinnedTasks } from '../actions/savePinnedTasks';
import { connect } from 'react-redux';

function Dashboard({ navigation, sessionToken, reduxSavePinned, reduxSaveReorder, reduxToPinned,
    reduxToNormal, tasks, pinned
}) {

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
            reduxReorder(results.content.tasks);
            ToastAndroid.show('Tasks updated.', ToastAndroid.SHORT);
        }
        else {
            ToastAndroid.show('Error fetching new tasks.', ToastAndroid.SHORT);
        }
    }

    const saveChanges = () => {
        /*fetch('http://192.168.0.101:8000/tasks', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'authToken': sessionToken
            }
        }).then(response => response.json())
            .then(json => {
                RNToastMessage.show({ text1: json.content, autoHide: true, type: 'info', position: 'bottom' });
            })*/
    }

    const saveAlert = () => {
        RNToastMessage.show(
            {
                type: 'info',
                text1: 'Unsaved changes. Tap to save.',
                position: 'bottom',
                onPress: () => {
                    alert(JSON.stringify(tasks));
                    RNToastMessage.hide();
                }
            }
        )
    }

    const doOnChange = (type, data) => {
        alert(JSON.stringify(tasks));
        switch (type) {
            case 'toNormal': {
                reduxToNormal(data);
                break;
            }
            case 'toPinned': {
                reduxToPinned(data);
                break;
            }
            case 'reorder': {
                reduxSaveReorder(data);
                break;
            }
            default: {
                break;
            }
        }
        saveAlert();
    }

    return (
        <View style={{ flex: 1 }}>
            {
                false && <Input value={JSON.stringify(tasks)} />
            }
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
            <Draggable tasks={pinned} onChange={doOnChange} type={'pinned'} />
            <Draggable tasks={tasks} onChange={doOnChange} />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        tasks: state.tasksData,
        sessionToken: state.sessionToken,
        pinned: state.pinnedTasks
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        reduxSaveReorder: (newArray) => {
            dispatch(saveTasksData(newArray));
        },
        reduxSavePinned: (pinned) => {
            dispatch(savePinnedTasks(pinned));
        },
        reduxToPinned: (taskId) => {
            dispatch(normalToPinned(taskId));
        },
        reduxToNormal: (taskId) => {
            dispatch(pinnedToNormal(taskId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);