import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, ToastAndroid } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import RNToastMessage from 'react-native-toast-message';
import Draggable from '../components/flatList';
import { fetchTasks } from '../components/fetchTasks';
import { saveTasksData } from '../actions/saveTasksData';
import { normalToPinned } from '../actions/normalToPinned';
import { pinnedToNormal } from '../actions/pinnedToNormal';
import { savePinnedTasks } from '../actions/savePinnedTasks';
import { store } from '../store/store';
import { connect } from 'react-redux';
import { saveUserStats } from '../actions/saveUserStats';
import { fetchStats } from '../components/fetchStats'

function Dashboard({ route, navigation, sessionToken, reduxSavePinned, reduxSaveReorder,
    reduxToPinned, reduxToNormal, tasks, pinned, reduxSaveStats
}) {

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('New task / Refresh');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (route.params?.refreshOnEnter) {
            refresh(sessionToken);
        }
    }, [route.params?.refreshOnEnter]);

    const refresh = async (token) => {
        setLoading(true);
        setTitle('');
        let results = await fetchTasks(token);
        setLoading(false);
        setTitle('New task / Refresh');
        if (results) {
            reduxSavePinned(results.content.pinned);
            reduxSaveReorder(results.content.tasks);
            fetchStats(sessionToken).then(data => {
                reduxSaveStats(data);
            })
            ToastAndroid.show('Tasks updated.', ToastAndroid.SHORT);
        }
        else {
            ToastAndroid.show('Error fetching new tasks.', ToastAndroid.SHORT);
        }
    }

    const saveChanges = () => {
        let state = store.getState();
        let data = {
            pinned: state.pinnedTasks,
            tasks: state.tasksData
        }
        fetch('https://moviles-proyecto2.herokuapp.com/tasks', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'authToken': sessionToken
            }
        }).then(response => response.json())
            .then(json => {
                RNToastMessage.show({ text1: json.content, autoHide: true, type: 'info', position: 'bottom' });
            }).catch(err => {
                console.log(err);
                RNToastMessage.show({ text1: 'Error saving changes.', autoHide: true, type: 'error', position: 'bottom' });
            })
    }

    const saveAlert = () => {
        RNToastMessage.show(
            {
                type: 'info',
                text1: 'Unsaved changes. Tap to save.',
                position: 'bottom',
                onPress: () => {
                    saveChanges();
                    RNToastMessage.hide();
                }
            }
        )
    }

    const doOnChange = (type, data) => {
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
            <Input
                style={{ color: 'white' }}
                label={'Search task'}
                onChange={(ev) => (setFilter(ev.nativeEvent.text))}
            />
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

            {
                pinned.length > 0 && (
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: '#f6c90e',
                                fontWeight: 'bold',
                                fontSize: 30,
                                alignSelf: 'center'
                            }}
                        >
                            Pinned tasks
                </Text>
                        <Draggable
                            tasks={pinned}
                            onChange={doOnChange}
                            type={'pinned'}
                            filter={filter.length > 0 ? filter : null}
                        />
                    </View>
                )}
            {
                tasks.length > 0 && (
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 30,
                                alignSelf: 'center'
                            }}
                        >
                            Tasks
                </Text>
                        <Draggable
                            tasks={tasks}
                            onChange={doOnChange}
                            filter={filter.length > 0 ? filter : null}
                        />
                    </View>
                )}
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
        },
        reduxSaveStats: (stats) => {
            dispatch(saveUserStats(stats));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);