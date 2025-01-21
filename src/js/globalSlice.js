import {createSlice} from "@reduxjs/toolkit";

export const configSlice = createSlice({
    name: 'configReducer',
    initialState: {
        config: {},
    },
    reducers: {
        setConfig: (state, action) => {
            state.config = action.payload
        }
    }
})


export const {setConfig,} = configSlice.actions
export default configSlice.reducer