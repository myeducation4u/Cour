//#region node_modules/.nitro/vite/services/ssr/assets/format-BUKntx01.js
function money(cents, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(cents / 100);
}
//#endregion
export { money as t };
