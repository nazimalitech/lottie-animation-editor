import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnimationState {
  speed: number;
  scale: number;
  color: string;
  animationData: any;
}

const initialState: AnimationState = {
  speed: 1,
  scale: 1,
  color: '#000000',
  animationData: null,
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
    setAnimationData: (state, action: PayloadAction<any>) => {
      state.animationData = action.payload;
    },
  },
});

export const { setSpeed, setScale, setColor, setAnimationData } = animationSlice.actions;

export default animationSlice.reducer;
