import { useDispatch, useSelector } from "react-redux";

import {
    addToCart,
    removeFromCart,
    updateProduct,
    reset,
    selectItems,
    selectCount
} from "./cartSlice";

const Cart = () => {

    const dispatch = useDispatch();

    const items = useSelector(selectItems);
    const count = useSelector(selectCount);

    const handleAddToCart = () => {
        const newItem = {
            id: Date.now(),
            name: "Product 1",
            description: "Lorem ipsum",
            price: 20
        };

        dispatch(addToCart(newItem));
    };

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleUpdateProduct = () => {

        if (items.length === 0) return;

        const updatedItem = {
            id: items[0].id,
            name: "Updated Product",
            description: "Updated Description",
            price: 40
        };

        dispatch(updateProduct(updatedItem));
    };

    const handleResetCart = () => {
        dispatch(reset());
    };

    return (
        <div>

            <h2>Total Items: {count}</h2>

            <button onClick={handleAddToCart}>
                Add Product
            </button>

            <button
                onClick={() =>
                    items.length > 0 &&
                    handleRemoveFromCart(items[0].id)
                }
            >
                Remove First Product
            </button>

            <button onClick={handleUpdateProduct}>
                Update First Product
            </button>

            <button onClick={handleResetCart}>
                Reset Cart
            </button>

            <hr />

            {items.map((item) => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>${item.price}</p>
                </div>
            ))}

        </div>
    );
};

export default Cart;