import { useCallback, useState } from "react"

const Parent2 = () => {
    const [count, setCount] = useState(0);
    const [name, setName] = useState("ali")

    const incrementCount = useCallback(() => {
        setCount(prev => prev + 1)
    }, [])

    return (
        <div>

            Count: {count}
            Name: {name}

            <button onClick={() => setName("ahmad")}>
                Change Name
            </button>

        </div>
    )
}

export default Parent2