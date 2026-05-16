import React from "react";

function Hero() {
  return (
    <div className="container my-5">
      
      {/* Heading Section */}
      <div className="row text-center mb-5">
        <h1 className="mb-4">
          We pioneered the discount broking model in India.
          <br />
          Now, we are breaking ground with our technology.
        </h1>

        <hr className="mx-auto" style={{ width: "75%" }} />
      </div>

      {/* Content Section */}
      <div className="row justify-content-center">
        
        {/* Left Column */}
        <div className="col-md-5 text-center text-md-start">
          <p className="fs-6 mb-3">
            We kick-started operations on the 15th of August, 2010 with the goal
            of breaking all barriers that traders and investors face in India in
            terms of cost, support, and technology. We named the company Zerodha,
            a combination of Zero and "Rodha", the Sanskrit word for barrier.
          </p>

          <p className="fs-6 mb-3">
            Today, our disruptive pricing models and in-house technology have
            made us the biggest stock broker in India.
          </p>

          <p className="fs-6">
            Over 1.6+ crore clients place billions of orders every year through
            our powerful ecosystem of investment platforms, contributing over
            15% of all Indian retail trading volumes.
          </p>
        </div>

        {/* Right Column */}
        <div className="col-md-5">
          <p className="fs-6 mb-3">
            In addition, we run a number of popular open online educational and
            community initiatives to empower retail traders and investors.
          </p>

          <p className="fs-6 mb-3">
            Rainmatter, our fintech fund and incubator, has invested in several
            fintech startups with the goal of growing the Indian capital markets.
          </p>

          <p className="fs-6">
            And yet, we are always up to something new every day. Catch up on the
            latest updates on our blog or see what the media is saying about us or
            learn more about our business and product philosophies.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Hero;
