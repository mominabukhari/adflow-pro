export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

export const hasRole = (userRole, requiredRole) => {
  const hierarchy = {
    super_admin: 4,
    admin: 3,
    moderator: 2,
    user: 1,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
};