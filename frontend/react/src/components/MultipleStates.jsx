import React, { useState } from 'react'

const MulitpleStates = () => {
    const [name, setName] = useState("Ali");
    const [age, setAge] = useState(22);
    const [password, setPassword] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    // or u could just use this
    const [formD, setFormD] = useState({
        name: "",
        age: null,
        password: "",
        errors: {},
        loading: false,
        email: ""
    })


    // handle change 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormD((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    console.log(formD)
    return (
        <div>
            <form action="">
                <input type="text" placeholder='Enter your name' value={formD.name} onChange={handleChange} name='name' />
                <input type="email" placeholder='Enter your email' email={formD.email} onChange={handleChange} name='email' />
                <input type="number" placeholder='Enter your age' value={formD.age} onChange={handleChange} name='age' />
                <input type="password" placeholder='Enter your password' value={formD.password} onChange={handleChange} name='password' />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default MulitpleStates;