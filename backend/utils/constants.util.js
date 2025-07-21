export const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};

export const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
};

export const EMAIL = {
  emailFrom: process.env.MAILTRAP_MAIL,
  emailHost: process.env.MAILTRAP_HOST,
  emailPort: process.env.MAILTRAP_PORT,
  authUser: process.env.MAILTRAP_USERNAME,
  authPass: process.env.MAILTRAP_PASSWORD,
};

export const userRoles = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export const availableUserRoles = Object.values(userRoles);
