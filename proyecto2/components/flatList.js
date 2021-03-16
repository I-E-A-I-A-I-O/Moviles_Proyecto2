import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import IonIcons from 'react-native-vector-icons/FontAwesome5';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

const FlatList = ({ tasks, type = 'normal', onChange, filter }) => {

  const navigation = useNavigation();

  const pinChange = (taskId) => {
    if (type === 'normal') {
      onChange('toPinned', taskId);
    }
    else {
      onChange('toNormal', taskId);
    }
  }

  const renderItem = useCallback(
    ({ item, index, drag, isActive }: RenderItemParams<any>) => {
      return (
        <Pressable
          style={{
            height: 70,
            backgroundColor: type === 'normal' ? isActive ? '#747f91' : '#303841' : '#ff4d00',
            justifyContent: 'center',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: .5,
            borderRadius: 5
          }}
          android_ripple={{ color: 'white' }}
          focusable={true}
          onPress={() => {
            navigation.navigate('ModalsStack',
              { screen: 'taskDetails', params: { taskId: item.task_id } });
          }}
          onLongPress={() => {
            if (type === 'normal') {
              drag();
            }
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 32,
              alignSelf: 'flex-start',
              justifyContent: 'center',
              paddingLeft: 15
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#dbd8e3',
              position: 'absolute',
              left: '70%',
              justifyContent: 'center',
            }}
          >
            {item.tag}
          </Text>
          <IonIcons
            style={{ alignSelf: 'flex-end', position: 'absolute', top: '30%', right: '2%' }}
            name={'star'} color={'gold'} size={25}
            solid={type !== 'normal'}
            onPress={() => (pinChange(item.current_task_id))}
          />
        </Pressable>
      );
    },
    [],
  );

  return (
    <DraggableFlatList
      data={filter ? applyFilter(filter, tasks) : tasks}
      renderItem={renderItem}
      keyExtractor={(item, index) => `draggable-item-${item.task_id}`}
      onDragEnd={({ data, from, to }) => {
        if (from !== to) {
          moveIndexes(data);
          onChange('reorder', data);
        }
      }}
    />
  );
}

const applyFilter = (filter, tasks) => {
  let filteredName = tasks.filter((value) => value.name.includes(filter));
  let filteredTag = tasks.filter((value) => value.tag.includes(filter));
  return [...filteredName, ...filteredTag];
}

const moveIndexes = (array) => {
  for (let i = 0; i < array.length; i++) {
    array[i].list_index = i;
  }
}

export default FlatList;
