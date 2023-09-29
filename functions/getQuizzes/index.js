import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
import { getQuizzes } from "./helpers.js";

exports.handler = async(event) => {
    try {  
        const quizzes = await getQuizzes();
        if (!quizzes) {
            return sendError(401, { sucess: false, message: 'No quizzes to show, please deploy a quiz.' })
        } else {
            return sendResponse(200, { sucess: true, quizzes })
        }
    } catch (error) {
        return sendError(400, { message: error.message })
    }
}
