/**
 * Single source of truth for user-facing messages so the API, Redux slice,
 * and components never drift apart in wording.
 */
export const STUDENT_MESSAGES = {
  listFailed: "Unable to load students. Please try again.",
  loadFailed: "Unable to load student. Please try again.",
  createFailed: "Unable to create student. Please try again.",
  updateFailed: "Unable to update student. Please try again.",
  deleteFailed: "Unable to delete student. Please try again.",
  notFound: "Student not found.",
  duplicateEmail: "A student with this email already exists.",
  invalidRequest: "Invalid request.",
  created: "Student created successfully.",
  updated: "Student updated successfully.",
  deleted: "Student deleted successfully.",
} as const;

export const AUTH_MESSAGES = {
  invalidCredentials: "Invalid username or password.",
  loginFailed: "Unable to log in. Please try again.",
  logoutFailed: "Unable to log out. Please try again.",
  loggedIn: "Logged in successfully.",
  loggedOut: "Logged out successfully.",
} as const;
