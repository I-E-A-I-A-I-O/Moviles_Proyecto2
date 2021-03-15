import React, { useState } from 'react';
import { ScrollView, Pressable, Platformm, View } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import ImgPicker from '../components/imagePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import toast from 'react-native-toast-message';
import Pushwoosh from 'pushwoosh-react-native-plugin';

function EditTask({ route, navigation }) {

    const {
        taskId,
        taskName,
        taskDescription,
        taskDate, taskTag,
        taskImage,
        token
    } = route.params;

    const [name, setName] = useState(taskName);
    const [description, setDescription] = useState(taskDescription);
    const [date, setDate] = useState((new Date(taskDate)).toISOString().split('T')[0]);
    const [time, setTime] = useState((new Date(taskDate)).toLocaleTimeString());
    const [tag, setTag] = useState(taskTag);
    const [image, setImage] = useState(taskImage);
    const [imgType, setImgType] = useState('jpg');
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');

    const [nameEdited, setNameEdited] = useState(false);
    const [descriptionEdited, setDescriptionEdited] = useState(false);
    const [tagEdited, setTagEdited] = useState(false);
    const [dateEdited, setDateEdited] = useState(false);
    const [timeEdited, setTimeEdited] = useState(false);
    const [imageEdited, setImageEdited] = useState(false);

    const onImgInput = (input) => {
        setImage(input.uri);
        setImgType(input.type);
        setImageEdited(true);
    }

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (mode === 'date') {
            if (!dateEdited) { setDateEdited(true); }
            const currentDate = selectedDate || date;
            setDate((new Date(currentDate)).toISOString().split('T')[0]);
        }
        else {
            if (!timeEdited) { setTimeEdited(true); }
            const currentDate = selectedDate || time;
            setTime(typeof currentDate === 'string' ? currentDate : (new Date(currentDate)).toLocaleTimeString());
        }
    };

    const showDatepicker = (pickerMode) => {
        setMode(pickerMode);
        setShow(true);
    };

    const onInput = (type, input) => {
        switch (type) {
            case 'name': {
                setName(input);
                setNameEdited(true);
                break;
            }
            case 'description': {
                setDescription(input);
                setDescriptionEdited(true);
                break;
            }
            case 'tag': {
                setTag(input);
                setTagEdited(true);
                break;
            }
            default: { break; }
        }
    };

    const saveChanges = (type) => {
        Pushwoosh.getPushToken((pushToken) => {
            toast.show({ type: 'info', text1: 'Saving changes...', autoHide: false, position: 'bottom' });
            let form = new FormData();
            switch (type) {
                case 'name': {
                    form.append('name', name);
                    break;
                }
                case 'description': {
                    form.append('description', description);
                    break;
                }
                case 'tag': {
                    form.append('tag', tag);
                    break;
                }
                case 'date': {
                    form.append('date', date);
                    break;
                }
                case 'time': {
                    form.append('time', time);
                    break;
                }
                case 'image': {
                    form.append('image', {
                        uri: image,
                        type: `image/${imgType}`,
                        name: `avatar.${imgType}`
                    })
                }
            }
            fetch(`http://192.168.0.101:8000/tasks/task/${taskId}/${type}`, {
                method: 'PUT',
                body: form,
                headers: {
                    'authToken': token,
                    'pushToken': pushToken
                }
            }).then(response => response.json())
                .then(json => {
                    toast.show({ type: json.title, text1: json.content, autoHide: true, position: 'bottom' });
                }).catch(err => {
                    toast.show({ type: 'error', text1: "Error saving changes. Try again later.", autoHide: true, position: 'bottom' });
                })
        })
    }

    return (
        <ScrollView>
            <ImgPicker initialImage={image} onInput={onImgInput} />
            <Pressable
                disabled={!imageEdited}
                android_ripple={{
                    color: 'white',
                    borderless: true
                }}
            >
                <Icon
                    type={'font-awesome-5'}
                    name={'save'}
                    color={imageEdited ? '#e94560' : 'gray'}
                    onPress={() => (saveChanges('image'))}
                />
            </Pressable>
            <Input
                label={'Name'}
                value={name}
                style={{
                    color: '#dbd8e3'
                }}
                onChange={(evn) => (onInput('name', evn.nativeEvent.text))}
                rightIcon={
                    <Pressable
                        disabled={!nameEdited}
                        android_ripple={{
                            color: 'white',
                            borderless: true
                        }}
                    >
                        <Icon
                            type={'font-awesome-5'}
                            name={'save'}
                            color={nameEdited ? '#e94560' : 'gray'}
                            onPress={() => (saveChanges('name'))}
                        />
                    </Pressable>
                }
            />
            <Input
                label={'Description'}
                value={description}
                multiline={true}
                style={{
                    color: '#dbd8e3'
                }}
                onChange={(evn) => (onInput('description', evn.nativeEvent.text))}
                rightIcon={
                    <Pressable
                        disabled={!descriptionEdited}
                        android_ripple={{
                            color: 'white',
                            borderless: true
                        }}
                    >
                        <Icon
                            type={'font-awesome-5'}
                            name={'save'}
                            color={descriptionEdited ? '#e94560' : 'gray'}
                            onPress={() => (saveChanges('description'))}
                        />
                    </Pressable>
                }
            />
            <Input
                label={'Tag'}
                value={tag}
                style={{
                    color: '#dbd8e3'
                }}
                onChange={(evn) => (onInput('tag', evn.nativeEvent.text))}
                rightIcon={
                    <Pressable
                        disabled={!tagEdited}
                        android_ripple={{
                            color: 'white',
                            borderless: true
                        }}
                    >
                        <Icon
                            type={'font-awesome-5'}
                            name={'save'}
                            color={tagEdited ? '#e94560' : 'gray'}
                            onPress={() => (saveChanges('tag'))}
                        />
                    </Pressable>
                }
            />
            <Pressable
                onPress={() => (
                    showDatepicker('date')
                )}
            >
                <Input
                    label={'Date'}
                    value={date}
                    style={{
                        color: '#dbd8e3'
                    }}
                    disabled={true}
                    rightIcon={
                        <Pressable
                            disabled={!dateEdited}
                            android_ripple={{
                                color: 'white',
                                borderless: true
                            }}
                        >
                            <Icon
                                type={'font-awesome-5'}
                                name={'save'}
                                color={dateEdited ? '#e94560' : 'gray'}
                                onPress={() => (saveChanges('date'))}
                            />
                        </Pressable>
                    }
                />
            </Pressable>
            <Pressable
                onPress={() => (
                    showDatepicker('time')
                )}
            >
                <Input
                    label={'Time'}
                    value={time}
                    style={{
                        color: '#dbd8e3'
                    }}
                    disabled={true}
                    rightIcon={
                        <Pressable
                            disabled={!timeEdited}
                            android_ripple={{
                                color: 'white',
                                borderless: true
                            }}
                        >
                            <Icon
                                type={'font-awesome-5'}
                                name={'save'}
                                color={timeEdited ? '#e94560' : 'gray'}
                                onPress={() => (saveChanges('time'))}
                            />
                        </Pressable>
                    }
                />
            </Pressable>
            {show && (
                <DateTimePicker
                    timeZoneOffsetInSeconds={0}
                    value={new Date(Date.now())}
                    mode={mode}
                    is24Hour={true}
                    form
                    onChange={onChange}
                />
            )}
        </ScrollView>
    )
}

export default EditTask;