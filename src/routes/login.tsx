import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — COUR" }] }),
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/account" });
    }
  }, [isPending, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || "COUR client" });
        if (res.error) throw new Error(res.error.message || "Could not create account.");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in.");
      }
      await navigate({ to: "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16" data-ready="true">
      <div className="w-full max-w-md rounded-[1.15rem] border border-line bg-surface/90 p-6">
        <p className="font-mono text-[0.7rem] tracking-[0.28em]">
          <Link to="/">COUR</Link>
        </p>
        <h1 className="cour-display mt-6 text-3xl">SIGN IN</h1>
        <p className="mt-2 text-sm text-mist">
          Accounts hold orders, addresses and the bag across devices.
        </p>
        {isPending ? <p className="mt-4 font-mono text-[0.62rem] tracking-[0.16em] text-mist">CHECKING SESSION</p> : null}

        {authEnabled ? (
          <div className="mt-6 space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                className="cour-btn w-full"
                disabled={busy || isPending}
                onClick={() => signIn(p.providerId, { callbackURL: "/account" })}
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-mist">Sign-in is disabled.</p>
        )}

        <div className="my-6 flex items-center gap-3 font-mono text-[0.58rem] tracking-[0.16em] text-dim">
          <span className="h-px flex-1 bg-line" />
          OR EMAIL
          <span className="h-px flex-1 bg-line" />
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          {mode === "up" ? (
            <input
              className="cour-field"
              placeholder="NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : null}
          <input
            className="cour-field"
            type="email"
            required
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="cour-field"
            type="password"
            required
            minLength={8}
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? (
            <p className="text-sm text-mist" role="alert">
              {error}
            </p>
          ) : null}
          <button className="cour-btn cour-btn-solid w-full" type="submit" disabled={busy || isPending}>
            {busy ? "WORKING" : mode === "up" ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>
        </form>
        <button
          type="button"
          className="mt-4 font-mono text-[0.62rem] tracking-[0.16em] text-mist"
          onClick={() => setMode(mode === "up" ? "in" : "up")}
        >
          {mode === "up" ? "HAVE AN ACCOUNT? SIGN IN" : "NEW TO COUR? CREATE ACCOUNT"}
        </button>
      </div>
    </main>
  );
}
