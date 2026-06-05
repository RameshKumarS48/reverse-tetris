export default async (req, res) => {
  try {
    // Import the server handler
    const { default: handler } = await import('../dist/server/server.js');

    // Create a Request-like object
    const url = new URL(req.url, `http://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? null : req.body,
    });

    // Call the handler
    const response = await handler.fetch(request, {}, {});

    // Set status
    res.status(response.status);

    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send body
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
};
