import { configureStore } from '@reduxjs/toolkit';
import animationsReducer from './animationsSlice';
import layersReducer from './layersSlice';
import userReducer from './userSlice';
import collaborationReducer from './collaborationSlice';
import animationReducer from './slices/animationSlice';

const store = configureStore({
  reducer: {
    animations: animationsReducer,
    layers: layersReducer,
    user: userReducer,
    collaboration: collaborationReducer,
    animation: animationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
