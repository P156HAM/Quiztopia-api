const bcrypt = require('bcryptjs');
import { db } from '../../services/db.js';

export async function bcryptPassword(password, userName) {
    const userExist = await db.scan({
        TableName: "users-db",
        FilterExpression: "#userName = :userName",
        ExpressionAttributeNames: {
            "#userName" : "userName"
        },
        ExpressionAttributeValues: {
            ":userName": userName,
        },
    }).promise();

    if (userExist.Count === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } else {
        throw new Error("User already exists");
    }
}

export async function addUser(userID, userName, hashedPassword) {
    const newUser = {
        PK: `u#${userID}`,
        entityType: "User",
        userName: userName,
        password: hashedPassword,
    }

    await db.put({
        TableName: "users-db",
        Item: newUser
    }).promise();

    return newUser
}