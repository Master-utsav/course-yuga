"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegex = void 0;
exports.checkConstraints = checkConstraints;
exports.checkPasswordConstraints = checkPasswordConstraints;
exports.checkLoginConstraintsAsEmail = checkLoginConstraintsAsEmail;
exports.checkLoginConstraintsAsUserName = checkLoginConstraintsAsUserName;
exports.returnIdentity = returnIdentity;
exports.generateDummyPassword = generateDummyPassword;
function checkConstraints(userName, firstName, lastName, email, password) {
    // Username must be alphanumeric and between 3-16 characters
    const userNameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const isValidUserName = userNameRegex.test(userName);
    // First name should only contain letters and be at least 2 characters long
    const firstNameRegex = /^[a-zA-Z]{2,}$/;
    const isValidFirstName = firstNameRegex.test(firstName);
    // Last name should only contain letters and be at least 2 characters long
    const lastNameRegex = /^[a-zA-Z]{2,}$/;
    const isValidLastName = lastNameRegex.test(firstName);
    // Email validation (simple regex for email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(password);
    // Return true if all constraints are valid
    return isValidUserName && isValidFirstName && isValidEmail && isValidPassword && isValidLastName;
}
function checkPasswordConstraints(password) {
    // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(password);
    return isValidPassword;
}
function checkLoginConstraintsAsEmail(email, password) {
    // Email validation (simple regex for email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(password);
    // Return true if all constraints are valid
    return email && isValidPassword;
}
function checkLoginConstraintsAsUserName(userName, password) {
    // Username must be alphanumeric and between 3-16 characters
    const userNameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const isValidUserName = userNameRegex.test(userName);
    // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(password);
    // Return true if all constraints are valid
    return isValidUserName && isValidPassword;
}
function returnIdentity(input) {
    // Regular expression to match a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the input matches the email pattern
    if (emailRegex.test(input)) {
        return "email";
    }
    else {
        return "userName";
    }
}
exports.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
function generateDummyPassword(email) {
    const specialChars = '@$!%*?&';
    const randomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];
    let password = '';
    password += randomChar('abcdefghijklmnopqrstuvwxyz');
    password += randomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    password += randomChar('0123456789');
    password += randomChar(specialChars);
    const remainingLength = Math.max(8 - password.length, 0);
    const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + specialChars;
    for (let i = 0; i < remainingLength; i++) {
        password += randomChar(allowedChars);
    }
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    if (!exports.passwordRegex.test(password)) {
        return generateDummyPassword(email);
    }
    return password;
}
