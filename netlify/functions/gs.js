// netlify/functions/gs.js
const GAS_URL = process.env.GAS_URL;     // כתובת ה-Web App של Apps Script
const GAS_TOKEN = process.env.GAS_TOKEN; // SHARED_TOKEN ששמרת ב-Properties

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  try {
    const route = event.queryStringParameters?.route || '';

    if (event.httpMethod === 'GET' && route === 'getByPid') {
      const pid = event.queryStringParameters?.pid || '';
      const url = `${GAS_URL}?action=getByPid&pid=${encodeURIComponent(pid)}&token=${encodeURIComponent(GAS_TOKEN)}`;
      const resp = await fetch(url, { method: 'GET' });
      const data = await resp.json();
      return { statusCode: 200, headers: cors, body: JSON.stringify(data) };
    }

    if (event.httpMethod === 'POST' && route === 'saveUpdates') {
      const payload = JSON.parse(event.body || '{}'); // { pid, updates }
      const url = `${GAS_URL}?action=saveUpdates&token=${encodeURIComponent(GAS_TOKEN)}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      return { statusCode: 200, headers: cors, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers: cors, body: JSON.stringify({ ok: false, error: 'unknown route' }) };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
