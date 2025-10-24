export const responseCookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // maxAge: 86400000 * 30, // 30 days
};
