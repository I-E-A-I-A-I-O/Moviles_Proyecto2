import React, { useState, useCallback } from 'react';
import { Pressable } from 'react-native';
import { connect } from 'react-redux';
import IonIcons from 'react-native-vector-icons/FontAwesome5';
import { Text, Tooltip } from 'react-native-elements';
import { saveTasksData } from '../actions/saveTasksData';

import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

function FlatList({ tasks, reduxSaveReorder }) {

  type Task = {
    task_id: string,
    name: string,
    tag: string,
    list_index: number
  };

  const renderItem = useCallback(
    ({ item, index, drag, isActive }: RenderItemParams<Task>) => {
      return (
        <Pressable
          style={{
            height: 70,
            backgroundColor: isActive ? '#747f91' : '#3e443d',
            justifyContent: 'center',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: .5,
            borderRadius: 5
          }}
          android_ripple={{ color: 'white' }}
          focusable={true}
          onLongPress={drag}>
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
            style={{fontWeight: 'bold', color:'#d3e5b5', position: 'absolute', left:'60%'}}
          >
            {item.tag.length > 0 ? item.tag : 'No tag'}
          </Text>
          <IonIcons style={{ alignSelf: 'flex-end', position: 'absolute', top: '30%', right: '2%' }} name={'star'} color={'gold'} size={30} />
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
          reduxSaveReorder(data);
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

const mapStateToProps = (state) => {
  return {
    tasks: state.tasksData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reduxSaveReorder: (newArray) => {
      dispatch(saveTasksData(newArray));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlatList);
