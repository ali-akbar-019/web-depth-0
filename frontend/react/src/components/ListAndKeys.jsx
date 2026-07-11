import React, { useState } from 'react'

const ListAndKeys = () => {
    const users = [
        {
            id: 1, name: "ali", age: 25
        },
        {
            id: 2, name: "ali 2", age: 28
        },
        {
            id: 3, name: "ali 3", age: 26
        },
    ]

    const fruits = ["Apple", "Banana", "Orange"]
    // 1 map through array
    return (
        <div>
            {
                users.map((user, index) =>
                    <div>

                        <p>
                            Name:  {user.name}
                        </p>
                        <p>
                            Age: {user.age}
                        </p>

                    </div>
                )
            }
            {
                fruits.map((fruit, index) =>
                    <div>

                        <p>
                            {fruit}
                        </p>
                    </div>
                )
            }
        </div>
    )
}

const FilteredList = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const users = [
        {
            id: 1, name: "ali", age: 25
        },
        {
            id: 2, name: "ali 2", age: 28
        },
        {
            id: 3, name: "ali 3", age: 26
        },
    ]

    const filteredUsers = users.find((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // key in map hamesha unique honi chahie
}
export default ListAndKeys;