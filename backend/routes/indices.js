const express = require("express");
const router  = express.Router();

// Mock random fluctuation for live demonstration
let niftyValue = 22450.25;
let sensexValue = 74100.00;

router.get("/indices", (req, res) => {
  // Add slight random jitter
  const nChange = (Math.random() - 0.5) * 50;
  const sChange = (Math.random() - 0.5) * 150;
  
  niftyValue += nChange;
  sensexValue += sChange;

  res.json({
    nifty: { 
      value: niftyValue.toFixed(2), 
      change: nChange.toFixed(2), 
      changePercent: ((nChange / niftyValue) * 100).toFixed(2) 
    },
    sensex: { 
      value: sensexValue.toFixed(2), 
      change: sChange.toFixed(2), 
      changePercent: ((sChange / sensexValue) * 100).toFixed(2) 
    }
  });
});

module.exports = router;
