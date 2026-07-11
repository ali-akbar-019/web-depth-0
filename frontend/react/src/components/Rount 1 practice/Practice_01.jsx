import React from 'react';

const Practice_01 = () => {
    // simple component
    function Welcome() {
        return <>
            Hello world
        </>
    }
    // with props
    function Greeting1(prop) {
        return <>
            Hello {prop.name}
        </>
    }
    // arrow function
    const Greeting2 = (props) => {
        return <h1>
            Hello {props.name}
        </h1>
    }
    const Greeting = ({ name, age }) => {
        return <>
            Hello {name}
            <p>
                Age : {age}
            </p>

        </>
    }
    const user = {
        name: "ali akbar",
        age: 22,
        email: "gamesforever018@gmail.com"
    }
    const UserProfile = ({ name, age, email }) => {
        return <>
            <p>
                Name: {name}
            </p>
            <p>
                Age: {age}
            </p>
            <p>
                Email: {email}
            </p>

        </>
    }
    return (
        <>
            <h1>
                Hello World from react
            </h1>
            <img src="" alt="" />
            <input type="text" />
            <select name="" id=""></select>
            <select name="" id="" disabled="disabled"></select>
            <Welcome />
            <Greeting name={"Ali AKbar"} age={22} />
            <UserProfile {...user} />
        </>
    )
}

export default Practice_01;