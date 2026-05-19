// In-memory store to track exam/practice session start times to prevent time spoofing.
// Key format: {userId}_{type}_{examIdOrCategory}_{subjectIfNeeded}
export const activeSessions = new Map();
