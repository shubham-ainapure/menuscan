import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import dbSlice from "./dbSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Persist configurations for auth and db slices
const authPersistConfig = {
  key: 'auth',
  storage,
};

const dbPersistConfig = {
  key: 'db',
  storage,
};

// Combining reducers and applying persist configurations
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  db: persistReducer(dbPersistConfig, dbSlice),
});

// Configuring store with combined reducer and middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Creating persistor
const persistor = persistStore(store);

export { store, persistor };
