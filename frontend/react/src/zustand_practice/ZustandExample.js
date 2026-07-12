import {create} from 'zustand'

const useBearStore = create((set)=>({
    // state
    bears: 0,

    // actions set function state update karta ha 
    increasePopulation: ()=>set((state)=>({
        bears: state.bears+1
    }))
    ,
    removeAllBears: ()=>set((state)=>({
        bears: 0
        
    }))
    ,
    updateBears: (newBear)=>set((state)=>({
        bears: newBear
    }))
}))

// components me use karo
function BearCounter(){
    const bears = useBearStore((state)=>state.bears)
    return <h1>{bears} bears around here...</h1>
}

function Controls(){
    const increasePopulation = useBearStore((state)=>state.increasePopulation)
    return <button onClick={increasePopulation}>One Up</button>

}
