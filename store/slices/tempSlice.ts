import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface TempState {
  recoveryCodes: string[] | null;
}

const initialState: TempState = {
  recoveryCodes: null,
};

const tempSlice = createSlice({
  name: "temp",
  initialState,
  reducers: {
    setRecoveryCodes: (state, action: PayloadAction<string[]>) => {
      state.recoveryCodes = action.payload;
    },
    clearRecoveryCodes: (state) => {
      state.recoveryCodes = null;
    },
  },
});

export const { setRecoveryCodes, clearRecoveryCodes } = tempSlice.actions;
export default tempSlice.reducer;
