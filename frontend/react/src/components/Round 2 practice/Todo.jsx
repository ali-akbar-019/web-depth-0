import { useReducer } from "react"
import { initialState, todoReducer } from "../../reducers/todoReducer";

const Todo = () => {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    const addTodo = () => {
        let newTodo = {
            id: Date.now(),
            text: "This is a new Todo",
            completed: false
        }
        dispatch({ type: "ADD_TODO", payload: newTodo })
    }

    const deleteTodo = (id) => {
        dispatch({ type: "DELETE_TODO", payload: id })

    }

    const clearTodo = () => {
        dispatch({
            type: "CLEAR_TODOS"
        })
    }
    const toggleTodo = (id) => {
        dispatch({ type: "TOGGLE_TODO", payload: id })
    }
    return (
        <div>Todo</div>
    )
}

export default Todo