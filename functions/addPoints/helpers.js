import { sendError } from "../../responses";
const { db } = require("../../services/db");

export async function addPoints(quizId, quizName, name, points) {
    try {

        const queryResultByQuizName = await db.query({
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

        if (queryResultByQuizName.Items.length === 0) {
            // Quiz not found, return an error response
            return sendError(404, { message: "Quiz not found" });
        }

        const item = {
            PK: `quiz#${quizId}`,
            SK: `Points#${name}`,
            quiz: quizName,
            name: name,
            points: points
        }

        await db.put({
            "TableName": "quiztopia-db", 
            Item: item
        }).promise();

        const queryResult = await db.query({
            TableName: "quiztopia-db",
            KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
            ExpressionAttributeNames: {
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues: {
                ":PK": `quiz#${quizId}`,
                ":SK": "Points"
            }
        }).promise();

        const quiz = {
            quizName,
            leaderBord: queryResult.Items
        }

        return quiz;
    } catch (error) {
        console.error("Error querying the database:", error);
        throw new Error("Error querying the database: " + error.message); 
    }
}