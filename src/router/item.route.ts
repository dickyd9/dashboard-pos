import ItemList from "@/pages/itemProduct/ItemList.vue"
import ServiceList from "../pages/itemService/ServiceList.vue"
import ServiceItem from "@/pages/itemProduct/ServiceItem.vue"

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
  {
    path: "/serviceItem",
    name: "ServiceItem",
    component: ServiceItem,
  },
]
