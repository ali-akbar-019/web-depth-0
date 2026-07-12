import { useInfiniteQuery, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useState } from "react";


// api function
async function fetchUsers() {
    const res = await fetch('https://api.example.com/users')
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json();
}

function UserList() {
    const { data, error, isPending, refetch, isError } = useQuery({
        queryKey: ["users"], //unique key - cache identity
        queryFn: fetchUsers, //api call function
        staleTime: 60_000, //1 min fresh
        gcTime: 10 * 60_000, //10 min cache
        refetchOnWindowFocus: false //window focus par refetch nahi
    })
    if (isPending) {
        return <div> loading...</div>
    }
    if (isError) {
        return <div>Error: {error.message}</div>

    }
    return (
        <div>
            <button onClick={() => refetch()}>Refresh</button>
            {data.map((user: any) => (
                <div key={user.id} >{user.name}</div>
            ))}
        </div>
    )
}


// dyanamic query keys
function UserProfile({ userId }: { userId: number }) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['user', userId], //different cache
        queryFn: async () => {
            const res = await fetch('/api/users/' + userId)
            return await res.json();
        },
        enabled: !!userId, //only run when the id exists
    })
    if (isPending) return <div>Loading ...</div>
    // jab name ho ga tabhi dikaye ga else nahi
    return <div>{data?.name}</div>
}


// conditional fetching
function UserProfile1({ userId, isLoggedIn }: { userId: number, isLoggedIn: boolean }) {
    const { data, isPending, isError } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUsers(), //with id 
        enabled: isLoggedIn && !!userId, //sirf logged in and userid ho to hio fetch karo profile else nahi
    })
    if (isError) {
        return <div> Error loading the profile </div>
    }
    return <div> {data?.name}</div>
}



// select data transformation
function UserList1() {
    const { data, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        select: (data) => data.map((user: any) => ({
            ...user,
            fullName: `${user?.firstName} ${user?.lastName}`
        }))
    })
    // ab user ki apni fields k sath sath aik new field full name naam se b ban jaye gi
    return { data, isError }
}

// typescript with usequery
interface User {
    id: number;
    name: string;
    email: string;
}

function UserList2() {
    const { data, refetch, isError, isPending } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: fetchUsers,
        refetchOnWindowFocus: false,
        select: (data) => data?.map((user) => ({
            ...user,
            NameWithId: user?.id + " " + user?.name
        }))

    })
    // yaha se fir return kar do
}

const addUser = async (newUser: { name: string; email: string }) => {
    const res = await fetch('/api/user', {
        method: "POST",
        headers: {
            "content-type": "application/json",

        },
        credentials: "include",
        body: JSON.stringify(newUser)
    })
    return await res.json();
}
// use mutation - data write
function AddUser() {
    const queryClient = useQueryClient();
    const [name, setName] = useState('')
    const { mutate, isPending, isError } = useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setName('')
        },
        onError: () => {
            console.log("Something went wrong while adding the user.")
        }
    })

}

// optimistic updates v 5 pattern
function DeleteUser({ userId }: { userId: number }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () => fetch(`/api/users/${userId}`, { method: "DELETE" }),
        onMutate: async () => {
            // cancel in flighjt queries
            await queryClient.cancelQueries({ queryKey: ['users'] })
            //snapshot previous data
            const previousUsers = queryClient.getQueryData(['users'])
            //optimistacally update cache
            queryClient.setQueryData(['users'], (old: User[] = []) =>
                old.filter(user => user.id !== userId)
            )
            return { previousUsers } //rollback k leye
        },
        onError: (error, variables, context) => {
            // rollback on error
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers)
            }
        },
        onSettled: () => {
            // always refetch after settle
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

// use infinite query - pagination

async function fetchPosts({ pageParam = 1 }) {
    const res = await fetch(`/api/posts?page=${pageParam}&limit=10`)
    const data = await res.json()
    return {
        posts: data.posts,
        nextPage: data.hasMore ? pageParam + 1 : undefined
    }
}

function PostsList() {
    const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        maxPages: 5, //v5 only keep 5 pages in memory , citation:1
    })
    if (isPending) return <div> loading ...</div>
    if (isError) return <div> Error: {error.message}</div>
    return (

        <div>
            {data.pages.map((page, i) => (
                <div key={i}>
                    {page.posts.map((post: any) => (
                        <div key={post.id}>{post?.title} </div>
                    ))}

                </div>
            ))}
            <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                {isFetchingNextPage ? "loading more.. " : "load More"}

            </button>
        </div>
    )
}


// query client method
const queryClient = useQueryClient();

// sab users queries invalidate karo
queryClient.invalidateQueries({ queryKey: ['users'] })

// specific user invalidate 
queryClient.invalidateQueries({ queryKey: ['user', 1] })

// prefix match
queryClient.invalidateQueries({ queryKey: ['users'] })

// set query data
queryClient.setQueriesData([`users`], (old: User[] = []) => [
    ...old,
    { id: 1, name: 'New users' }
])

// get query data
// v5 sirf querykey leta ha filter nahi
const users = queryClient.getQueryData(['users'])

// prefetch query
// bg mei data fetch karo (page load se pehle)

await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
})


// use suspence query
function Userlist4() {
    //data kabi undefiend nahi hota suspense handles loading
    const { data } = useSuspenseQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,

    });
    return data.map((user: any) => <div>{user.name}</div>)
}

function App() {
    // data load ho raha ho to automatically loading dika do
    // important: useSuspenseQuery mein data never undefined hota - TypeScript inference better hoti hai .
    return (
        <Suspense fallback={<div> loading...</div>}>
            <UserList />

        </Suspense>
    )
}

// refer to the documentation before starting working with the tanstack react query