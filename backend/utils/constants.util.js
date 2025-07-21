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

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};
export const AVAILABLE_USER_ROLES = Object.values(USER_ROLES);

export const BOOKS_GENRE = {
  FICTION: 'fiction',
  'NON-FICTION': 'non-fiction',
  FANTASY: 'fantasy',
  'SCI-FI': 'sci-fi',
  BIOGRAPHY: 'biography',
  UNCATAGORIZED: 'uncatagorized',
};
export const AVAILABLE_BOOKS_GENRE = Object.values(BOOKS_GENRE);
