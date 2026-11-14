/*
 * Mia Quy Nhon — Festive eCard configuration
 * -------------------------------------------
 * apiUrl: the Google Apps Script Web App URL (ends in /exec).
 *         Leave empty to run in preview-only mode (cards can be designed and
 *         previewed, but not sent). See ecard/README.md for set-up.
 */
window.ECARD_CONFIG = {
  apiUrl: '',
  siteUrl: 'https://miaquynhon.com',
  maxRecipients: 5,
  maxMessage: 400,
  maxPhotoEdge: 1400,      // px — photos are resized in the browser before upload
  photoQuality: 0.84
};
