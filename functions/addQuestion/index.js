const { db } = require("../../services/db");
import { validateToken } from "../../middlewares/auth";
import { sendResponse } from "../../responses/index.js";
import { sendError } from "../../responses/index.js";
const middy = require('@middy/core');
const { v4: uuidv4 } = require('uuid');

exports.handler = middy()
    .handler(async(event) => {
        try {
            const { question, answer, quizName } = JSON.parse(event.body);
            
            // scaning the database to find the specifik quiz to add the question to. 
            const quizQueryResult = await db.query({
                TableName: "quiztopia-db",
                IndexName: "GSI1-name",
                KeyConditionExpression: "#name = :name",
                ExpressionAttributeNames: {
                    "#name": "name"
                },
                ExpressionAttributeValues: {
                    ":name": quizName
                },
            }).promise();

            if (quizQueryResult.Items.length === 0) {
                // Quiz not found, return an error response
                return sendError(404, { message: "Quiz not found" });
            }
            
            const quizId = quizQueryResult.Items[0].SK;
            const questionId = uuidv4();
            const addedQuestion = {
                PK: quizId,
                SK: `question#${questionId}`,
                entityType: "Question",
                question: question,
                answer: answer,
                location: {
                    "longitude": "11.555.66.11",
                    "latitude": "22.445.645"
                }
            }

            // Adding the question to the database.
            await db.put({
                TableName: "quiztopia-db",
                Item: addedQuestion
            }).promise(); 


            // Query for all questions related to the quiz
            const quiz = await db.query({
                TableName: "quiztopia-db",
                KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
                ExpressionAttributeNames: {
                    "#PK": "PK",
                    "#SK": "SK"
                },
                ExpressionAttributeValues: {
                    ":PK": quizId,
                    ":SK": "question#"
                }
            }).promise();

            return sendResponse(200, { success: true, quiz });
        } catch (error) {
            return sendError(400, { message: error.message })
        }
    })
    .use(validateToken)

