"use client";

// Next.js 16 enforces that global-error.tsx MUST be a Client Component.
// The prerender crash (useContext null) is caused by Turbopack loading two
// separate React instances in the same worker. The fix is npm overrides in
// package.json forcing a single React copy — see package.json "overrides".
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#0f172a",
          color: "#f1f5f9",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
            padding: "2rem",
            background: "#1e293b",
            borderRadius: "1rem",
            border: "1px solid #334155",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ color: "#f1f5f9", marginBottom: "0.5rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            {error?.message ?? "An unexpected application error occurred."}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
