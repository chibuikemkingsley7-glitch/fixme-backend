const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let users = [];
let workers = [
  {id:1, name:'Alice', type:'Hairdresser', exp:'6months-1year', price:4000},
  {id:2, name:'Bob', type:'Barber', exp:'3years-8years', price:10000}
];

app.post('/signup', (req,res)=>{
  const {email,password} = req.body;
  users.push({email,password});
  res.json({message:'Account created'});
});

app.post('/login',(req,res)=>{
  const {email,password} = req.body;
  const user = users.find(u=>u.email===email && u.password===password);
  if(user) res.json({message:'Login success', user:{email}});
  else res.status(401).json({message:'Invalid credentials'});
});

app.get('/workers',(req,res)=>{
  const {type} = req.query;
  const filtered = workers.filter(w=>w.type===type);
  res.json(filtered);
});

app.post('/book',(req,res)=>{
  const {workerId,location,price} = req.body;
  res.json({message:'Booking successful', workerId, location, price});
});

app.listen(PORT,()=>console.log(`FixMe backend running on port ${PORT}`));