import React from 'react';
import { Link } from 'react-router-dom';
function NotFound() {
    return (  
        <div className='container'>
            <div className='row text-center p-5 mt-5'>
                <h2>404</h2>
                <h4>Kiaan couldn’t find that page</h4>
                <h5> We couldn’t find the page you were looking for. Visit <Link to="/">Zerodha's</Link> home page</h5>
            </div>
        </div>
     );
}

export default NotFound;