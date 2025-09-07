/**
 * Shows a confirmation dialog for destructive actions.
 * @param {string} message - Message to show in the confirmation dialog.
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled.
 */
export const confirmAction = (message) => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
};
