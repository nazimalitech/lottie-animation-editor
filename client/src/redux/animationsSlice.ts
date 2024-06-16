import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnimationState {
  animations: any[];
  selectedAnimation: any | null;
}

const initialState: AnimationState = {
  animations: [],
  selectedAnimation: null,
};

const animationsSlice = createSlice({
  name: 'animations',
  initialState,
  reducers: {
    setAnimations: (state, action: PayloadAction<any[]>) => {
      state.animations = action.payload;
    },
    setSelectedAnimation: (state, action: PayloadAction<any>) => {
      state.selectedAnimation = action.payload;
    },
    updateAnimation: (state, action: PayloadAction<any>) => {
      const index = state.animations.findIndex(anim => anim.id === action.payload.id);
      if (index !== -1) {
        state.animations[index] = action.payload;
      }
    },
  },
});

export const { setAnimations, setSelectedAnimation, updateAnimation } = animationsSlice.actions;
export default animationsSlice.reducer;
