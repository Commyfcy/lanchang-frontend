import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import orderReducer from '../slice/orderslice'; 
import existOrderReducer from '../slice/existorderslice'; 


const persistConfig = {
  key: 'root',
  storage,
};


const orderPersistConfig = {
  key: 'orders',
  storage,
};

const existOrderPersistConfig = {
  key: 'existorders',
  storage,
};


const persistedOrderReducer = persistReducer(orderPersistConfig, orderReducer);
const persistedExistOrderReducer = persistReducer(existOrderPersistConfig, existOrderReducer);


const rootReducer = combineReducers({
  orders: persistedOrderReducer,
  existorders: persistedExistOrderReducer,
});


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);