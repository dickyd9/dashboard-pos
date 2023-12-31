<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Lucide from "../../base-components/Lucide";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import MobileMenu from "../../components/MobileMenu";
import TopBar from "../../components/TopBar";
import _ from "lodash";
import { useTopMenuStore } from "../../stores/top-menu";
import {
  ProvideForceActiveMenu,
  forceActiveMenu,
  Route,
  FormattedMenu,
  nestedMenu,
  linkTo,
} from "./top-menu";
import { watch, reactive, computed, onMounted, provide } from "vue";

const route: Route = useRoute();
const router = useRouter();
let formattedMenu = reactive<Array<FormattedMenu>>([]);
const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu>) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const topMenuStore = useTopMenuStore();
const topMenu = computed(() => nestedMenu(topMenuStore.menu, route));

provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
  forceActiveMenu(route, pageName);
  setFormattedMenu(topMenu.value);
});

watch(topMenu, () => {
  setFormattedMenu(topMenu.value);
});

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu;
  }
);

onMounted(() => {
  setFormattedMenu(topMenu.value);
});
</script>

<template>
  <div class="py-5 md:py-0">
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <MobileMenu />
    <TopBar layout="top-menu" />
    <!-- BEGIN: Top Menu -->
    <nav
      :class="[
        'top-nav relative z-50 hidden pt-32 -mt-4 md:block',

        // Animation
        'opacity-0 animate-[0.4s_ease-in-out_0.2s_intro-top-menu] animate-fill-mode-forwards',
      ]"
    >
      <ul class="flex flex-wrap px-6 xl:px-[50px]">
        <li v-for="(menu, menuKey) in formattedMenu" :key="menuKey">
          <a
            :href="
              menu.subMenu
                ? '#'
                : ((pageName: string | undefined) => {
                    try {
                      return router.resolve({
                        name: pageName,
                      }).fullPath;
                    } catch (err) {
                      return '';
                    }
                  })(menu.pageName)
            "
            :class="[
              menu.active ? 'top-menu top-menu--active' : 'top-menu',

              // Animation
              {
                [`[&:not(.top-menu--active)]:opacity-0 [&:not(.top-menu--active)]:translate-y-[50px] animate-[0.4s_ease-in-out_0.3s_intro-top-menu] animate-fill-mode-forwards animate-delay-${
                  (menuKey + 1) * 10
                }`]: !menu.active,
              },
            ]"
            @click="(event: MouseEvent) => {
              event.preventDefault();
              linkTo(menu, router);
            }"
          >
            <div class="top-menu__icon">
              <Lucide :icon="menu.icon" />
            </div>
            <div class="top-menu__title">
              {{ menu.title }}
              <Lucide
                v-if="menu.subMenu"
                class="top-menu__sub-icon"
                icon="ChevronDown"
              />
            </div>
          </a>
          <ul
            v-if="menu.subMenu"
            :class="{ 'side-menu__sub-open': menu.activeDropdown }"
          >
            <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
              <a
                :href="
                  subMenu.subMenu
                    ? '#'
                    : ((pageName: string | undefined) => {
                        try {
                          return router.resolve({
                            name: pageName,
                          }).fullPath;
                        } catch (err) {
                          return '';
                        }
                      })(subMenu.pageName)
                "
                class="top-menu"
                @click="(event: MouseEvent) => {
                  event.preventDefault();
                  linkTo(subMenu, router);
                }"
              >
                <div class="top-menu__icon">
                  <Lucide :icon="subMenu.icon" />
                </div>
                <div class="top-menu__title">
                  {{ subMenu.title }}
                  <Lucide
                    v-if="subMenu.subMenu"
                    class="top-menu__sub-icon"
                    icon="ChevronDown"
                  />
                </div>
              </a>
              <ul
                v-if="subMenu.subMenu"
                :class="{ 'side-menu__sub-open': subMenu.activeDropdown }"
              >
                <li
                  v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                  :key="lastSubMenuKey"
                >
                  <a
                    :href="
                      lastSubMenu.subMenu
                        ? '#'
                        : ((pageName: string | undefined) => {
                            try {
                              return router.resolve({
                                name: pageName,
                              }).fullPath;
                            } catch (err) {
                              return '';
                            }
                          })(lastSubMenu.pageName)
                    "
                    class="top-menu"
                    @click="(event: MouseEvent) => {
                      event.preventDefault();
                      linkTo(lastSubMenu, router);
                    }"
                  >
                    <div class="top-menu__icon">
                      <Lucide :icon="lastSubMenu.icon" />
                    </div>
                    <div class="top-menu__title">
                      {{ lastSubMenu.title }}
                    </div>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <!-- END: Top Menu -->
    <!-- BEGIN: Content -->
    <div
      :class="[
        'max-w-full md:max-w-none rounded-[30px] md:rounded-[35px_35px_0_0] px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 pb-10 mt-5 relative dark:bg-darkmode-700',
        'before:content-[\'\'] before:w-full before:h-px before:block',
      ]"
    >
      <RouterView />
    </div>
    <!-- END: Content -->
  </div>
</template>
