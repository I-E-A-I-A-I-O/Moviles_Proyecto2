import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { connect } from 'react-redux';
import IonIcons from 'react-native-vector-icons/FontAwesome5';
import RNToastMessage from 'react-native-toast-message';
import { Text } from 'react-native-elements';
import { saveTasksData } from '../actions/saveTasksData';
import { normalToPinned } from '../actions/normalToPinned';
import { pinnedToNormal } from '../actions/pinnedToNormal';
import { savePinnedTasks } from '../actions/savePinnedTasks';

import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

function FlatList({ pinned, tasks, reduxSavePinned, reduxSaveReorder, sessionToken, reduxToNormal, reduxToPinned, type = 'normal' }) {

  const saveChanges = (data) => {
    fetch('http://192.168.0.101:8000/tasks', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'authToken': sessionToken
      }
    }).then(response => response.json())
      .then(json => {
        RNToastMessage.show({ text1: json.content, autoHide: true, type: 'info', position: 'bottom' });
      })
  }

  const saveAlert = () => {
    RNToastMessage.show(
      {
        type: 'info',
        text1: 'Unsaved changes. Tap to save.',
        position: 'bottom',
        onPress: () => {
          alert(tasks)
          //saveChanges(data);
          RNToastMessage.hide();
        }
      }
    )
  }

  const pinChange = (taskId) => {
    if (type === 'normal') {
      reduxToPinned(taskId);
    }
    else {
      reduxToNormal(taskId);
    }
    saveAlert();
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
      data={type === 'normal' ? tasks : pinned}
      renderItem={renderItem}
      keyExtractor={(item, index) => `draggable-item-${item.task_id}`}
      onDragEnd={({ data, from, to }) => {
        if (from !== to) {
          moveIndexes(data);
          reduxSaveReorder(data);
          saveAlert();
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

export default connect(mapStateToProps, mapDispatchToProps)(FlatList);
