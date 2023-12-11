export interface IUser {
  _id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  role: string
  gender: string
}

export interface IUserInput {
  firstName: string
  lastName: string
  email: string
  role: string
  gender: string
}

export interface IPasswordInput {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// Service Interface
export interface IService {
  _id: string
  servicesCode: string
  servicesName: string
  servicesPrice: number
  servicesCategory: string
  servicesPoint: number
  servicesStatus: string
  createdAt: Date
}

export interface IServiceCategory {
  _id: string
  categoryCode: string
  categoryName: string
  totalService: number
  createdAt: Date
}

export interface IServiceInput {
  _id: string
  servicesName: string
  servicesPrice: number
  servicesCategory: string
  servicesPoint: number
  servicesStatus: string
  createdAt: Date
}

export interface IServiceCategoryInput {
  _id: string
  categoryName: string
}

// Product Interface
export interface IProduct {
  _id: string
  itemCode: string
  itemName: string
  itemUnit: string
  itemPrice: number
  itemAmount: number
  createdAt: Date
}

export interface IProductInput {
  _id: string
  itemCode: string
  itemName: string
  itemUnit: string
  itemPrice: number
  itemAmount: number
  createdAt: Date
}

export interface ITask {
  _id: string
  employeeCode: string
  transactionRef: string
  serviceCode: string
  createdAt: Date
}

export interface IEmployeeTask {
  taskFinished: string
  task: ITask[]
}

// Employee Interface
export interface IEmployee {
  _id: string
  employeeCode: string
  employeeName: string
  employeeAddress: string
  employeeContact: number
  employeeJoinDate: Date | string | undefined
  employeeGender: string
  employeeTask: string[]
  report: IEmployeeTask | undefined
  createdAt: Date
}

export interface IEmployeeDialog {
  _id: string
  employeeCode: string
  employeeName: string
  employeeAddress: string
  employeeContact: number
  employeeJoinDate: Date | string | undefined
  employeeGender: string
  createdAt: Date
}

export interface IEmployeeInput {
  _id: string
  employeeName: string
  employeeAddress: string
  employeeContact: number
  employeeJoinDate: Date
  employeeGender: string
  createdAt: Date
}

// Customer Interface
export interface ICustomer {
  _id: string
  customerCode: string
  customerName: string
  customerAddress: string
  customerEmail: string
  customerDOB: Date
  customerContact: number
  customerGender: string
  createdAt: Date
}

export interface ICustomerInput {
  _id: string
  customerName: string
  customerAddress: string
  customerEmail: string
  customerDOB: Date
  customerContact: number
  customerGender: string
  createdAt: Date
}

// Report Interface
export interface IExpenses {
  description: string
  note: string
  amount: string
  price: string
  createdAt: Date
}

export interface IExpensesInput {
  description: string
  note: string
  amount: number
  price: number
}

export interface IReportIncome {
  month: string
  year: string
  totalIncome: number
  totalExpense: number
  summary: number
}

export interface IReportPayment {
  DEBIT?: number
  CASH?: number
  TRANSFER?: number
  OTHER?: number
}

export interface IReportTransaction {
  invoice: string
  paymentCode: string
  customerName: string
  totalPrice: number
  totalPoint: number
  totalAmount: number
  paymentMethod: string
  paymentAmount: number
  paymentStatus: string
  changeAmount: number
  paymentDate: string
  totalItems: number
}

export interface IReportService {
  itemName: string
  amountUsed: number
  pointUsed: number
  itemCode: string
  totalPrice: number
}

export interface IReportEmployee {
  employeeCode: string
  employeeName: string
  employeeTaskUsed: number
  transaction: object[]
}

// Auth interface

export interface ILoginInput {
  username: string | undefined
  password: string | undefined
}

// Dashboard Interface
export interface ILastTransaction {
  invoice: string
  paymentCode: string
  customerName: string
  totalPrice: number
  totalPoint: number
  paymentDate: string
}

export interface GenericResponse {
  statusCode: string
  message: string
  error: string
}

export interface ISignUpInput {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export interface ILoginResponse {
  status: string
  access_token: string
}

export interface ISignUpResponse {
  status: string
  message: string
}

export interface IUserResponse {
  status: string
  data: {
    user: IUser
  }
}

export interface IPaginate {
  totalItems: number
  totalPages: number
  itemsPerPage: number
  currentPage: number
}

export const monthBase = [
  {
    month: 1,
    name: "Januari",
  },
  {
    month: 2,
    name: "February",
  },
  {
    month: 3,
    name: "March",
  },
  {
    month: 4,
    name: "April",
  },
  {
    month: 5,
    name: "May",
  },
  {
    month: 6,
    name: "June",
  },
  {
    month: 7,
    name: "July",
  },
  {
    month: 8,
    name: "August",
  },
  {
    month: 9,
    name: "September",
  },
  {
    month: 10,
    name: "October",
  },
  {
    month: 11,
    name: "November",
  },
  {
    month: 12,
    name: "December",
  },
]
