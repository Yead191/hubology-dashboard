/**
 * Maps backend notification paths and refIds to in-app router paths.
 * The API returns varied shapes such as:
 *  - `/user/6ad1b9bdffd6ee03325e8878`
 *  - `/vendor/profile/6a4e27433c8dccc51692e6af`
 *  - `/partners` (with refId: `6a8941d6dee692dd845b5b9c`)
 *  - `/refunds` (with refId: `6a87e4c0d9882798d36d418c`)
 *  - `/services/bookings`
 *  - `/dashboard/orders`
 *  - `/dashboard/subscriptions`
 */

const STATIC_PATH_MAP: Record<string, string> = {
  "/": "/",
  "/dashboard": "/",
  "/bookings": "/services/bookings",
  "/services/bookings": "/services/bookings",
  "/services": "/services",
  "/vendors": "/vendors",
  "/vendor": "/vendors",
  "/users": "/users",
  "/user": "/users",
  "/store": "/store",
  "/orders": "/store/orders",
  "/store/orders": "/store/orders",
  "/coupons": "/store/coupons",
  "/store/coupons": "/store/coupons",
  "/refunds": "/store/refunds",
  "/store/refunds": "/store/refunds",
  "/membership": "/membership",
  "/subscriptions": "/membership",
  "/membership/faq": "/membership/faq",
  "/transactions": "/transactions",
  "/forum": "/forum",
  "/community": "/forum",
  "/testimonials": "/testimonials",
  "/events": "/events",
  "/partners": "/partners",
  "/inquiries": "/inquiries",
  "/inquiry": "/inquiries",
  "/notifications": "/notifications",
  "/profile": "/profile",
  "/ifundayiti": "/ifundayiti",
  "/ifundayiti/applications": "/ifundayiti/applications",
  "/ifundayiti/periods": "/ifundayiti/periods",
  "/ifundayiti/donations": "/ifundayiti/donations",
};

export function resolveNotificationPath(
  path?: string | null,
  refId?: string | null
): string | null {
  if (!path?.trim()) {
    return null;
  }

  let cleaned = path.trim().replace(/\/+$/, "") || "/";

  // Normalize by stripping /dashboard prefix if present
  if (cleaned.startsWith("/dashboard/")) {
    cleaned = cleaned.slice("/dashboard".length) || "/";
  } else if (cleaned === "/dashboard") {
    cleaned = "/";
  }

  // 1. Refunds with refId or specific id in path
  if (cleaned === "/refunds" || cleaned === "/store/refunds") {
    if (refId && typeof refId === "string") {
      return `/store/refunds/${refId}`;
    }
    return "/store/refunds";
  }
  const refundDetailMatch = cleaned.match(/^\/(?:store\/)?refunds\/([a-zA-Z0-9_-]+)$/);
  if (refundDetailMatch) {
    return `/store/refunds/${refundDetailMatch[1]}`;
  }

  // 2. Partners with refId or specific id in path
  if (cleaned === "/partners") {
    if (refId && typeof refId === "string") {
      return `/partners/${refId}`;
    }
    return "/partners";
  }
  const partnerDetailMatch = cleaned.match(/^\/partners\/([a-zA-Z0-9_-]+)$/);
  if (partnerDetailMatch) {
    return `/partners/${partnerDetailMatch[1]}`;
  }

  // 3. User details: /user/:id, /users/:id, /user/profile/:id
  const userMatch = cleaned.match(/^\/users?(\/profile)?\/([a-zA-Z0-9_-]+)$/);
  if (userMatch) {
    const userId = userMatch[2];
    return `/users/${userId}`;
  }

  // 4. Vendor profile: /vendor/profile/:id, /vendor/:id, /vendors/:id -> /vendors
  if (cleaned.match(/^\/vendors?(\/profile)?(\/[a-zA-Z0-9_-]+)?$/)) {
    return "/vendors";
  }

  // 5. Orders: /orders or /store/orders
  const orderDetailMatch = cleaned.match(/^\/(?:store\/)?orders\/([a-zA-Z0-9_-]+)$/);
  if (orderDetailMatch && orderDetailMatch[1]) {
    return `/store/orders/${orderDetailMatch[1]}`;
  }
  if (cleaned.startsWith("/orders") || cleaned.startsWith("/store/orders")) {
    return "/store/orders";
  }

  // 6. Coupons
  if (cleaned.startsWith("/coupons") || cleaned.startsWith("/store/coupons")) {
    return "/store/coupons";
  }

  // 7. Services & Bookings
  if (cleaned.startsWith("/services/bookings") || cleaned === "/bookings") {
    return "/services/bookings";
  }
  if (cleaned.startsWith("/services")) {
    return "/services";
  }

  // 8. Membership subscribers & subscriptions
  const membershipSubMatch = cleaned.match(/^\/membership\/([a-zA-Z0-9_-]+)\/subscribers$/);
  if (membershipSubMatch) {
    return `/membership/${membershipSubMatch[1]}/subscribers`;
  }
  if (cleaned === "/subscriptions") {
    return "/membership";
  }

  // 9. Forum post detail
  const forumMatch = cleaned.match(/^\/forum\/([a-zA-Z0-9_-]+)$/);
  if (forumMatch) {
    return `/forum/${forumMatch[1]}`;
  }

  // 10. Event detail
  const eventMatch = cleaned.match(/^\/events\/([a-zA-Z0-9_-]+)$/);
  if (eventMatch) {
    return `/events/${eventMatch[1]}`;
  }

  // 11. Check static map
  if (STATIC_PATH_MAP[cleaned]) {
    return STATIC_PATH_MAP[cleaned];
  }

  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}
