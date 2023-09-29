const { db } = require("../../services/db");

export async function findQuizByName(quizName) {
    const queryResult = await db.query({
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

    return queryResult
}

export async function findQuizById(quizId) {
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

    return quiz;
}

export async function addQuestion(quizId, questionId, question, answer) {
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
}