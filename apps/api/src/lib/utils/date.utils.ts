/**
 * Check if a cooldown period has passed since the last action
 * @param lastSentAt - The date when the action was last performed
 * @param cooldownTime - The cooldown duration in milliseconds
 * @returns A boolean indicating if the cooldown period is still active
 */

export const isInCooldown = (
  lastSentAt: Date | null | undefined,
  cooldownTime: number,
): boolean => {
  if (!lastSentAt) return false;
  return Date.now() - lastSentAt.getTime() < cooldownTime;
};
