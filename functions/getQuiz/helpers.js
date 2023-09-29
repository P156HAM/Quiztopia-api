import { db } from "../../services/db.js";

export async function findQuiz(userId, quizName) {
    quizName = quizName.replace(/-/g, ' ')
    const quizResult = await db.query({
        TableName: "quiztopia-db",
        IndexName: "GSI1-quiz",
        KeyConditionExpression: "#name = :name AND #userId = :userId",
        ExpressionAttributeNames: {
            "#name": "name",
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":name": quizName,
            ":userId": `u#${userId}`
        }
    }).promise();

    if(quizResult.Count > 0) {
        const quizId = quizResult.Items[0].SK
        const questionResult = await db.query({
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

        const quiz = questionResult.Items
        return quiz;
    } else {
        throw new Error("Quiz not found")
    }
}