import React, { useState } from 'react';
import { ScrollView, Image, useWindowDimensions, View } from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { connect } from 'react-redux';
import toast from 'react-native-toast-message';

function TaskDetails({ route, navigation, token }) {

    const { taskId } = route.params;
    const [fetchingData, setFetchingData] = useState(true);
    const [name, setName] = useState('Lore ipsum');
    const [image, setImage] = useState('https://static.umotive.com/img/product_image_thumbnail_placeholder.png');
    const [description, setDescription] = useState('No description.');
    const [tag, setTag] = useState('No tag.');
    const [date, setDate] = useState('1970/01/01 00:00');

    const width = useWindowDimensions().width;

    fetch(`http://192.168.0.101:8000/tasks/task/${taskId}`, {
        method: 'GET',
        headers: {
            'authToken': token
        }
    }).then(response => response.json())
        .then(json => {
            setFetchingData(false);
            setName(json.content.name);
            setDate(json.content.date.replace('T', ' ').replace('Z', '').split('.')[0]);
            if (json.content.image) { setImage(json.content.image); }
            if (json.content.description) { setDescription(json.content.description); }
            if (json.content.tag) { setTag(json.content.tag); }
        }).catch(err => {
            console.error(err);
            toast.show({
                type: 'error',
                text1: 'Error retrieving data. Try again later.',
                autoHide: true,
                position: 'bottom'
            });
        });

    return (
        <ScrollView>
            <SkeletonContent
                containerStyle={{ flex: 1, width: width, alignItems: 'center' }}
                isLoading={fetchingData}
                animationType={'shiver'}
                animationDirection={'horizontalLeft'}
                layout={[
                    { width: width, height: 200, marginBottom: 6 },
                    { width: width - 100, height: 40, marginBottom: 6 },
                    { width: width - 100, height: 100, marginBottom: 6 },
                    { width: width - 180, height: 30, marginBottom: 6 },
                    { width: width - 180, height: 30, marginBottom: 6 },
                ]}
            >
                <Image
                    source={{ uri: image }}
                    style={{ width: width, height: 200 }}
                />
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: width
                    }}
                >
                    <Text
                        h2
                        h2Style={{
                            color: '#dbd8e3',
                            textAlign: 'center',
                            textAlignVertical: 'center'
                        }}    
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: '#dbd8e3',
                            fontSize: 18,
                            padding: 20
                        }}
                    >
                        {description}
                    </Text>
                    <Text
                        style={{
                            color: '#dbd8e3',
                            fontSize: 18,
                            padding: 20
                        }}
                    >
                        Tag: {tag}
                    </Text>
                    <Text
                        style={{
                            color: '#dbd8e3',
                            fontSize: 18,
                            padding: 20
                        }}
                    >
                        Due: {date}
                    </Text>
                </View>
            </SkeletonContent>
        </ScrollView>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.sessionToken
    }
}

export default connect(mapStateToProps, null)(TaskDetails);