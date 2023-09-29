import { sendError } from "../../responses/index.js";
import { db } from "../../services/db.js";

export async function findTable(quizId) {
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

    if (queryResult.Items.length === 0) {
        // Quiz not found, return an error response
        return sendError(404, { message: "Quiz not found" });
    }

    const result = {
        quizName: queryResult.Items[0].quiz,
        leaderBoard: queryResult.Items
    }

    return result;
}