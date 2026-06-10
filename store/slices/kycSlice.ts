import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface KycState {
  legalName: string;
  country: string;
  documentType: string;
  documentNumber: string;
  selfieImageUrl: string;
  documentImageUrl: string;
}

const initialState: KycState = {
  legalName: "",
  country: "Nigeria",
  documentType: "",
  documentNumber: "",
  selfieImageUrl: "",
  documentImageUrl: "",
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setKycDetails: (
      state,
      action: PayloadAction<{
        legalName: string;
        country: string;
        documentType: string;
        documentNumber: string;
      }>,
    ) => {
      state.legalName = action.payload.legalName;
      state.country = action.payload.country;
      state.documentType = action.payload.documentType;
      state.documentNumber = action.payload.documentNumber;
    },
    setDocumentImageUrl: (state, action: PayloadAction<string>) => {
      state.documentImageUrl = action.payload;
    },
    setSelfieImageUrl: (state, action: PayloadAction<string>) => {
      state.selfieImageUrl = action.payload;
    },
    resetKyc: (state) => {
      state.legalName = "";
      state.country = "";
      state.documentType = "";
      state.documentNumber = "";
      state.selfieImageUrl = "";
      state.documentImageUrl = "";
    },
  },
});

export const {
  setKycDetails,
  setDocumentImageUrl,
  setSelfieImageUrl,
  resetKyc,
} = kycSlice.actions;
export default kycSlice.reducer;
