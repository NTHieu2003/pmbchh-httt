// Matches pmbc_web's DepartmentService.getListDepartment() response item —
// only the fields the "Tiến độ dữ liệu" stats screen needs.
export interface DepartmentItem {
  departmentCode: string;
  departmentName: string;
}
