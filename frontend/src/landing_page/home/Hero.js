import React from 'react';
import { Link } from 'react-router-dom';
function Hero() {
    return ( 
        <div className='container py-4'>
            <div className='row text-center mt-5'>
                <img src='resourses/homeHero.png' alt='Invest in everything' className='hero-img' />
                <h1 className='mb-2 fs-3'>Invest in everything</h1>
                <p className='fs-5'>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
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

export default Hero;