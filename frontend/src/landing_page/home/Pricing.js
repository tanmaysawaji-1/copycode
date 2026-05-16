import React from 'react';
function Pricing() {
    return ( 
       <div className='container mt-5 mb-5 p-3'>
        <div className='row'>
            <div className='col-5'>
                <h1 className='pricinghed'>Unbeatable pricing</h1>
                <p className='pricingpara'>We pioneered the concept of discount broking and price transparency in india. Flat fees and no hidden charges.</p>
                <a href=''>See pricing →</a>
            </div>
            <div className='col-2'></div>
            <div className='col-5'>
                <div className='row text-center'>
                <div className='col-6 border p-3'>
                    <h1>₹0</h1>
                    <p>Free equity delivery and direct mutual funds</p>
                </div>
                <div className='col-6 border p-3'>
                    <h1>₹20</h1>
                    <p>Intraday and F&O</p>
                </div>
                </div>
            </div>
        </div>
       </div>
     );
}

export default Pricing;