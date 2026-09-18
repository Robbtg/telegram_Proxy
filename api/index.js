export const config = {
  api: {
    bodyParser: false, // Allows streaming/raw body handling for JSON and multipart uploads
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  // Direct health check
  if (req.url === "/" || req.url === "/health" || req.url === "/ping") {
    return res.status(200).json({
      ok: true,
      status: "Telegram Bot API Proxy is active on Vercel",
      target: "api.telegram.org",
    });
  }

  const targetUrl = `https://api.telegram.org${req.url}`;

  // Forward headers (strip host to avoid confusion with Telegram servers)
  const headers = { ...req.headers };
  delete headers.host;

  try {
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const bodyBuffer = await getRawBody(req);
      if (bodyBuffer.length > 0) {
        fetchOptions.body = bodyBuffer;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status);

    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err) {
    return res.status(502).json({
      ok: false,
      description: `Vercel Proxy error: ${err.message}`,
    });
  }
}
