import React, { useRef } from 'react'

const UncontrolledFormRef = () => {
    const nameRef = useRef(null);
    const emailRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Name: ", nameRef.current.value);
        console.log("Email: ", emailRef.current.value)

    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Enter your name' ref={nameRef} />
            <input type="email" placeholder='Enter your email' ref={emailRef} />
            <button>Submit</button>

        </form>

    )

}


export default UncontrolledFormRef;