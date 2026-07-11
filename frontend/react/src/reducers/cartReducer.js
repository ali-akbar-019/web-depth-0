export const initialCartState = {
    cart:[],
    totalItems: 0
}

export const ACTION_TYPES = {
    ADD_PRODUCT: "ADD_PRODUCT",
    REMOVE_PRODUCT: "REMOVE_PRODUCT",
    CLEAR_CART: "CLEAR_CART"

}
export const cartReducer = (state, action)=>{
    
    switch(action.type){
        case ACTION_TYPES.ADD_PRODUCT:
            return {
                ...state,
                cart: [...state.cart, action.payload],
                totalItems: state.totalItems + 1
            }
        case ACTION_TYPES.REMOVE_PRODUCT:
            const updated = state.cart.filter(prod=>prod.id !== action.payload)
            return {
                ...state,
                cart: updated,
                totalItems: updated.length
            }
        case ACTION_TYPES.CLEAR_CART:
            return{
                ...state,
                cart: [],
                totalItems: 0
            }

        default:
            return state
    }

}