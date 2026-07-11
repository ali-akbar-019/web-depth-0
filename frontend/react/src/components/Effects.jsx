import { useEffect, useState } from "react"

const Effects = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0)

    useEffect(() => {
        console.log("Every render if i remove the dependency array")
    }, [])

    useEffect(() => {
        console.log("Mounted")
        return () => {
            console.log("unmounted")
        }
    }, [])

    useEffect(() => {
        console.log("count: ", count)

    }, [count])
    // its used for fetching the data also
    return (
        <div>Effects</div>
    )
}

export default Effects