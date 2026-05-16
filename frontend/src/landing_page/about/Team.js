import React from 'react';

function Team() {
    return (
        <div className="container my-5">
            
            {/* Heading */}
            <div className="row text-center mb-5">
                <h1>People</h1>
            </div>

            {/* Content Row */}
            <div className="row align-items-start">
                
                {/* Left Column - Image */}
                <div className="col-md-4 text-center">
                    <img
                        src="resourses/nithinKamath.jpg"
                        alt="Nithin Kamath"
                        className="img-fluid rounded-circle mb-3"
                        style={{ width: "250px" }}
                    />
                    <h4>Nithin Kamath</h4>
                    <p className="text-muted">Founder, CEO</p>
                </div>

                {/* Right Column - Text */}
                <div className="col-md-8">
                    <p>
                        Nithin bootstrapped and founded Zerodha in 2010 to overcome the
                        hurdles he faced during his decade long stint as a trader. Today,
                        Zerodha has changed the landscape of the Indian broking industry.
                    </p>

                    <p>
                        He is a member of the SEBI Secondary Market Advisory Committee
                        (SMAC) and the Market Data Advisory Committee (MDAC).
                    </p>

                    <p>Playing basketball is his zen.</p>

                    <p>
                        Connect on{" "}
                        <a href="#">Homepage</a> /{" "}
                        <a href="#">TradingQnA</a> /{" "}
                        <a href="#">Twitter</a>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Team;
