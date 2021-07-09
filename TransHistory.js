import React,{useState,useEffect} from 'react'
import { fire } from './config'
import './App.css'
function TransHistory() {
    const [state,setstate]=useState([])
    useEffect(() => {
        fire.firestore().collection('banking').doc('transaction').collection('transaction').orderBy('timestamp','desc').onSnapshot((snap)=>{
        setstate(snap.docs.map(l=>l.data()))
        })
    }, [state])
    return (
        <div>
            <div className='trans'>
                <h2 className='trans-h2'>Transferred From</h2>
                <h2 className='trans-h2'>Transferred To</h2>
                <h2 className='trans-h2'>Date of Transaction</h2>
            </div>
            {state ? state.map((k)=>(
                <div key={k.id} className='trans'>
                    <h2>{k.producer}</h2>
                    <h2>{k.consumer}</h2>
                    <h2>{k.date}</h2>
                </div>
            )):<h1>No Transaction History</h1>}
        </div>
    )
}

export default TransHistory
