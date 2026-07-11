import { useMemo, useState } from "react";

const ProductList = () => {
    const products = [
        { id: 1, name: "Laptop", price: 1200 },
        { id: 2, name: "Phone", price: 700 },
        { id: 3, name: "Mouse", price: 30 },
        { id: 4, name: "Keyboard", price: 60 },
        { id: 5, name: "Monitor", price: 300 },
        { id: 6, name: "Speaker", price: 90 },
    ];
    const [search, setSearch] = useState('');
    const [theme, setTheme] = useState("light");
    // filtering k leye use memo use kar lo ta k bar bar ye filtering wala function na chale
    // jab dependency change ho tab hi chale
    // or tab tk ye memoized value return kare
    const filterProduct = useMemo(() => {
        console.log("filtering products ..")
        return products.filter((prod) => prod.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))

    }, [search])
    // ab bhale hi jitni bar ye theme change ho par jab tk search text nahi change ho ga tb tk filter products dobara nahi chale ga
    return (
        <div>
            <h2>Theme: {theme}</h2>
            <button onClick={() => setTheme(prev => prev == "light" ? "dark" : "light")}>

                Change theme
            </button>
            <input type="text" placeholder="Search Product" value={search} onChange={(e) => setSearch(e.target.value)} />
            <hr />
            {

                filteredProducts.map(product => (

                    <div key={product.id}>

                        <h3>{product.name}</h3>

                        <p>${product.price}</p>

                    </div>

                ))

            }

        </div>
    )
}

export default ProductList