// Where enquiries from the site go.

/** WhatsApp number: country code, no plus. */
export const WHATSAPP_NUMBER = "918330972705";
export const PHONE_TEL = "+918330972705";
export const PHONE_DISPLAY = "+91 83309 72705";

/** Link that opens a WhatsApp chat with Briklay, message pre-filled. */
export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
