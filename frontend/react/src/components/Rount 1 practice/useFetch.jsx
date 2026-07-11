import { useEffect, useState } from "react"

const useFetch = ({ url }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {

            try {
                setLoading(true);
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                const result = await res.json();
                setData(result)
                setError(null)


            } catch (error) {
                setError(error.message)
                setData(null)

            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [url])
    return { data, loading, error }
}

export default useFetch