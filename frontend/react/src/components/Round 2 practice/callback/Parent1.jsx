import { useCallback, useState } from "react"
import Child1 from "./Child1";

const Parent1 = () => {
    const [theme, setTheme] = useState("light");
    const [count, setCount] = useState(0)

    // call back se ab bar bar new function nahi bane ga same rahe ga 
    const increment = useCallback(() => {
        setCount(prev => prev + 1);
    }, [])

    return (
        <div>
            <h2>
                Count: {count}

            </h2>
            <h3>
                Theme: {theme}
            </h3>
            <button onClick={() => setTheme(theme == "light" ? "dark" : "light")}>
                Change Theme
            </button>
            <Child1 onIncrement={increment} />
        </div>
    )
}

export default Parent1