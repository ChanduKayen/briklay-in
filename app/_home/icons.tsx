import { ARCH_PATH } from "../_lib/arch-path";

/** The Briklay arch mark, without the wordmark. Takes the current text colour. */
export function ArchMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="14 8 473 495" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d={ARCH_PATH} />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l1.3-4.1A8 8 0 1 1 8.2 19L4 20z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A tick, drawn by hand rather than set in a font. */
export function Tick({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        pathLength={1}
        d="M2.5 8.6l3.4 3.4 7.6-8.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Cross({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
