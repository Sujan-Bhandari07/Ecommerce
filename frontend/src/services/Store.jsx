import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './Userslice';
import cartReducer from './Cartslice';
import { productApi } from './Productapi';
import { userApi } from './Userapi';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const migrations = {
  1: (state) => ({
    ...state,
    user: {
      ...state.user,
      category: Array.isArray(state.user?.category) ? state.user.category : [],
      subcategory: Array.isArray(state.user?.subcategory) ? state.user.subcategory : [],
    },
  }),
  2: (state) => ({
    ...state,
    user: {
      ...state.user,
      related: state.user?.related ?? { cat: "", subcat: "" },
    },
  }),
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'cart'],
  version: 2, // bumped from 1
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  [productApi.reducerPath]: productApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(productApi.middleware, userApi.middleware),
});

export const persistor = persistStore(store);