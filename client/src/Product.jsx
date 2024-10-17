import React from 'react'

const paymenthandler = async (e) => {
    const response = await fetch('http://localhost:5000/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: 100,
            currency: 'INR',
            receipt: 'receipt#1',
        })
    })

    const order = await response.json();
    console.log(order);

    var options = {
        "key": "rzp_test_ZH77FHYLheWVYO", // Enter the Key ID generated from the Dashboard
        "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Artifex",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": async function (response){
            const body = {
                ...response,
            }
            await fetch('http://localhost:5000/capture/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const json = await response.json();
            console.log(json);
        },
        "prefill": {
            "name": "Piyush kumar",
            "email": "piyush.kumar@example.com",
            "contact": "9000090001"
        },
        "notes": {
            "address": "Artifex online craft warhouse"
        },
        "theme": {
            "color": "#7435cc"
        }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
}   
    
    

function Product() {
  return (
    <>
    <button onClick={paymenthandler}>Donate 1 Rs</button>
    </>
  )
}

export default Product