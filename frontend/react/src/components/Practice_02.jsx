import React, { useState } from 'react'

const Practice_02 = () => {
    const [count, setCount] = useState(0);
    const [user, setUser] = useState({
        name: "Ali",
        age: 22
    })
    const [name, setName] = useState("Zarak")


    const increment = () => {
        setCount(prev => prev + 1);
    }
    const updateName = () => {
        setName("Ahmad")
    }
    // update age

    const updateAge = () => {
        setUser((prev) => {
            return {
                ...prev,
                age: 23
            }
        })
    }

    return (
        <>


        </>
    )

}

export default Practice_02;