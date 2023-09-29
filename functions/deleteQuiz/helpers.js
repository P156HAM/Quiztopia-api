import { sendResponse } from "../../responses";
import { db } from "../../services/db";

export async function deleteQuiz(quizId){
    try {
        const queryResult = await db.query({
            TableName: "quiztopia-db",
            KeyConditionExpression: "#PK = :PK",
            ExpressionAttributeNames: {
                "#PK": "PK"
            },
            ExpressionAttributeValues: {
                ":PK": `quiz#${quizId}`
            }
        }).promise();
    
        const itemsToDelete = [];
        const itemsCount = queryResult.Count;
        for (let i=0; i < itemsCount; i++) {
            const itemType = queryResult.Items[i].entityType
            const quizIdString = `quiz#${quizId}`;
            const skString = String(queryResult.Items[i].SK);

            if(itemType === "Question") {
                itemsToDelete.push({
                    DeleteRequest: {
                        Key: {
                            PK: quizIdString,
                            SK: skString
                        }
                    },
                });   
            } else if(itemType === "Quiz")
            itemsToDelete.push({
                DeleteRequest: {
                    Key: {
                        PK: quizIdString,
                        SK: skString
                    },
                }
            });
        }
    
        const params = {
            RequestItems: {
                "quiztopia-db": itemsToDelete,
            },
        };

        console.log(JSON.stringify(params));
    
        const data = await db.batchWrite(params).promise();

        console.log("Deletion result:", data);

        return {
            deletedItems: data && data.UnprocessedItems ? data.UnprocessedItems["quiztopia-db"] : [],
            success: true,
            message: "Quiz deleted successfully"
        };   
    } catch (error) {
        console.error("Error deleting items:", error);
        throw new Error("Error deleting items: " + error.message)
    }
}