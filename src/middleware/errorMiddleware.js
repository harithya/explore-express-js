
import { ResponseError } from "../error/responseError.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        const payload = {
            message: err.message
        }
        if (err.errors) {
            payload.errors = err.errors;
        }
        res.status(err.status).json(payload).end();
    } else {
        res.status(500).json({
            message: err.message
        }).end();
    }
}

export {
    errorMiddleware
}
