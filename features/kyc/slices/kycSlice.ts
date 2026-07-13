import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface KycState {
  legalName: string;
  country: string;
  documentType: string;
  documentNumber: string;
  selfieImageUrl: string;
  documentImageUrl: string;
  documentBackImageUrl: string;
}

const initialState: KycState = {
  legalName: "",
  country: "Nigeria",
  documentType: "",
  documentNumber: "",
  selfieImageUrl: "",
  documentImageUrl: "",
  documentBackImageUrl: "",
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
    setDocumentBackImageUrl: (state, action: PayloadAction<string>) => {
      state.documentBackImageUrl = action.payload;
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
      state.documentBackImageUrl = "";
    },
  },
});

export const {
  setKycDetails,
  setDocumentImageUrl,
  setDocumentBackImageUrl,
  setSelfieImageUrl,
  resetKyc,
} = kycSlice.actions;
export default kycSlice.reducer;
