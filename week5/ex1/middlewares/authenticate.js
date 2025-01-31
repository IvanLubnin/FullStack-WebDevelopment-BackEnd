const jwt = require('jsonwebtoken');

//the authentication gets roles as an array
const authenticate = (roles = []) =>
    {

    return(req,res,next) =>
        {
            // extract the Authorization header
        const authHeader = req.headers.authorization;

        // ceck if the Authorization header is present
        if (!authHeader || !authHeader.startsWith('Bearer '))
        {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // extract the token, which contains the id and role of the user encrypted
        // when we decode the token, it has info about the user an the role
        const token = authHeader.split(' ')[1];

        try
        {
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // attach the decoded token to the request object for later use
            req.user = decoded; // `decoded` contains data like { _id, role }
            //check if the user role matches with the roles given in parameter
            if ( roles.length && !roles.includes(decoded.role))
            {
                // the client does not have any of the roles given as a parameter to this authenticate method
                return res.status(403).json({error: 'Forbidden: insufficient permissions'})
            }
            next(); // proceed to the next middleware or route handler
        }
        catch (error)
        {
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    }
};

module.exports = authenticate;
