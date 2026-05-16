import React from 'react';
function Awards() {
    return ( 
        <div className='container mt-5 mb-5 py-4'>
            <div className='row'>
                <div className='col-6'>
                    <img src='resourses/largestBroker.svg' alt='Largest stock broker' className='awards-badge-img' />
                </div>
                <div className='col-6'>
                    <h1 className='mb-3 fs-3'>Largest stock broker in india</h1>
                    <p className='fs-5'>2+ million Zerodha clients contribute to over 15% of all retail order volumes in india daily by trading ad investing in:</p>
                    <div className='row'>
                        <div className='col-6'>
                            <ul >
                                <li className='fs-6 p-1'>Futures and Options</li>
                                <li className='fs-6 p-1'>Commodity derivatives</li>
                                <li className='fs-6 p-1'>Currency derivatives</li>
                            </ul>
                        </div>
                        <div className='col-6'>
                            <ul>
                                <li className='fs-6 p-1'>Stocks & IPOs</li>
                                <li className='fs-6 p-1'>Direct mutual funds</li>
                                <li className='fs-6 p-1'>Bonds and Govt.Securities</li>
                            </ul>
                        </div>
                    </div>
                    <img src='resourses/pressLogos.png' alt='Press coverage' className='press-logos-img' />
                </div>
            </div>
            
        </div>
     );
}

export default Awards;