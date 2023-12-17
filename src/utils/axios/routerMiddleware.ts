import { useAuthStore } from "@/stores/api/auth-store"
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router"
import { toast } from "vue3-toastify"

export const requireAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore()

  if (
    authStore.isAuth &&
    authStore.access_token &&
    authStore.authUser?.role === "owner"
  ) {
    next()
  } else {
    next("/login")
  }
}
