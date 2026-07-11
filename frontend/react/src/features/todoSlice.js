import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'


// async api call 
export const fetchTodos = createAsyncThunk(
    "todos/fetchTodos",
    async ()=>{
        // axios me hame koi json me convert krne ki need nahi bas seda hamare pass data ajata ha .
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
        return res.data;
    }
)
// async thunk use karne se redux hamare leye ye fulfilled, pending and rejected action type create kr deta ha .
//jo k ham extrareducers me use kar sakte ha .

export const addTodoAsync = createAsyncThunk(
    "todos/addTodo",
    async (text)=>{
        const res = await axios.post('https://jsonplaceholder.typicode.com/todos',{
            title: text,
            completed: false,
            userId:1
        })
        return res.data;
    }
)

const initialState = {
    items: [],
    status: "idle",
    error: null,
    filter: "all"
}

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers:{

        addTodo:(state, action)=>{
            state.items.push({
                id: Date.now(),
                text: action.payload,
                completed: false
            })
        },
        removeTodo: (state, action)=>{
            const items = state.items.filter((item)=>item.id != action.payload)
            state.items = items;
        },
        toggleTodo: (state, action)=>{
            // find use karo  na k filter
            const todo = state.items.find((item)=>item.id == action.payload);
            // ider todo reference ha ye orignal todo ka state me to agar todo ko change karo ge then immer compare kare ga and ye state me b change kar de ga .. 
    
            todo.completed = !todo.completed
          
        },
        clearCompleted: (state)=>{
            state.items = state.items.filter(item=>!item.completed);

        }
        ,
        setFilter :(state, action)=>{
            state.filter = action.payload;
        }
    },
    extraReducers: (builder)=>{
        //ye wo async thunk wale ha 
        builder.addCase(fetchTodos.pending, (state)=>{
            state.status = "loading";
        })
        .addCase(fetchTodos.fulfilled, (state, action)=>{
            state.status = "success";
            state.items = action.payload.map((todo)=>({
                id: todo.id,
                text: todo.title,
                completed: todo.completed
            }))
        })
        .addCase(fetchTodos.rejected, (state,action)=>{
            state.status = "failed";
            state.error = action.error.message
        })
        .addCase(addTodoAsync.fulfilled, (state, action)=>{
            state.items.push({
                id: action.payload.id,
                text: action.payload.title,
                completed: action.payload.completed
            })
        })
    }
})

export const {addTodo, removeTodo, toggleTodo, clearCompleted, setFilter} = todoSlice.actions

export default todoSlice.reducer

// selectors

export const selectAllTodos = (state)=> state.todos.items;
export const selectFilter= (state)=>state.todos.filter;
export const selectTodoStatus= (state)=>state.todos.status;
export const selectTodoError = (state)=> state.todos.error;


export const selectFilteredTodos = (state)=>{
    const todos = selectAllTodos(state);
    const filter = selectFilter(state)

    switch(filter){
        case "active":
            return todos.filter((todo)=>!todo.completed)
        case "completed":
            return todos.filter((todo)=> todo.completed)
        default:
            return todos;
    }
}

export const selectStats = (state)=>{
    const todos = selectAllTodos(state);
    return {
        total: todos.lenght,
        completed: todos.filter(todo=>todo.completed).length,
        active: todos.filter(todo=>!todo.completed).length
    }
}