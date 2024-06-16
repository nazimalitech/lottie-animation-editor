import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CollaborationState {
  collaborationState: any;
}

const initialState: CollaborationState = {
  collaborationState: {},
};

const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    setCollaborationState: (state, action: PayloadAction<any>) => {
      state.collaborationState = action.payload;
    },
    updateCollaborationState: (state, action: PayloadAction<any>) => {
      state.collaborationState = {
        ...state.collaborationState,
        ...action.payload,
      };
    },
  },
});

export const { setCollaborationState, updateCollaborationState } = collaborationSlice.actions;
export default collaborationSlice.reducer;
