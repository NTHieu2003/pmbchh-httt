// Matches pmbc_web's `Chemical` interface (mophongphattan.component.ts) —
// field names kept identical to the wire contract for easy diffing.
export interface Chemical {
  id?: number;
  name: string;
  cas: string;
  mw: number;
  vp_pa: number;
  vp_ref_K: number | null;
  rho_l: number;
  bp_K: number | null;
  loc_ppm: number;
  loc_src: string;
  // AEGL-1/2/3 exposure limits (ppm) — only present on the 421 chemicals
  // bundled in `simulation/chemData.ts` (CHEM_DB), never on rows the
  // backend `chemical/search` API returns. When present, the simulation
  // renders 3 threat levels instead of the single LOC-based one.
  aegl1_ppm?: number | null;
  aegl2_ppm?: number | null;
  aegl3_ppm?: number | null;
}

export interface ChemicalSearchRequest {
  keyword?: string;
  name?: string;
  cas?: string;
  pageIndex?: number;
  pageSize?: number;
}
