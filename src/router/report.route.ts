import ExpensesReport from "@/pages/report/incomeEx/ExpensesReport.vue"
import ServiceReport from "../pages/report/services/ServiceReport.vue"
import TransactionReport from "../pages/report/transaction/TransactionReport.vue"
import DetailTransaction from "@/pages/report/transaction/DetailTransaction.vue"
import EmployeeReport from "@/pages/report/employee/EmployeeReport.vue"

export default [
  {
    path: "/service",
    name: "Service",
    component: ServiceReport,
  },
  {
    path: "/service-report",
    name: "Report Service",
    component: ServiceReport,
  },
  {
    path: "/employee-report",
    name: "Report Karyawan",
    component: EmployeeReport,
  },
  {
    path: "/transaction-report",
    name: "Report Transaksi",
    component: TransactionReport,
  },
  {
    path: "/transaction-detail/:code",
    name: "Detail Transaksi",
    component: DetailTransaction,
  },
  {
    path: "/expenses",
    name: "Report Keuangan",
    component: ExpensesReport,
  },
]
