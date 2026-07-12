import {configureStore} from '@reduxjs/toolkit'
import counterReducer from '../features/counterSlice'
import todoReducer  from '../features/todoSlice'
import authReducer from '../features/authSlice'

export const store = configureStore({
    reducer:{
        counter: counterReducer,
        todos: todoReducer,
        auth: authReducer
    }
})
// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;