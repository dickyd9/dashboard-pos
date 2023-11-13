<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import { FormSwitch } from "@/base-components/Form"
  import Progress from "@/base-components/Progress"
  import Lucide from "@/base-components/Lucide"
  import StackedBarChart1 from "@/components/StackedBarChart1"
  import SimpleLineChart from "@/components/SimpleLineChart"
  import SimpleLineChart1 from "@/components/SimpleLineChart1"
  import SimpleLineChart2 from "@/components/SimpleLineChart2"
  import { Menu, Tab } from "@/base-components/Headless"
  import { Tab as HeadlessTab } from "@headlessui/vue"
  import { ref } from "vue"
  import DialogUpdateProfile from "./DialogUpdateProfile.vue"
  import DialogResetPassword from "./DialogResetPassword.vue"
  import { useAuthStore } from "@/stores/api/auth-store"

  const authStore = useAuthStore()

  const userData = authStore?.authUser
  const editProfile = ref(false)
  const resetPassword = ref(false)

</script>

<template>
  <Tab.Group>
    <!-- BEGIN: Profile Info -->
    <div class="px-5 pt-5 mt-5 intro-y box">
      <div
        class="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
        <div
          class="flex items-center justify-center flex-1 px-5 lg:justify-start">
          <div
            class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="rounded-full"
              :src="fakerData[0].photos[0]" />
            <div
              class="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary">
              <Lucide icon="Camera" class="w-4 h-4 text-white" />
            </div>
          </div>
          <div class="ml-5">
            <div
              class="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
              {{ `${userData?.firstName} ${userData?.lastName}` }}
            </div>
            <div class="text-slate-500">{{ userData?.role.toUpperCase() }}</div>
          </div>
        </div>
        <div
          class="flex-1 px-5 pt-5 mt-6 border-t border-l lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
          <div class="font-medium text-center lg:text-left lg:mt-3">
            Contact Details
          </div>
          <div
            class="flex flex-col items-center justify-center mt-4 lg:items-start">
            <div class="flex items-center truncate sm:whitespace-normal">
              <Lucide icon="Mail" class="w-4 h-4 mr-2" />
              {{ userData?.email }}
            </div>
            <div class="flex items-center mt-3 truncate sm:whitespace-normal">
              <Lucide icon="Instagram" class="w-4 h-4 mr-2" /> Instagram
              {{ userData?.gender }}
            </div>
            <div class="flex items-center mt-3 truncate sm:whitespace-normal">
              <Lucide icon="Twitter" class="w-4 h-4 mr-2" /> Twitter
              {{ fakerData[0].users[0].name }}
            </div>
          </div>
        </div>
        <div
          class="px-5 pt-5 mt-6 border-t lg:mt-0 lg:border-0 border-slate-200/60 dark:border-darkmode-400 lg:pt-0">
          <Menu class="ml-auto">
            <Menu.Button tag="a" class="block w-5 h-5" href="#">
              <Lucide icon="MoreHorizontal" class="w-5 h-5 text-slate-500" />
            </Menu.Button>
            <Menu.Items class="w-max">
              <Menu.Item
                @click="
                  () => {
                    editProfile = true
                  }
                ">
                <Lucide icon="Pencil" class="w-4 h-4 mr-2" /> Edit Profile
              </Menu.Item>
              <Menu.Item
                @click="
                  () => {
                    resetPassword = true
                  }
                ">
                <Lucide icon="Lock" class="w-4 h-4 mr-2" />
                Reset Password
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <Tab.List
        variant="link-tabs"
        class="flex-col justify-center text-center sm:flex-row lg:justify-start">
        <Tab :fullWidth="false">
          <Tab.Button class="py-4 cursor-pointer">User Info</Tab.Button>
        </Tab>
      </Tab.List>
    </div>
    <!-- END: Profile Info -->
    <Tab.Panels class="mt-5 intro-y">
      <Tab.Panel>
        <div class="grid grid-cols-12 gap-6">
          <!-- BEGIN: Log User -->
          <div class="col-span-12 intro-y box lg:col-span-12">
            <div
              class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 class="mr-auto text-base font-medium">Log User</h2>
            </div>
            <div class="p-5">
              <!-- <div class="flex flex-col sm:flex-row">
                <div class="mr-auto">
                  <a href="" class="font-medium"> Wordpress Template </a>
                  <div class="mt-1 text-slate-500">HTML, PHP, Mysql</div>
                </div>
                <div class="flex">
                  <div class="w-32 mt-5 mr-auto -ml-2 sm:ml-0 sm:mr-5">
                    <SimpleLineChart :height="30" />
                  </div>
                  <div class="text-center">
                    <div class="font-medium">6.5k</div>
                    <div class="bg-success/20 text-success rounded px-2 mt-1.5">
                      +150
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col mt-5 sm:flex-row">
                <div class="mr-auto">
                  <a href="" class="font-medium"> Bootstrap HTML Template </a>
                  <div class="mt-1 text-slate-500">HTML, PHP, Mysql</div>
                </div>
                <div class="flex">
                  <div class="w-32 mt-5 mr-auto -ml-2 sm:ml-0 sm:mr-5">
                    <SimpleLineChart :height="30" />
                  </div>
                  <div class="text-center">
                    <div class="font-medium">2.5k</div>
                    <div class="bg-pending/10 text-pending rounded px-2 mt-1.5">
                      +150
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col mt-5 sm:flex-row">
                <div class="mr-auto">
                  <a href="" class="font-medium"> Tailwind HTML Template </a>
                  <div class="mt-1 text-slate-500">HTML, PHP, Mysql</div>
                </div>
                <div class="flex">
                  <div class="w-32 mt-5 mr-auto -ml-2 sm:ml-0 sm:mr-5">
                    <SimpleLineChart :height="30" />
                  </div>
                  <div class="text-center">
                    <div class="font-medium">3.4k</div>
                    <div class="bg-primary/10 text-primary rounded px-2 mt-1.5">
                      +150
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <!-- END: Log User -->
        </div>
      </Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
  <DialogUpdateProfile
    :modalPreview="editProfile"
    @close="editProfile = false" />

  <DialogResetPassword
    :modalPreview="resetPassword"
    @close="resetPassword = false" />
</template>
