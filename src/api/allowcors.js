// CORS configuration for json-server
module.exports = (req, res, next) => {
  // Allow requests from Angular dev server and any localhost
  const allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  res.setHeader(
    'Access-Control-Allow-Methods', 
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};