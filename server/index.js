const express = require('express');
const dotenv = require('dotenv');
const cor = require('cors');
const razorpay = require('razorpay');
const crypto = require('crypto');   

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cor());


app.get('/', (req, res) => {
    res.send('server is running on port' + PORT);
});

app.post("/order", async(req, res)=>{

    try{
         const razorpayInstance = new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = req.body;
    const order = await razorpayInstance.orders.create(options);
    if(!order){
        return res.status(500).json({error: "Some error occured"});
    }
    res.json(order);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Some error occured"});
    }
   
})

app.post("/capture/validate", async(req, res)=>{
     const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;
     const sha = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
     //order_id + "|" + razorpay_payment_id, secret
     sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest('hex');
        if(digest !== razorpay_signature){
            return res.status(400).json({error: "Invalid signature"});
        }
        res.json({
            msg: "success",
            order_id: razorpay_order_id,
            paymentId: razorpay_payment_id 
        });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
