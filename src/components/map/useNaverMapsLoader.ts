import { useEffect, useState } from "react";

/**
 * NAVER Cloud Platform Maps API (post-2024) loader.
 *
 * IMPORTANT — script URL parameter is `ncpKeyId` (NOT the legacy
 * `ncpClientId`). Using the wrong parameter results in a 401 from
 * the auth endpoint.
 *
 * Configure the key via Vite env var. On Vercel:
 *   Project → Settings → Environment Variables
 *   Name:  VITE_NAVER_MAP_CLIENT_ID
 *   Value: <your NCP Maps API key id>
 *
 * A literal fallback ("nvudsp45ws") is supplied so the page works
 * out of the box even before the env var is configured.
 */
const NAVER_SCRIPT_ID = "naver-maps-sdk";

function getClientId(): string {
  // Vite-style env var (recommended)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env ?? {};
  return (
    env.VITE_NAVER_MAP_CLIENT_ID ||
    env.VITE_PUBLIC_NAVER_MAP_CLIENT_ID ||
    "nvudsp45ws"
  );
}

type LoadState = "idle" | "loading" | "ready" | "error";

export function useNaverMapsLoader(): { state: LoadState; error?: string } {
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // Already loaded by a previous mount
    if (typeof window !== "undefined" && window.naver?.maps) {
      setState("ready");
      return;
    }

    const existing = document.getElementById(NAVER_SCRIPT_ID) as HTMLScriptElement | null;

    const onLoad = () => {
      if (window.naver?.maps) setState("ready");
      else {
        setState("error");
        setError("Naver Maps SDK loaded but window.naver.maps is missing.");
      }
    };
    const onError = () => {
      setState("error");
      setError("Failed to load Naver Maps SDK.");
    };

    if (existing) {
      setState("loading");
      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", onError);
      // If the script already finished loading before we attached
      if (window.naver?.maps) onLoad();
      return () => {
        existing.removeEventListener("load", onLoad);
        existing.removeEventListener("error", onError);
      };
    }

    const clientId = getClientId();
    if (!clientId) {
      setState("error");
      setError("Missing VITE_NAVER_MAP_CLIENT_ID env var.");
      return;
    }

    const script = document.createElement("script");
    script.id = NAVER_SCRIPT_ID;
    // ⚠️ Use `ncpKeyId` (NCP Maps post-2024). Do NOT use legacy `ncpClientId`.
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(
      clientId
    )}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    document.head.appendChild(script);
    setState("loading");

    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, []);

  return { state, error };
}
