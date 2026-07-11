import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import React from 'react'

const RoutingExample = () => {

    return (
        <BrowserRouter>
            <nav>
                <Link to={"/"}>
                    Home
                </Link>
                <Link to={"/about"}>
                    About
                </Link>
                <Link to={"/contact"}>
                    Contact
                </Link>
            </nav>
            <Routes>
                <Route path='/' element={<>This is home</>} />
                <Route path='/about' element={<>This is about</>} />
                <Route path='/contact' element={<>This is contact</>} />

            </Routes>
        </BrowserRouter>
    )

}
export default RoutingExample;