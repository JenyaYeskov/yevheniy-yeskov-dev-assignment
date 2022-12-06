class ApiError extends Error {
    constructor(status = 400, ...params) {
        super(params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError)
        }

        this.status = status;
        this.name = "ApiError";
    }
}

export default ApiError;