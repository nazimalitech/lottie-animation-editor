import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnimationState {
  speed: number;
  scale: number;
  color: string;
}

const initialState: AnimationState = {
  speed: 1,
  scale: 1,
  color: '#000000',
};

const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
  },
});

export const { setSpeed, setScale, setColor } = animationSlice.actions;

export default animationSlice.reducer;
