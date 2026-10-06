// Matches pmbc_web's `/user/detail` response shape (FeaturesResolve →
// `res.detail`) — only the fields mobile actually needs so far (`userId`
// is required for chatbot conversation search/star/pin calls).
export interface UserDetail {
  userId: number;
  username?: string;
  fullname?: string;
  [key: string]: unknown;
}
