const Joi = require('joi')

const generateValidationMiddleware = (schema) => ({
    before: async (request) => {
        try {
            const body = JSON.parse(request.event.body);

            const { error } = schema.validate(body);
            if (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: 'Validation error',
                        details: error.details.map((detail) => detail.message),
                    }),
                };
            }

            return request.response;
        } catch (parseError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid JSON format in the request body',
                    details: parseError.message,
                }),
            };
        }
    },
});

const userSchema = Joi.object({
    userName: Joi.string().max(50).required(),
    password: Joi.string().max(50).required(),
}).options({ abortEarly: false });

export const validateUserInput = generateValidationMiddleware(userSchema);

const quizSchema = Joi.object({
    name: Joi.string().max(50).required(),
    author: Joi.string().max(50).required(),
}).options({ abortEarly: false });

export const validateQuizInput = generateValidationMiddleware(quizSchema);

const questionSchema = Joi.object({
    question: Joi.string().max(50).required(),
    answer: Joi.string().max(50).required(),
    quizName: Joi.string().max(50).required(),
}).options({ abortEarly: false });

export const validateQuestionInput = generateValidationMiddleware(questionSchema);

const pointsSchema = Joi.object({
    quizName: Joi.string().max(50).required(),
    name: Joi.string().max(50).required(),
    points: Joi.number().max(10).required(),
}).options({ abortEarly: false });

export const validatePointsInput = generateValidationMiddleware(pointsSchema);