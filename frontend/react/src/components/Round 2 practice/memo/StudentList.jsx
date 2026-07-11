import { useMemo, useState } from "react"

const StudentList = () => {
    const [theme, setTheme] = useState("light")
    const [search, setSearch] = useState("")

    const students = [
        { id: 1, name: "Ali", cgpa: 3.8 },
        { id: 2, name: "Ahmed", cgpa: 3.2 }
    ]

    const filteredStudents = useMemo(() => {
        console.log("filtering products")
        return students.filter((std) => std.name.toLowerCase().includes(search.toLowerCase()))
    }, [search])
    return (
        <div>

            <h2>Theme: {theme}</h2>
            <button onClick={() => setTheme(prev => prev == "light" ? "dark" : "light")}>
                Change theme
            </button>
            <input type="text" placeholder="Search something" onChange={(e) => setSearch(e.target.value)} value={search} />
            {
                filteredStudents.map((std) => (
                    <div key={std.id}>
                        <p>Name: {std.name}</p>
                        <p>
                            CGPA: {std.cgpa}
                        </p>

                    </div>
                ))
            }
        </div>
    )
}

export default StudentList