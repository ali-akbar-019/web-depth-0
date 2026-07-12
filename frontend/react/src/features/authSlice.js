import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import axios from 'axios'


export const login = createAsyncThunk(
    "auth/login",
    async({email, password})=>{
        const res = await axios.post("/api/login", {email, password})
        // local storage me store kar lo
        localStorage.setItem("token", res.data.token)
        return res.data.user;

    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async()=>{
        const token = localStorage.getItem("token");
        if(!token) throw new Error("No Token");
        const res = await axios.get("/api/logout",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    }
)


const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async()=>{
        const token = localStorage.getItem("token");
        if(!token) throw new Error("No Token");

        const res = await axios.get("/api/user", {
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data;
    }
)

const initialState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    isLoading: false,
    error: null

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        clearError: (state)=>{
            state.error = null
        },
        updateUser: (state, action)=>{
            // this will update the user
            state.user = {...state.user, ...action.payload}
        }
    }
    ,
    extraReducers: (builder)=>{
        builder.addCase(login.pending, (state)=>{
            state.isLoading =true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isAuthenticated = true;

            state.error = null;
            state.token = action.payload
        })
        .addCase(login.rejected, (state, action)=>{
           state.isLoading = false;
           state.error = action.error.message
        })
        .addCase(logout.fulfilled, (state, action)=>{
             state.user = null;
            state.isAuthenticated= false;
            state.error = null;
            state.token= null;
        })
        .addCase(fetchUser.pending, (state)=>{
            state.isLoading = true;
        
        }).addCase(fetchUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase(fetchUser.rejected, (state, action)=>{

            state.isLoading = false;
            state.error = action.error.message;
            state.isAuthenticated = false;
            state.user = null;
            state.token= null;
            localStorage.removeItem("token")
        })
    }
})

export const {clearError, updateUser} = authSlice.actions;

export default authSlice.reducer;

// selector
export const selectUser = (state)=>state.auth.user;
export const selectIsAuthenticated = (state)=>state.sath.isAuthenticated;
export const selectAuthError = (state)=>state.sath.error;
export const selectAuthLoading = (state)=>state.sath.isLoading;
