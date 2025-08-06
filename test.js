const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // using node-fetch@2

const app = express();
const PORT = 3000;

const SHEET_ID = '16YMLwiUr0yiBvQrhaa_eb7TiYfcl9Dxs_UXDZxs_oiw';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

app.use(cors());

app.get('/sheet-data', async (req, res) => {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // Remove JSONP padding
    const json = JSON.parse(text.substring(47, text.length - 2));

    const headers = json.table.cols.map(col => col.label);
    const data = json.table.rows.map(row => {
      const obj = {};
      row.c.forEach((cell, i) => {
        obj[headers[i]] = cell ? cell.v : "";
      });
      return obj;
    });

    res.json({ headers, data });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch Google Sheet data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
