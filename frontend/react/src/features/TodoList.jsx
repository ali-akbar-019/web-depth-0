import { useDispatch, useSelector } from 'react-redux'
import { addTodo, clearCompleted, fetchTodos, removeTodo, selectFilter, selectFilteredTodos, selectStats, selectTodoError, setFilter, toggleTodo } from './todoSlice';
import { selectStatus } from './counterSlice';
import { useEffect, useState } from 'react';
const TodoList = () => {
    const dispatch = useDispatch();
    const todos = useSelector(selectFilteredTodos);
    const stats = useSelector(selectStats)
    const status = useSelector(selectStatus)
    const error = useSelector(selectTodoError)
    const filter = useSelector(selectFilter)
    const [input, setInput] = useState("");

    // 
    useEffect(() => {
        dispatch(fetchTodos())
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addTodo(input.trim()))
        setInput("")
    }
    if (status == "loading") {
        return <div>
            loading....
        </div>
    }
    if (status == "failed") {
        return <div>
            Something went wrong. Error: {error}
        </div>
    }

    return (
        <div>
            <h2>
                Todo List
            </h2>
            <div>
                <span>Total: {stats.total}</span>
                <span>Active: {stats.active}</span>
                <span>Completed: {stats.completed}</span>
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='Add a todo...'
                />
                <button type='submit'>Add todo</button>
            </form>
            {/* filters */}
            <div>
                <button onClick={() => dispatch(setFilter("all"))}>
                    All
                </button>


                <button onClick={() => dispatch(setFilter("active"))}>
                    Active
                </button>
                <button onClick={() => dispatch(setFilter("completed"))}>
                    Completed
                </button>
            </div>

            <ul>
                {todos.length === 0 ? (

                    <>
                        <li>No todos found</li>
                    </>

                ) : (
                    todos.map((todo) => (
                        <li>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => dispatch(toggleTodo(todo.id))}

                            />
                            <span className={todo.completed ? 'completed' : ''}>
                                {todo.text}
                            </span>
                            <button
                                onClick={() => dispatch(removeTodo(todo.id))}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* clear completed */}
            {stats.completed > 0 && (

                <button onClick={() => dispatch(clearCompleted())}>
                    Clear completed
                </button>
            )}
        </div>
    )
}

export default TodoList