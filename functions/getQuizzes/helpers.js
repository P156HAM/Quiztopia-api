import { db } from "../../services/db.js";

export async function getQuizzes() {
    const quizzes = await db.scan({
        TableName: "quiztopia-db",
        FilterExpression: "#entityType = :entityType",
        ExpressionAttributeNames: {
            "#entityType": "entityType"
        },
        ExpressionAttributeValues: {
            ":entityType": "Quiz"
        },
    }).promise();
    
    if(quizzes.Items) {
        return quizzes
    } else {
        throw new Error("No quizzes to show, please provide a quiz.")
    }
}