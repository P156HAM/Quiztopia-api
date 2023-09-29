import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
import { findTable } from "./helpers.js";

exports.handler = async(event) => {
    try {
        const { quizId } = event.pathParameters;
        const table = await findTable(quizId)

        return sendResponse(200, { sucess: true, table })
    } catch (error) {
        return sendError(401, { message: error.message })
    }
}
