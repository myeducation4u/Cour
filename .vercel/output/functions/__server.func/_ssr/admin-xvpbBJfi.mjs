import { r as createServerFn } from "./ssr.mjs";
import { h as createSsrRpc } from "./router-PwxNvrjr.mjs";
import { t as authMiddleware } from "./middleware-DA70zXJk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-xvpbBJfi.js
var getAdminContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6785b65249ae7a357fc002a9a5a6c8bfc334c51ca1cafe4a5f51e1449dd1a974"));
var claimOwner = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("2569cb9fd1cdd89c764f9d63f1a7a8b11dacd8de1b98fddc87ea8f03ace52c9e"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a4d1e1a0fbd35f1887b311ded858b2b2fa1a387726501a02ca3b8473cc2c267a"));
var adminListProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e44d25be80bce2b94deb72faf36c4882bfe3911806ab70b7b500f221420cd68e"));
var adminGetProduct = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("da2592303af7514e03a8e9adc368aee03bb07ba8862d4c0f79a779e9c2af160a"));
var adminSaveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d1945e7f257482ecf2137acde558fe8edd242c8fb898534842dc62c930a26d2d"));
var adminSaveVariantInventory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("db4ee78daf3fe4663b15bc3b7badebb0e1e8cfbea5e3c75d779cd95da8ddf541"));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("588d427c5c6a9bd05e1014cec0ec3321b2ef1da275509094279b6af46ea31f4e"));
var adminSetOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d06a2085b8985be9b44fcbcd5650878b527207e5da9ab4f784c8022dfc0d2c64"));
var adminListContent = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("272a7cc43c9a843d452eaef84432c367b26064af282a9df0af1ae2ed88396a35"));
var adminSaveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4559ed6bf9a7b05c02163e5741d4be1b6008bb0bb52c25c4782cb2fe0f4383ca"));
var adminSaveSection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3f599be4a71e5d5f4353973a95c4baabc8b542a9f1e2ed2e8666fad1708ac1e0"));
var adminSaveFaq = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a3b6ccf6923a1cbfc48df269a1b943f3f1d80978a1bc6cea86967df55c4af210"));
var adminSaveNav = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7bb4cc419eb72376ffb6d74ad0a75feaa6ce3525713214a73a8bc5496aa25270"));
var adminSavePolicy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5179a80b7064c5c2f8a8ca9da535294dcaa47ae267b6bbc71274d1ce71c94ffb"));
var adminSaveMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e39a5b83f58cfc803d396602f1bbc5179816d3ba7874f3ceb6a6473fc00453d5"));
var adminAddMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5faf31c818a0b8295ca023b283b1a43a7911e51ac93eb19d0dd2dbb4326e8a4e"));
//#endregion
export { getDashboard as _, adminListProducts as a, adminSaveNav as c, adminSaveSection as d, adminSaveSettings as f, getAdminContext as g, claimOwner as h, adminListOrders as i, adminSavePolicy as l, adminSetOrderStatus as m, adminGetProduct as n, adminSaveFaq as o, adminSaveVariantInventory as p, adminListContent as r, adminSaveMedia as s, adminAddMedia as t, adminSaveProduct as u };
