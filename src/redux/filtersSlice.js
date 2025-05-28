import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    name: '',
    mode: 'all',
  },
  reducers: {
    changeFilter(state, action) {
      state.name = action.payload;
    },
    changeFilterMode(state, action) {
      state.mode = action.payload;
    },
  },
});

export const { changeFilter, changeFilterMode } = filtersSlice.actions;
export default filtersSlice.reducer;
