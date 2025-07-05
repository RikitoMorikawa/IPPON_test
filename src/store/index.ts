import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import membersReducer from './membersSlice';
import inquiryReducer from './inquirySlice';
import employeeReducer from './employeeSlice';
import clientReducer from './clientSlice';
import reportReducer from './reportSlice';
import propertiesReducer from './propertiesSlice';
import propertiesInquiriesReducer from './propertiesInquiriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    inquiry: inquiryReducer,
    employees: employeeReducer,
    reports: reportReducer,
    clients: clientReducer,
    properties: propertiesReducer,
    propertiesInquiries: propertiesInquiriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
