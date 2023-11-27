import ItemList from "@/pages/itemProduct/ItemList.vue"
import ServiceList from "../pages/itemService/ServiceList.vue"

export default [
  {
    path: "/itemService",
    name: "Service",
    component: ServiceList,
  },
  {
    path: "/itemProduct",
    name: "Product",
    component: ItemList,
  },
]
