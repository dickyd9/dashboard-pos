import { defineStore } from "pinia"
import { Icon } from "../base-components/Lucide/Lucide.vue"

export interface Menu {
  icon: Icon
  title: string
  pageName?: string
  subMenu?: Menu[]
  ignore?: boolean
}

export interface SideMenuState {
  menu: Array<Menu | "divider">
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "Home",
        pageName: "Dashboard",
        title: "Dashboard",
      },
      {
        icon: "User",
        pageName: "Employee List",
        title: "Karyawan",
      },
      {
        icon: "Inbox",
        pageName: "Service",
        title: "Service",
      },
      {
        icon: "FileText",
        pageName: "Report",
        title: "Report",
        subMenu: [
          {
            icon: "FileText",
            pageName: "Report Karyawan",
            title: "Report Karyawan",
          },
          {
            icon: "FileText",
            pageName: "Report Service",
            title: "Report Service",
          },
          {
            icon: "FileText",
            pageName: "Report Transaksi",
            title: "Report Transaksi",
          },
          {
            icon: "FileText",
            pageName: "Report Keuangan",
            title: "Report Pengeluaran",
          },
        ],
      },
      {
        icon: "User",
        pageName: "Customer List",
        title: "Customer",
      },
      {
        icon: "Archive",
        pageName: "Product",
        title: "Item",
      },
      {
        icon: "Settings",
        pageName: "Master",
        title: "Master",
        subMenu: [
          {
            icon: "Grid",
            pageName: "Category List",
            title: "Categori Service",
          },
        ],
      },
    ],
  }),
})
