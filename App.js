import React,{createContext,useEffect,useState} from 'react'
import { users } from './data'
import './App.css'
import firebase from 'firebase'
import { Button,Input} from '@material-ui/core'
import Modal from '@material-ui/core/Modal';
import {Link,BrowserRouter,Route} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import TransHistory from './TransHistory';
import User from './user';
import { fire } from './config';

function App() {
    
    return (
        <div id='app'>
            <BrowserRouter>
                <div className="nav">
                    <h1>Simple Banking System</h1>
                    <Link to='/'>Home</Link>
                    <Link to='/createuser'>Create a user</Link>
                    <Link to='/history'>Transaction History</Link>
                </div>
                <Route exact path='/createuser'>
                    <User/>
                </Route>
                <Route exact path='/history'>
                    <TransHistory/>
                </Route>
                <Route exact path='/'>
                    
                    <App_div/>
                </Route>
        
            </BrowserRouter>
        </div>
        
    )
}
export const trans=[]
let App_div=()=>{
    const [open, setopen] = useState(false)
    const [state, setstate] = useState([])
    const [consumer, setconsumer] = useState('')
    const [amount, setamount] = useState(0)
    const [amount1, setamount1] = useState(0)
    const [success, setsuccess] = useState(false)
    const [error, seterror] = useState(false)

    const [producer, setproducer] = useState('')
    function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    height:300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

useEffect(()=>{
    setTimeout(()=>{
    seterror(false)
    setsuccess(false)
    },2000)
},[error,success])

const handleTransfer=()=>{
    let check=state.filter(l=>l.name===producer)
    if(parseInt(check[0].amount)>=parseInt(amount) && consumer!==''){
    state.map((l)=>{
        if(l.name===consumer){
            setsuccess(true)
        }
        if(l.name===producer){
            return {...l,amount:l.amount-parseInt(amount)}
        }
    })
        
        console.log(amount1,amount1+parseInt(amount))
        fire.firestore().collection('banking').doc('users').collection('users').doc(consumer).update({
            
            amount:firebase.firestore.FieldValue.increment(amount)
        })
            fire.firestore().collection('banking').doc('users').collection('users').doc(producer).get().then(snap=>{
                console.log(snap.data().amount)
            })
            console.log('ppp')
        fire.firestore().collection('banking').doc('users').collection('users').doc(producer).update({
            amount:firebase.firestore.FieldValue.increment(-amount)
        })
        fire.firestore().collection('banking').doc('transaction').collection('transaction').add({
            producer:producer,
            consumer:consumer,
            amount:amount,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            date:`${k.getDate()}-${k.getMonth()}-${k.getFullYear()} ${k.getHours()}hr:${k.getMinutes()}:min`,
            id:Math.floor(Math.random()*5000)
        })
    }
    else{
            seterror(true)
        }
    
    

    
    setopen(false)
    setconsumer('')
    setamount('')
}
useEffect(()=>{
    fire.firestore().collection('banking').doc('users').collection('users').get().then(snap=>{
        setstate(snap.docs.map(l=>l.data()))
    })
},[state])
useEffect(() => {
        if(success){
                let k=new Date()
    fire.firestore().collection('transaction').add(
        {id:Math.floor(Math.random()*5000),consumer:consumer,producer:producer,amount:amount,date:`${k.getDate()}-${k.getMonth()}-${k.getFullYear()} ${k.getHours()}hr:${k.getMinutes()}:min`})
        }
    }, [success])

    const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
let k=new Date()
    return(<>
         <Modal
        open={open}
        onClose={()=>setopen(false)}>
        <div style={modalStyle} className={classes.paper} id='modal'>
            <h1>Transfer to:</h1>
            <br/>
            <select value={consumer} onChange={(e)=>setconsumer(e.target.value)}>
                <option value='Select'>Select</option>
                {state.filter(l=>l.name!==producer).map((k)=>(
                    <option value={k.name} key={k.name}>{k.name}</option>
                ))}
            </select>
            <br/>
            <Input value={amount} onChange={(e)=>setamount(e.target.value)} placeholder='Enter amount' />

            <Button onClick={handleTransfer}>Transfer</Button>
            </div>
            </Modal>
            <div className='top'>
            
            {success && <h3 className='success'>Transaction Successful!!!</h3>}
           {error && <h3 className='error'>Transaction Failed!!!</h3>}
            </div>
            {state.map((k)=>(
                <div key={k.name} className='item'>
                    <div>
                    <h2>{k.name}</h2>
                    </div>
                    <div>
                    <h3>{k.amount}</h3>
                    </div>
                    <Button onClick={()=>{setopen(true);setproducer(k.name)}}>Transfer</Button>
                </div>
                )
            )}
            </>
    )
}

export default App
