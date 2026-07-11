
import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment, incrementByAmount, reset, selectCount } from './counterSlice'
import { useState } from 'react';
const Counter = () => {
    const count = useSelector(selectCount);

    const dispath = useDispatch();
    const [amount, setAmount] = useState(0);
    return (
        <div>

            <h2>
                Counter: {count}
            </h2>
            <div className='buttons'>
                <button onClick={() => dispath(increment())}>
                    Increment

                </button>
                <button onClick={() => dispath(decrement())}>
                    Decrement
                </button>
                <button onClick={() => dispath(reset())}>
                    Reset
                </button>

            </div>
            <div>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <button onClick={() => dispath(incrementByAmount(parseInt(amount)))}>
                    Add Amount

                </button>
            </div>
        </div>
    )
}

export default Counter