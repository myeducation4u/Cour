import { r as createServerFn } from "./ssr.mjs";
import { h as createSsrRpc } from "./router-PwxNvrjr.mjs";
import { t as authMiddleware } from "./middleware-DA70zXJk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-DRpAKHm0.js
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3d504ad47cf26f6058e8d5f7055d28aafb29ac9b3324490542dad038cc9237e6"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("31ee80267b1463c290fbb93f3dfcc83c8c9fb449cc7b3995c82f1a1d2bc24140"));
var listMyAddresses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("36dcab8cc1a06d7e71106dff705d1fcf1e3bada5136e6e7193d2b217aaeef43f"));
var saveAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("118760e18905b9f60eb2b0fad82e5b7b27a3af82f24de61165d99fdc2703c3f3"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("9948bfb51ecb067a70b814031ef10de5a66044c1fabade56ffff63e04dab8c28"));
var listWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4b645835d28d4ddb96759bbccf83508fb31d715eb81bcd47741d207154715ecc"));
var toggleWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((productId) => productId).handler(createSsrRpc("903e3c45616728bef2bdf44aad337f49c5029e0c98ed9997e7a4b92aa36218f1"));
var placeOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("20b040908bc9c9520b9c9b9e6ba18ced100adfac598cf962ecb813cd10188e1d"));
//#endregion
export { saveAddress as a, placeOrder as i, listMyOrders as n, toggleWishlist as o, listWishlist as r, listMyAddresses as t };
