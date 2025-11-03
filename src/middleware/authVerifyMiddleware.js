import jwt from "jsonwebtoken";

const authVerifyMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            message: "Token not found"
        });
    }

    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.auth = decoded;
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    next();
}

export {
    authVerifyMiddleware
}