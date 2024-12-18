export function checkConstraints(userName: string, firstName: string, lastName: string, email: string, password: string) {
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

export function checkPasswordConstraints(password: string){
  // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const isValidPassword = passwordRegex.test(password);

  return isValidPassword;
}

export function checkLoginConstraintsAsEmail(email : string , password: string){
     // Email validation (simple regex for email format)
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     const isValidEmail = emailRegex.test(email);
  
    // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(password);
  
    // Return true if all constraints are valid
    return email && isValidPassword;
}
export function checkLoginConstraintsAsUserName(userName : string , password: string){
     // Username must be alphanumeric and between 3-16 characters
    const userNameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const isValidUserName = userNameRegex.test(userName);
  
    // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(password);
  
    // Return true if all constraints are valid
    return isValidUserName && isValidPassword;
}

export function returnIdentity(input : string) {
  // Regular expression to match a valid email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the input matches the email pattern
  if (emailRegex.test(input)) {
    return "email";
  } else {
    return "userName";
  }
}

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function generateDummyPassword(email: string): string {
  const specialChars = '@$!%*?&';
  const randomChar = (charset: string) => charset[Math.floor(Math.random() * charset.length)];

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

  if (!passwordRegex.test(password)) {
    return generateDummyPassword(email);
  }

  return password;
}


