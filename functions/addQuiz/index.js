const middy = require('@middy/core');
import { validateToken } from "../../middlewares/auth";
import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
import { db } from "../../services/db";
import { modifyUserId } from "./helpers";
const { v4: uuidv4 } = require('uuid');

exports.handler = middy()
    .handler(async(event) => {
        try {
            console.log(event)
            const { name, author } = JSON.parse(event.body);
            const quizId = uuidv4()

            const quiz = {
                PK: `quiz#${quizId}`, 
                SK: `quiz#${quizId}`,
                entityType: "Quiz",
                name: name,
                author: author,
                userId: event.userId
            }

            console.log(quiz);

            await db.put({
                TableName: "quiztopia-db", 
                Item: quiz
            }).promise();

            return sendResponse(200, { success: true, message: "Quiz added successfully" });
        } catch (error) {
            return sendError(400, { message: error.message })
        }
    })
    .use(validateToken)