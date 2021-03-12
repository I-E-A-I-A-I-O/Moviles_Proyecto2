import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import IonIcons from 'react-native-vector-icons/FontAwesome5';
import { Text } from 'react-native-elements';

import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

const FlatList = ({ tasks, type = 'normal', onChange }) => {

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
            backgroundColor: type === 'normal' ? isActive ? '#747f91' : '#3e443d' : 'silver',
            justifyContent: 'center',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: .5,
            borderRadius: 5
          }}
          android_ripple={{ color: 'white' }}
          focusable={true}
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
              paddingLeft: 15
            }}>
            {item.name}
          </Text>
          <Text
            style={{ fontWeight: 'bold', color: '#d3e5b5', position: 'absolute', left: '60%' }}
          >
            {item.tag.length > 0 ? item.tag : 'No tag'}
          </Text>
          <IonIcons
            style={{ alignSelf: 'flex-end', position: 'absolute', top: '30%', right: '2%' }}
            name={'star'} color={'gold'} size={30}
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
      data={tasks}
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

const moveIndexes = (array) => {
  for (let i = 0; i < array.length; i++) {
    array[i].list_index = i;
  }
}

export default FlatList;
