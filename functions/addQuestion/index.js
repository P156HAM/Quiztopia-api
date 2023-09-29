import { validateToken } from "../../middlewares/auth";
import { validateQuestionInput } from "../../middlewares/bodyValidation";
import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
import { addQuestion, findQuizById, findQuizByName } from "./helpers";
const middy = require('@middy/core');
const { v4: uuidv4 } = require('uuid');

exports.handler = middy()
    .handler(async(event) => {
        try {

            if(!event?.userId || (event?.error && event?.error === "401")) {
                return sendError(401, { message: "Please provide a valid token."})
            } else if (event.error) {
                return sendError(event.error.statusCode, { message: event.error.message, details: event.error.details });
            }

            const { question, answer, quizName } = JSON.parse(event.body);
            // query the database to find the specifik quiz to add the question to. 
            const quizQueryResult = await findQuizByName(quizName)

            if (quizQueryResult.Items.length === 0) {
                // Quiz not found, return an error response
                return sendError(404, { message: "Quiz not found" });
            }
            
            const quizId = quizQueryResult.Items[0].SK;
            const questionId = uuidv4();
            await addQuestion(quizId, questionId, question, answer);

            // Query for all questions related to the quiz
            const quiz = await findQuizById(quizId);

            return sendResponse(200, { success: true, quiz });
        } catch (error) {
            return sendError(400, { message: error.message })
        }
    })
    .use(validateToken)
    .use(validateQuestionInput)

