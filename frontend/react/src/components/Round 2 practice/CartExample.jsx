import { useReducer } from "react"
import { ACTION_TYPES, cartReducer, initialCartState } from "../../reducers/cartReducer"

const CartExample = () => {
    const [state, dispatch] = useReducer(cartReducer, initialCartState);

    const addToCart = () => {
        let newItem = {
            id: Date.now(),
            price: 12,
            description: "example text...."
        }
        dispatch({ type: ACTION_TYPES.ADD_PRODUCT, payload: newItem })

    }
    const removeFromCart = (id) => {
        dispatch({ type: ACTION_TYPES.REMOVE_PRODUCT, payload: id })
    }
    const emptyCart = () => {
        dispatch({ type: ACTION_TYPES.CLEAR_CART })
    }
    return (
        <div>CartExample</div>
    )
}

export default CartExample