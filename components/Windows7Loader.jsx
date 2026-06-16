// Windows7Loader.jsx
import React from "react";

const Windows7Loader = () => {
  return (
    <div className="windows7-loader-overlay">
      <div className="window active" style={{ width: "380px" }}>
        {/* Title Bar */}
        <div className="title-bar">
          <div className="title-bar-text">Please Wait</div>
          <div className="title-bar-controls">
            <button aria-label="Close" disabled></button>
          </div>
        </div>

        {/* Window Body with Loading Message and Progress Bar */}
        <div className="window-body has-space">
          <h2 className="instruction instruction-primary">
            Downloading page content...
          </h2>
          {/* THIS IS THE INDETERMINATE PROGRESS BAR */}
          <div role="progressbar" className="marquee"></div>
          <p style={{ marginTop: "1rem", fontSize: "12px" }}>
            This may take a few moments.
          </p>
        </div>

        {/* Optional Status Bar (for extra Windows 7 flair) */}
        <div className="status-bar">
          <p className="status-bar-field">Loading...</p>
          <p className="status-bar-field">|</p>
          <p className="status-bar-field">Please do not refresh the page</p>
        </div>
      </div>
    </div>
  );
};

export default Windows7Loader;