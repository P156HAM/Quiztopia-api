import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
import { findQuiz } from "./helpers.js";

exports.handler = async(event) => {
    try {
        const { userId, quizId } = event.pathParameters;
        const quiz = await findQuiz(userId, quizId)

        if (!quiz) {
            return sendError(401, { sucess: false, message: 'No quizzes to show, please deploy a quiz.' })
        } else {
            return sendResponse(200, { sucess: true, quiz })
        }
    } catch (error) {
        return sendError(401, { message: error.message })
    }
}
