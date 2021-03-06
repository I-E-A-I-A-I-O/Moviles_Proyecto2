import React, { useState } from 'react';
import { ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import toast from 'react-native-toast-message';
import { Button, Text, Input, Card } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from '../components/imagePicker';
import Pushwoosh from 'pushwoosh-react-native-plugin';
import { connect } from 'react-redux';
import { fetchStats } from '../components/fetchStats';
import { saveUserStats } from '../actions/saveUserStats';

function CreateTask({ navigation, sessionToken, reduxSaveStats }) {
    const offset = (new Date).getTimezoneOffset() * 60000;
    const [date, setDate] = useState(new Date(Date.now() - offset));
    const [show, setShow] = useState(false);
    const [time, setTime] = useState(new Date(Date.now() - offset));
    const [mode, setMode] = useState('date');
    const [loading, setLoading] = useState(false);
    const [fileURI, setFileURI] = useState(null);
    const [type, setType] = useState('jpg');
    const [taskName, setTaskName] = useState('');
    const [buttonTitle, setButtonTitle] = useState('Save task');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskTag, setTaskTag] = useState('');

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (mode === 'date') {
            const currentDate = selectedDate || date;
            setDate(currentDate);
        }
        else {
            const currentDate = selectedDate || time;
            setTime(currentDate);
        }
    };

    const showDatepicker = (pickerMode) => {
        setMode(pickerMode);
        setShow(true);
    };
    const imageInput = (data) => {
        setType(data.type);
        setFileURI(data.uri);
    };
    const saveTask = () => {
        Pushwoosh.getPushToken(function (token) {
            setLoading(true);
            setButtonTitle('');
            let form = new FormData();
            form.append('name', taskName);
            form.append('description', taskDescription);
            form.append('tag', taskTag);
            form.append('date', date.toISOString().split('T')[0]);
            form.append('time', time.toLocaleTimeString());
            if (fileURI) {
                form.append('image', {
                    type: `image/${type}`,
                    name: `avatar.${type}`,
                    uri: fileURI
                });
            }
            fetch('https://moviles-proyecto2.herokuapp.com/tasks', {
                method: 'POST',
                body: form,
                headers: {
                    'authToken': sessionToken,
                    'pushToken': token
                }
            }).then(response => response.json())
                .then(json => {
                    toast.show({ type: json.title.toLowerCase(), position: 'bottom', autoHide: true, text1: json.content });
                    setLoading(false);
                    setButtonTitle('Save task');
                    fetchStats(sessionToken).then(data => {
                        reduxSaveStats(data);
                    })
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    setButtonTitle('Save task');
                    toast.show({ type: 'error', position: 'bottom', autoHide: true, text1: 'Network error. Try again later' });
                });
        })
    }

    return (
        <ScrollView>
            <Card containerStyle={{ backgroundColor: '#1F262A', borderColor: 'black' }} >
                <ImagePicker onInput={imageInput} context={'task'} />
                <Card.Divider />
                <Input label={'Task name'}
                    onChange={(e) => (setTaskName(e.nativeEvent.text))}
                    style={{ color: 'white' }}
                />
                <Input label={'Task description'} multiline={true}
                    onChange={(e) => (setTaskDescription(e.nativeEvent.text))}
                    style={{ color: 'white' }}
                />
                <Input label={'Tag'}
                    onChange={(e) => (setTaskTag(e.nativeEvent.text))}
                    style={{ color: 'white' }}
                />
                <Pressable onPress={() => (showDatepicker('date'))} >
                    <Input disabled={true} label={'Date'} value={date.toISOString().split('T')[0]}
                        style={{ color: 'white' }}
                    />
                </Pressable>
                <Pressable onPress={() => (showDatepicker('time'))} >
                    <Input disabled={true} label={'Time'} value={time.toLocaleTimeString().slice(0, 5)}
                        style={{ color: 'white' }}
                    />
                </Pressable>
                <Button disabled={loading} title={buttonTitle}
                    icon={<ActivityIndicator color={'#e94560'} animating={loading} />}
                    onPress={saveTask}
                />
            </Card>
            {show && (
                <DateTimePicker
                    timeZoneOffsetInSeconds={0}
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    form
                    onChange={onChange}
                />
            )}
        </ScrollView>
    );
}

const mapStateToProps = (state) => {
    return {
        sessionToken: state.sessionToken
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        reduxSaveStats: (stats) => {
            dispatch(saveUserStats(stats));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);