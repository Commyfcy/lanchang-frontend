import { createSlice } from '@reduxjs/toolkit';

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    selectedTable: null, 
  },
  reducers: {
    setSelectedTable: (state, action) => {
      state.selectedTable = action.payload;
    },
  },
});

export const { setSelectedTable } = tableSlice.actions;
export default tableSlice.reducer;
