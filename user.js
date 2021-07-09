import { Input,Button } from '@material-ui/core'
import React,{useState} from 'react'
import './App.css'
import { users } from './data'

import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router';
import { fire } from './config';
function User() {
    const history=useHistory()
    const [state, setstate] = useState('')
    const [amount, setamount] = useState('')
    const [success,set]=useState(false)
    let handle=()=>{
        if(state && amount){
        fire.firestore().collection('banking').doc('users').collection('users').doc(state).set({
            name:state,
            amount:amount
        })
        
        set(true)
        setTimeout(()=>{
            set(false)
        history.push('/')
        },2000)
    }
    }
    return (
        <div className='user-div'>
        <div className='users'>
            {success && <h2>Created successfully!!!</h2>}
            <h2>Create a user<EditIcon/></h2>
            <Input placeholder='Enter name' value={state} onChange={(e)=>setstate(e.target.value)} />
            <Input placeholder='Enter amount'  value={amount} onChange={(e)=>setamount(e.target.value)}/>
            <Button onClick={handle}>Create</Button>
        </div>
        </div>
    )
}

export default User
