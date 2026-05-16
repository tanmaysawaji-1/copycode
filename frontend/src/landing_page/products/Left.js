import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDesription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6 text-center d-flex align-items-center justify-content-center">
          <img src={imageURL} alt={productName} className='product-img' />
        </div>
        <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div>
            <a href={tryDemo}>Try Demo</a>
            <a href={learnMore} style={{ marginLeft: "50px" }}>
              Learn More
            </a>
          </div>
          <div className="mt-3">
            <a href={googlePlay}>
              <img src="resourses/googlePlayBadge.svg" alt='Get it on Google Play' className='store-badge-img' />
            </a>
            <a href={appStore}>
              <img
                src="resourses/appstoreBadge.svg"
                alt='Download on the App Store'
                className='store-badge-img'
                style={{ marginLeft: "40px" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;