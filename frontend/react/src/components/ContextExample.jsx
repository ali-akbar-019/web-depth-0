import { useContext, useState } from "react"

// 1 create the contexts
const ThemeContext = useContext();
const UserContext = useContext();
const AuthContext = useContext();

// provide component
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const toggleTheme = () => {
        setTheme(prev => prev == "light" ? "dark" : "light");
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

// custom hook for context
function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("Usertheme must be within theme provider")

    }
    return context;
}
// wrap the app with the theme provider

// auth provider


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const login = () => {
        setLoading(true);
        // login the user here
        setLoading(false);
        setUser({
            name: "ali"
        })
        // set the token u can store in the local storage or the cookie in the backend
    }

    const logout = () => {
        setUser(null)
        setLoading(false)
        setError(null)

    }
    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("Context not found")

    }
    return context;

}
export default ContextExample