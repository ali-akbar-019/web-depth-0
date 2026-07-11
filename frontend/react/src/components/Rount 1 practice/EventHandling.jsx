import React from 'react'

const EventHandling = () => {

    const handleClick = () => {
        console.log("Clicked")
    }
    const handleMouseEnter = () => {
        console.log("Mouse entered")
    }
    const handleMouseLeft = () => {
        console.log("Mouse Left")
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted")

    }
    const handleKeyDown = (e) => {
        console.log(e.key + "pressed");
    }
    return (
        <div>
            <button onClick={handleClick}>CLick me </button>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeft}>
                this is me a div for the mouse events
            </div>
            <form action="">
                <input type="text" placeholder='Enter your name' />
                <button>Submit</button>
            </form>
            <input type="text" onKeyDown={handleKeyDown} />
        </div>
    )


}

export default EventHandling;