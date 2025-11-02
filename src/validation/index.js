import { ResponseError } from "../error/responseError.js";
import { logger } from "../lib/logging.js";

const validate = (schema, request) => {
    const result = schema.safeParse(request)
    logger.error(result.error);
    if (result.error) {
        const errors = result.error.issues.map((issue) => {
            return {
                path: issue.path[0],
                message: issue.message,
            };
        })
            .reduce((acc, curr) => {
                acc[curr.path] = curr.message;
                return acc;
            }, {});

        throw new ResponseError(400, "Validation Error", errors);
    } else {
        return result.data;
    }
}

export {
    validate
}
