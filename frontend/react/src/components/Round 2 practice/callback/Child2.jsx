import React from 'react'

const Child2 = ({ increment }) => {
    console.log("Child rendered")
    return (
        <div>Child2

            <div>
                <button onClick={increment}>
                    Increase Count

                </button>
            </div>

        </div>


    )
}

export default React.memo(Child2)