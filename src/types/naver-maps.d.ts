/**
 * Minimal ambient type declaration for the Naver Cloud Platform
 * Maps JS API. The official package does not ship types, so we keep
 * this loose `any` shape and rely on runtime checks.
 */
declare global {
  interface Window {
    naver?: {
      maps: any;
    };
  }
}
export {};
