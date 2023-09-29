import { addPoints } from "./helpers"
import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
import { validatePointsInput } from "../../middlewares/bodyValidation";
const middy = require('@middy/core');

exports.handler = middy() 
    .handler(async(event) => {
    try {
        // Check if there's an error in the event (from validation middleware)
        if (event.error) {
            return sendError(event.error.statusCode, { message: event.error.message, details: event.error.details });
        }

        const { quizName, name, points } = JSON.parse(event.body); 
        const { quizId } = event.pathParameters; 
        // Call the helper function to add points, the same function query the database to find the required quiz by name
        const quiz = await addPoints(quizId, quizName, name, points)
        
        return sendResponse(200, { success: true, quiz });
    } catch (error) {
        return sendError(400, { message: error.message })  
    }
    })
    .use(validatePointsInput)
