const middy = require('@middy/core');
import { validateToken } from "../../middlewares/auth";
import { validateQuizInput } from "../../middlewares/bodyValidation";
import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
import { addQuiz } from "./helpers";

const { v4: uuidv4 } = require('uuid');

exports.handler = middy()
    .handler(async(event) => {
        try {
            
            if(!event?.userId || (event?.error && event?.error === "401")) {
                return sendError(401, { message: "Please provide a valid token."})
            } else if (event.error) {
                return sendError(event.error.statusCode, { message: event.error.message, details: event.error.details });
            }
            const { name, author } = JSON.parse(event.body);
            const quizId = uuidv4()
            const userId = event.userId
            const quiz = await addQuiz(name, author, quizId, userId)

            return sendResponse(200, { success: true, quiz });
        } catch (error) {
            return sendError(400, { message: error.message })
        }
    })
    .use(validateToken)
    .use(validateQuizInput)