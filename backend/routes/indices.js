const express = require("express");
const router  = express.Router();

// ── INDICES ───────────────────────────────────────────────────
// Currently uses a realistic mock with small random fluctuation.
//
// TO SWITCH TO LIVE DATA: uncomment the Python service block below
// and comment out the mock block. Set PYTHON_SERVICE_URL in .env:
//   PYTHON_SERVICE_URL=http://localhost:8000   (local)
//   PYTHON_SERVICE_URL=https://your-python-service.onrender.com  (prod)
//
// const axios = require("axios");
// const PYTHON_URL = process.env.PYTHON_SERVICE_URL;
//
// router.get("/indices", async (req, res) => {
//   try {
//     const { data } = await axios.get(`${PYTHON_URL}/indices`);
//     res.json(data);
//   } catch (err) {
//     console.error("Python service error:", err.message);
//     res.status(502).json({ error: "Market data service unavailable" });
//   }
// });
// ─────────────────────────────────────────────────────────────

// ── MOCK (stable starting values + small drift) ───────────────
// Starting values reset on each server restart — realistic for demo.
let niftyBase  = 22450.25;
let sensexBase = 74100.00;
let niftyPrev  = niftyBase;
let sensexPrev = sensexBase;

// Drift slowly so values don't go crazy over time
const MAX_DRIFT = 200; // NIFTY won't drift more than ±200 from base

router.get("/indices", (req, res) => {
  const niftyDrift  = niftyBase  + (Math.random() - 0.48) * 30;
  const sensexDrift = sensexBase + (Math.random() - 0.48) * 90;

  // Clamp drift to stay realistic
  const niftyValue  = Math.max(niftyBase - MAX_DRIFT, Math.min(niftyBase + MAX_DRIFT, niftyDrift));
  const sensexValue = Math.max(sensexBase - MAX_DRIFT * 3, Math.min(sensexBase + MAX_DRIFT * 3, sensexDrift));

  const nChange = parseFloat((niftyValue  - niftyPrev).toFixed(2));
  const sChange = parseFloat((sensexValue - sensexPrev).toFixed(2));

  // Update prev for next call
  niftyPrev  = niftyValue;
  sensexPrev = sensexValue;

  res.json({
    nifty: {
      value:         niftyValue.toFixed(2),
      change:        nChange.toFixed(2),
      changePercent: ((nChange / niftyValue) * 100).toFixed(2),
    },
    sensex: {
      value:         sensexValue.toFixed(2),
      change:        sChange.toFixed(2),
      changePercent: ((sChange / sensexValue) * 100).toFixed(2),
    },
  });
});

module.exports = router;