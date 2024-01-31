import ItemList from "@/pages/itemProduct/ItemList.vue"
import ServiceList from "../pages/itemService/ServiceList.vue"
import ServiceItem from "@/pages/itemProduct/ServiceItem.vue"
import DetailService from "@/pages/itemService/DetailService.vue"

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
  // {
  //   path: "/serviceItem",
  //   name: "ServiceItem",
  //   component: ServiceItem,
  // },
  {
    path: "/detail-service",
    name: "DetailService",
    component: DetailService,
  },
]
