import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  checkout: {
    activeStep: 0,
  },
};

const slice = createSlice({
  name: 'test',
  initialState,
  reducers: {    
    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.checkout.activeStep = step;
    },   
    resetWorkflow(state) {
      state.checkout.activeStep = 0;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  gotoStep,
  backStep,
  nextStep,
  resetWorkflow
} = slice.actions;

// ----------------------------------------------------------------------


