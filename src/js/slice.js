import {createSlice} from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'jsonReducer',
    initialState: {
        taVal: JSON.stringify({
            "type": "FeatureCollection",
            "features": []
        }),
        pageback: {
            content: JSON.stringify({
                "type": "FeatureCollection",
                "features": []
            }), fn: ""
        }
    },
    reducers: {
        setgeoValue: (state, action) => {
            state.taVal = (typeof action.payload == "string") ? action.payload : JSON.stringify(action.payload)
        },
        updateMianValue: (state, action) => {
            state.pageback.content = action.payload;
        },
        updateMianfn: (state, action) => {
            state.pageback.fn = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const {setgeoValue, updateMianValue, updateMianfn} = counterSlice.actions

export default counterSlice.reducer