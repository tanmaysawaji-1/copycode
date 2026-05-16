import React from 'react';
function Stats() {
    return ( 
        <div className='container mt-6 py-4'>
            <div className='row'>
                <div className='Statsdiv col-6' style={{width:"40vw"}}>
                    <h1 className='mb-4 p-2'>Trust with confidence</h1>
                    <div className='p-2'>
                        <h1 className='mb-2'>Customer-first always</h1>
                        <p>That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores of equity investments, making us India's largest broker; contributing to 15% of daily retail exchange volumes in India.</p>
                    </div >
                    <div className='p-2'>
                        <h1 className='mb-2'>No spam or gimmicks</h1>
                        <p>No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like.<a href=''>Our philosophies.</a></p>
                    </div>
                    <div className='p-2'>
                        <h1 className='mb-2'>The Zerodha universe</h1>
                        <p>Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>
                    </div>
                    <div className='p-2'>
                        <h1 className='mb-2'>Do better with money</h1>
                        <p>With initiatives like <a href=''>Nudge</a> and <a href=''>Kill Switch</a>, we don't just facilitate transactions, but actively help you do better with your money.</p>
                    </div>
                </div>
                <div className='col-6'>
                    <img src='resourses/ecosystem.png' alt='Zerodha ecosystem' className='ecosystem-img' />
                    <div className='text-center'>
                    <a className='me-5 fs-6' href=''>Explore our products →</a>
                    <a  className=' fs-6' href=''>Try Kite demo →</a>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Stats;