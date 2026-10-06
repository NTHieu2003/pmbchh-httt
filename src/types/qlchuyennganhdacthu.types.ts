// Wire-level shape — field names kept exactly as the backend/web contract
// (`QlchuyennganhdacthuDetail` in pmbc_web's qlchuyennganhdacthu service)
// instead of camelCased, so a captured network payload can be diffed
// against this type directly when debugging.
export interface QlChuyenNganhDacThu {
  gid: number;
  ten: string;
  viet_tat?: string;
  mo_ta?: string;
  time_create?: string;
  user_create?: number;
  user_createST?: number;
}
