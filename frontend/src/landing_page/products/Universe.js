import React from "react";


function Universe() {
  return (
    <div className="container universe-section text-center">

      <h1 className="fw-bold">The Zerodha Universe</h1>
      <p className="text-muted">
        Extend your trading and investment experience even further with our
        partner platforms
      </p>

      {/* First Row */}
      <div className="row mt-5">
        <div className="col-12 col-md-4 p-4">
          <div className="logo-box">
            <img
              src="images/smallcaseLogo.png"
              alt="smallcase"
              className="universe-logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </div>
          <p className="small text-muted mt-3">
            Thematic investment platform
          </p>
        </div>

        <div className="col-12 col-md-4 p-4">
          <div className="logo-box">
            <img
              src="images/streakLogo.png"
              alt="streak"
              className="universe-logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </div>
          <p className="small text-muted mt-3">
            Algo & strategy platform
          </p>
        </div>

        <div className="col-12 col-md-4 p-4">
          <div className="logo-box">
            <img
              src="images/sensibullLogo.svg"
              alt="sensibull"
              className="universe-logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </div>
          <p className="small text-muted mt-3">
            Options trading platform
          </p>
        </div>
      </div>

      {/* Second Row */}
      <div className="row mt-4">
        <div className="col-12 col-md-4 p-4">
          <div className="logo-box">
            <img
              src="images/zerodhaFundhouse.png"
              alt="fundhouse"
              className="universe-logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </div>
          <p className="small text-muted mt-3">
            Asset management
          </p>
        </div>

        <div className="col-12 col-md-4 p-4">
          <div className="logo-box">
            <img
              src="images/goldenpiLogo.png"
              alt="goldenpi"
              className="universe-logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </div>
          <p className="small text-muted mt-3">
            Bonds platform
          </p>
        </div>

        <div className="col-12 col-md-4 p-4">
          <div className="logo-box">
            <img
              src="images/dittoLogo.png"
              alt="ditto"
              className="universe-logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </div>
          <p className="small text-muted mt-3">
            Insurance advisory
          </p>
        </div>
      </div>

      <button className="btn btn-primary fs-5 mt-5 px-4">
        Signup Now
      </button>

    </div>
  );
}

export default Universe;
