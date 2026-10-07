// Web path of the feature the user is currently on (e.g.
// /system/dashboarduser). The backend attributes each logged action to a
// feature through the `X-Feature-Url` request header (spec CN124) — without
// it, actions done from the app are still logged but never show up in the
// "Top 10 chức năng" statistics. Set by the navigator on every route change,
// read by the axios request interceptor.
let currentFeatureUrl: string | null = null;

export const setCurrentFeatureUrl = (url: string | null): void => {
  currentFeatureUrl = url;
};

export const getCurrentFeatureUrl = (): string | null => currentFeatureUrl;
