// Matches pmbc_web/pmbc_mobile's SoDoPhongHop — one row per physical
// meeting room/location, keyed to a KHtochuchop via `khp_diadiem === gid`.
export interface SoDoPhongHopItem {
  gid: number;
  diaChi?: string;
  soPhong?: string;
  maSoDo?: string;
}

export interface GetSoDoPhongHopResponse {
  lstSoDoPhongHop?: SoDoPhongHopItem[];
}
