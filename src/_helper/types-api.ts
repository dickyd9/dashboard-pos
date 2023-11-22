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
  itemCode: string
  itemName: string
  itemPrice: number
  itemPoint: number
  itemStatus: string
  createdAt: Date
}

export interface IServiceInput {
  itemName: string
  itemPrice: number
  itemType: string
  itemPoint: number
  itemStatus: string
  createdAt: Date
}

export interface ITask {
  _id: string
  employeeCode: string
  transactionRef: string
  serviceCode: string
  createdAt: Date
}

interface IEmployeeTask {
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

export interface IEmployeeInput {
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
  customerName: string
  customerAddress: string
  customerEmail: string
  customerDOB: Date
  customerContact: number
  customerGender: string
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

export interface ILoginInput {
  username: string | undefined
  password: string | undefined
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
