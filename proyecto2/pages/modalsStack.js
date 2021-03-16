import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserPages from './userPages';
import CreateTaskModal from './createTaskModal';
import TaskDetails from './taskDetails';
import EditTask from './editTask';

const Stack = createStackNavigator();

function ModalsStack() {
    return (
        <Stack.Navigator mode={'modal'} >
            <Stack.Screen
                name={'userPages'}
                component={UserPages}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'createTask'}
                component={CreateTaskModal}
                options={{ title: 'Create a new task' }}
            />
            <Stack.Screen
                name={'taskDetails'}
                component={TaskDetails}
                options={{ title: '' }}
            />
            <Stack.Screen
                name={'editTask'}
                component={EditTask}
                options={{title: 'Edit task'}}
            />
        </Stack.Navigator>
    );
}

export default ModalsStack;