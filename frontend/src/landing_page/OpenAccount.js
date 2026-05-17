import React from 'react';
import { Link } from 'react-router-dom';

function OpenAccount() {
     return ( 
        <div className='container py-4 mb-4'>
            <div className='row text-center'>
                <h1 className='mb-2 fs-3'>Open a TradeZenith acoount</h1>
                <p className='fs-5'>Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
                <Link to="/signup"
                  className="p-2 btn btn-primary fs-5 mb-5"
                  style={{ width: "20%", margin: "0 auto" }}
                >
                  Signup Now
                </Link>
            </div>
        </div>
     );
}

export default OpenAccount;
