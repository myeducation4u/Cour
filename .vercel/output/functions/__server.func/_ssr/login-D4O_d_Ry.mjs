import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-TCUao-yz.mjs";
import { r as signIn, t as authClient } from "./client-Fmy7ectF.mjs";
import { n as useCurrentUserState } from "./use-current-user-DdU6lZVa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D4O_d_Ry.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) navigate({ to: "/account" });
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || "COUR client"
				});
				if (res.error) throw new Error(res.error.message || "Could not create account.");
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message || "Could not sign in.");
			}
			await navigate({ to: "/account" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Authentication failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-dvh items-center justify-center px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[1.15rem] border border-line bg-surface/90 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.7rem] tracking-[0.28em]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "COUR"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-6 text-3xl",
					children: "SIGN IN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-mist",
					children: "Accounts hold orders, addresses and the bag across devices."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "cour-btn w-full",
						onClick: () => signIn(p.providerId, { callbackURL: "/account" }),
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-6 flex items-center gap-3 font-mono text-[0.58rem] tracking-[0.16em] text-dim",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
						"OR EMAIL",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit,
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "cour-field",
							placeholder: "NAME",
							value: name,
							onChange: (e) => setName(e.target.value)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "cour-field",
							type: "email",
							required: true,
							placeholder: "EMAIL",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "cour-field",
							type: "password",
							required: true,
							minLength: 8,
							placeholder: "PASSWORD",
							value: password,
							onChange: (e) => setPassword(e.target.value)
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mist",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cour-btn cour-btn-solid w-full",
							type: "submit",
							disabled: busy,
							children: busy ? "WORKING" : mode === "up" ? "CREATE ACCOUNT" : "SIGN IN"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 font-mono text-[0.62rem] tracking-[0.16em] text-mist",
					onClick: () => setMode(mode === "up" ? "in" : "up"),
					children: mode === "up" ? "HAVE AN ACCOUNT? SIGN IN" : "NEW TO COUR? CREATE ACCOUNT"
				})
			]
		})
	});
}
//#endregion
export { Login as component };
