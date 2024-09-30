import { createSlice } from "@reduxjs/toolkit";

const dbSlice=createSlice({
    name:'db',
    initialState:{
        restaurant:null,
        category:null,
        dishesh:null,
    },
    reducers:{
        restaurantinfo:(state,action)=>{
            state.restaurant=action.payload;
            console.log('resturntinfo',state.restaurant);
        },
        categoryInfo:(state,action)=>{
            state.category=action.payload;
            console.log('categoryInfo',state.category);
        },
        dishInfo:(state,action)=>{
            state.dishesh=action.payload;
            console.log('dishInfo',state.dishesh);
        }
    }
})

export const {restaurantinfo,categoryInfo,dishInfo}=dbSlice.actions;
export default dbSlice.reducer;