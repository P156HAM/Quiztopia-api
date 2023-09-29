import { db } from "../../services/db";

export async function addQuiz(name, author, quizId, userId) {
    const quiz = {
        PK: `quiz#${quizId}`, 
        SK: `quiz#${quizId}`,
        entityType: "Quiz",
        name: name,
        author: author,
        userId: userId
    }

    await db.put({
        TableName: "quiztopia-db", 
        Item: quiz
    }).promise();

    return quiz;
}