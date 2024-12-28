import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './slice'

export default configureStore({
    reducer: {
        jsonReducer: counterSlice,

    },
})