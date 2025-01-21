import {configureStore} from '@reduxjs/toolkit'
import counterSlice from './slice'
import configSlice from "./globalSlice";

export default configureStore({
    reducer: {
        jsonReducer: counterSlice,
        configReducer: configSlice
    },
})