import EmployeeList from "../pages/employee/EmployeeList.vue"
import AssignEmployee from "../pages/employee/AssignEmployee.vue"
import DetailEmloyee from "../pages/employee/EmployeeDetail.vue"

export default [
  {
    path: "/list-employee",
    name: "Employee List",
    component: EmployeeList,
  },
  {
    path: "/detail-employee/:code",
    name: "Employee Detail",
    component: DetailEmloyee,
  },
]
