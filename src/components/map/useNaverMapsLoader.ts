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
 * After saving the env var on Vercel you MUST trigger a redeploy
 * (Deployments → ⋯ → Redeploy) — env vars are baked at build time.
 *
 * NCP console must also register every domain that calls this SDK:
 *   - https://anibus.org
 *   - https://www.anibus.org
 *   - http://localhost:3000  (dev)
 *   - http://localhost:8080  (dev — Vite default for this project)
 * NCP console → Maps → Application → Web 서비스 URL.
 * Changes can take 5–10 minutes to propagate.
 */
const NAVER_SCRIPT_ID = "naver-maps-sdk";

declare global {
  interface Window {
    /**
     * NAVER Maps SDK calls this global if Open API authentication fails
     * (invalid key, unregistered domain, expired plan, …). The SDK does
     * NOT throw — it only invokes this callback. Without it, the failure
     * is silent and our `script.onload` handler reports `"ready"`.
     */
    navermap_authFailure?: () => void;
  }
}

function getClientId(): string | null {
  // Vite-style env var (recommended)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env ?? {};
  const id =
    env.VITE_NAVER_MAP_CLIENT_ID ||
    env.VITE_PUBLIC_NAVER_MAP_CLIENT_ID ||
    "";
  return id.trim() ? String(id).trim() : null;
}

type LoadState = "idle" | "loading" | "ready" | "error";

export function useNaverMapsLoader(): { state: LoadState; error?: string } {
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // Already loaded by a previous mount AND auth has not failed.
    if (typeof window !== "undefined" && window.naver?.maps) {
      setState("ready");
    }

    // -------------------------------------------------------------------
    // Auth failure callback.
    //
    // Naver SDK invokes `window.navermap_authFailure()` when the key is
    // invalid or the calling domain is not registered in the NCP console.
    // We surface that into React state so <MapPlaceholder> renders the
    // i18n `map_error` message instead of leaving an empty grey box.
    //
    // We also wrap any pre-existing handler so we don't clobber it (e.g.
    // a previous mount of this hook in the same tab session).
    // -------------------------------------------------------------------
    const previousAuthFailure = window.navermap_authFailure;
    window.navermap_authFailure = () => {
      console.error(
        "[v0] NAVER Maps auth failure — likely causes: " +
          "(1) VITE_NAVER_MAP_CLIENT_ID env var missing/wrong on Vercel, " +
          "(2) current domain is not registered in NCP console " +
          "(Maps → Application → Web 서비스 URL), " +
          "(3) NCP plan exhausted/disabled."
      );
      setState("error");
      setError("Naver Maps authentication failed (key or domain).");
      try {
        previousAuthFailure?.();
      } catch {
        /* ignore */
      }
    };

    const existing = document.getElementById(NAVER_SCRIPT_ID) as HTMLScriptElement | null;

    const onLoad = () => {
      if (window.naver?.maps) setState((s) => (s === "error" ? s : "ready"));
      else {
        setState("error");
        setError("Naver Maps SDK loaded but window.naver.maps is missing.");
      }
    };
    const onError = () => {
      setState("error");
      setError("Failed to load Naver Maps SDK script.");
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
        // Restore previous auth-failure handler when the hook unmounts.
        window.navermap_authFailure = previousAuthFailure;
      };
    }

    const clientId = getClientId();
    if (!clientId) {
      console.error(
        "[v0] VITE_NAVER_MAP_CLIENT_ID is not set. Add it in " +
          "Vercel → Project → Settings → Environment Variables and redeploy. " +
          "Locally, create .env.local with VITE_NAVER_MAP_CLIENT_ID=<key>."
      );
      setState("error");
      setError("Missing VITE_NAVER_MAP_CLIENT_ID env var.");
      return () => {
        window.navermap_authFailure = previousAuthFailure;
      };
    }

    const script = document.createElement("script");
    script.id = NAVER_SCRIPT_ID;
    // Use `ncpKeyId` (NCP Maps post-2024). Do NOT use legacy `ncpClientId`.
    // Domain `oapi.map.naver.com` is the canonical endpoint; the alias
    // `openapi.map.naver.com` also works.
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
      window.navermap_authFailure = previousAuthFailure;
    };
  }, []);

  return { state, error };
}
