import React, { useState } from 'react';
import { ScrollView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Button, Text, Input, Card } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from '../components/imagePicker';

function CreateTask({ navigation }) {
    const offset = (new Date).getTimezoneOffset() * 60000;
    const [date, setDate] = useState(new Date(Date.now() - offset));
    const [show, setShow] = useState(false);
    const [time, setTime] = useState(new Date(Date.now() - offset));
    const [mode, setMode] = useState('date');
    const [loading, setLoading] = useState(false);
    const [fileURI, setFileURI] = useState(null);
    const [type, setType] = useState('jpg');

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
    return (
        <ScrollView>
            <Card containerStyle={{ backgroundColor: '#1F262A', borderColor: 'black' }} >
                <ImagePicker onInput={imageInput} context={'task'} />
                <Card.Divider />
                <Input label={'Task name'} />
                <Input label={'Task description'} multiline={true} />
                <Input label={'Tag'} />
                <Pressable onPress={() => (showDatepicker('date'))} >
                    <Input disabled={true} label={'Date'} value={date.toLocaleDateString()}
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

export default CreateTask;