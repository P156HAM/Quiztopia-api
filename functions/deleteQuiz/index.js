const middy = require('@middy/core');
import { validateToken } from "../../middlewares/auth";
import { sendError, sendResponse } from "../../responses";
import { deleteQuiz } from "./helpers";

exports.handler = middy()
    .handler(async(event) => {
        try {
            if(!event?.userId || (event?.error && event?.error === "401")) return sendError(401, { message: "Please provide a valid token."})  
            const {quizId} = event.pathParameters
            console.log(quizId)
            const result = await deleteQuiz(quizId);

            return sendResponse(200, result )
        } catch (error) {
            sendError(400, { message: error.message })
        }
    })
    .use(validateToken)