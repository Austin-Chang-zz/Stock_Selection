export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage:"User name must be between 5-32 characters",
        },
        notEmpty: {
            errorMessage: "username can not be empty",
        },
        isString: {
            errorMessage: "Username must be a string"
        },
    },
    displayname: {
        notEmpty: true,
    },
};