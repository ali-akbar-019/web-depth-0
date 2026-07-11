import React from 'react'
const Child1 = ({ onIncrement }) => {
    console.log("Child rendered")

    return (
        <div>
            <h1>Child Component</h1>
            <button onClick={onIncrement}>
                Increment
            </button>
        </div>

    )
}

// ye compare karta ha states and us ki basis pe re render karta ha ya nahi
export default React.memo(Child1)