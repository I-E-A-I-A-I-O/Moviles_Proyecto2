import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import userPages from './userPages';
import createTaskModal from './createTaskModal';

const Stack = createStackNavigator();

function ModalsStack() {
    return(
        <Stack.Navigator mode={'modal'} >
            <Stack.Screen name={'userPages'} component={userPages} 
                options={{headerShown: false}}
            />
            <Stack.Screen name={'createTask'} component={createTaskModal} 
                options={{title: 'Create a new task'}}
            />
        </Stack.Navigator>
    );
}

export default ModalsStack;