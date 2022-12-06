import ApiError from "./apiError.js";

export default function handle(err, req, res, next) {
    try {
        if (err instanceof ApiError) {
            res.status(err.status);

            return res.send(err.message);
        }

        console.error(err);

        res.status(500);

        return res.send("Something went wrong, please try again.");

    } catch (e) {
        console.error(e);
        res.status(500).end("Something went wrong.");
    }
}