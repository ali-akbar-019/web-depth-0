import React from 'react'
import { Outlet, Route, useLocation, useNavigate, useParams } from 'react-router-dom'

const DynamicRoute = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const handleGoBack = () => {
        navigate(-1);
        // navigate('/about', { state: { from: 'user' } }); // With state
    }
    return (<>
    </>)
}


function Dashboard() {
    return (
        <div>
            <h1>
                Dashboard

            </h1>
            <Outlet /> {/*child routes render here */}
        </div>
    )

}

<Route path='/dashboard' element={<Dashboard />} >
    <Route path='profile' element={<>this is the profile of the dashborad</>} />
    <Route path='settings' element={<>this is the settings of the dashboard</>} />
</Route>

