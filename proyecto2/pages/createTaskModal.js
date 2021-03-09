import React, { useState } from 'react';
import { ScrollView, Platform, ToastAndroid, Pressable, ActivityIndicator } from 'react-native';
import { Button, Text, Input, Card } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from '../components/imagePicker';
import { connect } from 'react-redux';

function CreateTask({ navigation, sessionToken }) {
    const offset = (new Date).getTimezoneOffset() * 60000;
    const [date, setDate] = useState(new Date(Date.now() - offset));
    const [show, setShow] = useState(false);
    const [time, setTime] = useState(new Date(Date.now() - offset));
    const [mode, setMode] = useState('date');
    const [loading, setLoading] = useState(false);
    const [fileURI, setFileURI] = useState(null);
    const [type, setType] = useState('jpg');
    const [taskName, setTaskName] = useState('');
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
        alert(JSON.stringify(data));
    };
    const saveTask = async () => {
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
        let response = await fetch('http://192.168.0.101:8000/tasks', {
            method: 'POST',
            body: form,
            headers: {
                'authToken': sessionToken
            }
        }).catch(err => {
            console.log(err);
            ToastAndroid.show('Network error. Try again later.', ToastAndroid.SHORT);
        });
        if (response) {
            let json = await response.json();
            console.log(json);
        }
    }

    return (
        <ScrollView>
            <Card containerStyle={{ backgroundColor: '#1F262A', borderColor: 'black' }} >
                <ImagePicker onInput={imageInput} context={'task'} />
                <Card.Divider />
                <Input label={'Task name'}
                    onChange={(e) => (setTaskName(e.nativeEvent.text))}
                />
                <Input label={'Task description'} multiline={true}
                    onChange={(e) => (setTaskDescription(e.nativeEvent.text))}
                />
                <Input label={'Tag'}
                    onChange={(e) => (setTaskTag(e.nativeEvent.text))}
                />
                <Pressable onPress={() => (showDatepicker('date'))} >
                    <Input disabled={true} label={'Date'} value={date.toISOString().split('T')[0]}
                        style={{ color: 'lime' }}
                    />
                </Pressable>
                <Pressable onPress={() => (showDatepicker('time'))} >
                    <Input disabled={true} label={'Time'} value={time.toLocaleTimeString().slice(0, 5)}
                        style={{ color: 'lime' }}
                    />
                </Pressable>
                <Button disabled={loading} title={'Save task'}
                    icon={<ActivityIndicator color={'lime'} animating={loading} />}
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

export default connect(mapStateToProps, null)(CreateTask);