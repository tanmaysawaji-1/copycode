import React from "react";
import { Link } from "react-router-dom";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The TradeZenith Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 p-3 mt-5">
          <img src="resourses/smallcaseLogo.png" alt='Smallcase' className='universe-logo-img' />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4 p-3 mt-4">
          <img src="resourses/dittoLogo.png" alt='Ditto' className='universe-logo-img' />
          <p className="text-small text-muted" >Personalized advice on life and health insurance</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="resourses/goldenpiLogo.png" alt='Goldenpi' className='universe-logo-img' />
          <p className="text-small text-muted">Bonds Treading Platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="resourses/sensibullLogo.svg" alt='Sensibull' className='universe-logo-img' />
          <p className="text-small text-muted">Option Trading platform</p>
        </div>
        <div className="col-4 p-3 mt-3">
          <img src="resourses/streakLogo.png" alt='Streak' className='universe-logo-img' />
          <p className="text-small text-muted">Systematic Treading platform</p>
        </div>
        <div className="col-4 p-3 mt-4">
          <img src="resourses/zerodhaFundhouse.png" alt='Zerodha Fundhouse' className='universe-logo-img' />
          <p className="text-small text-muted">Asset Management venture</p>
        </div>
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

export default Universe;