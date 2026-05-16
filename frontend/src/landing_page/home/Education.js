import React from 'react';
function Education() {
    return ( 
        <div className='container mt-5 p-4'>
            <div className='row'>
                <div className='col-5'>
                    <img src='resourses/education.svg' alt='Free market education' className='education-img' />
                </div>
                <div className='col-2'></div>
                <div className='col-5 mt-3'>
                    <h1 className='Educationhead mb-3'>Free and open market education</h1>
                    <p className='Educationpara'>Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
                    <a href=''>Varsity →</a>
                    <p className='Educationpara mt-3' >TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>
                    <a href=''>TradingQ&A →</a>
                </div>
            </div>
        </div>
     );
}

export default Education;