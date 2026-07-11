import React, { useState } from 'react'

const ConditionalRendering = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("guest");

    //using the if else 
    if (isLoggedIn) {
        return <div>
            Welcome Back
        </div>
    } else {
        return <div>
            Please Login
        </div>
    }
    // using the ternary 
    return (
        <div>
            {
                isLoggedIn ? <div>Welcome back</div> : <div>
                    Please login first
                </div>
            }
        </div>
    )

    // using the && operator
    return (
        <div>


            {
                isLoggedIn && <div> Welcome back</div>
            }
            {
                !isLoggedIn && <div> Please login first</div>
            }
        </div>
    )

    const getRoleContent = () => {
        switch (userRole) {
            case "admin":
                return <div>Admin Pannel</div>
                break;
            case "user":
                return <div>User Dashboard</div>
                break;
            default:
                return <div>Guest View</div>
        }
    }

    return (
        <div>
            {getRoleContent()}
        </div>
    )

}
export default ConditionalRendering;