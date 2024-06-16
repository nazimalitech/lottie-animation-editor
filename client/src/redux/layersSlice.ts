import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayerState {
  layers: any[];
  selectedLayer: any | null;
}

const initialState: LayerState = {
  layers: [],
  selectedLayer: null,
};

const layersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    setLayers: (state, action: PayloadAction<any[]>) => {
      state.layers = action.payload;
    },
    setSelectedLayer: (state, action: PayloadAction<any>) => {
      state.selectedLayer = action.payload;
    },
    updateLayer: (state, action: PayloadAction<any>) => {
      const index = state.layers.findIndex(layer => layer.id === action.payload.id);
      if (index !== -1) {
        state.layers[index] = action.payload;
      }
    },
  },
});

export const { setLayers, setSelectedLayer, updateLayer } = layersSlice.actions;
export default layersSlice.reducer;
