import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    count: 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.items.push(action.payload);
            state.count++;
        },

        removeFromCart: (state, action) => {
            const updatedProducts = state.items.filter(
                (item) => item.id !== action.payload
            );

            state.items = updatedProducts;
            state.count = updatedProducts.length;
        },

        updateProduct: (state, action) => {
            const prod = state.items.find(
                (item) => item.id === action.payload.id
            );

            if (prod) {
                prod.name = action.payload.name;
                prod.description = action.payload.description;
                prod.price = action.payload.price;
            }
        },

        reset: (state) => {
            state.items = [];
            state.count = 0;
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    updateProduct,
    reset
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectItems = (state) => state.cart.items;
export const selectCount = (state) => state.cart.count;