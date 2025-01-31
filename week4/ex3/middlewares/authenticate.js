const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) =>
    {
    // extract the Authorization header
    const authHeader = req.headers.authorization;

    // ceck if the Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // extract the token
    const token = authHeader.split(' ')[1];

    try
    {
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // attach the decoded token to the request object for later use
        req.user = decoded; // `decoded` contains data like { id, role }
        next(); // proceed to the next middleware or route handler
    }
    catch (error)
    {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
