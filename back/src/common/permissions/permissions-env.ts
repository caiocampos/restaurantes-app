export const acceptVisitors = (): boolean =>
  process.env.ENABLE_VISITORS === "true";

export const visitorUsername = (): string =>
  process.env.VISITORS_USERNAME ?? "visitor";
