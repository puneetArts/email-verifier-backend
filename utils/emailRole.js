export const getUserRoleFromEmail = (email) => {
  const domains =
    process.env.ADMIN_EMAIL_DOMAINS?.split(",").map(d => d.trim()) || [];

  const emailDomain = email.split("@")[1]?.toLowerCase();

  if (domains.includes(emailDomain)) {
    return "admin";
  }

  return "user";
};
