import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducers/deviceTokenReducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
    'deviceTokenReducer'
    ],
    blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(
        createLogger(),
    ),
);

let persistor = persistStore(store);

export {
    store,
    persistor,
};