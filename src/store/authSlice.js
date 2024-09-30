import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'auth',
    initialState:{
        userdata:null
    },
    reducers:{
        login:(state,action)=>{
            state.userdata=action.payload;
            console.log('reducer success',state.userdata);
        },
        logout:(state)=>{
            state.userdata=null;
        }
    }
})

export const {login,logout}=authSlice.actions;
export default authSlice.reducer;