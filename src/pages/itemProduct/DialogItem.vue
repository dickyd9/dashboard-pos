<script setup lang="ts">
  import { ref, defineProps, toRefs, reactive, watch } from "vue"
  import {
    FormLabel,
    FormSwitch,
    FormInput,
    FormSelect,
  } from "@/base-components/Form"
  import { Menu, Dialog } from "@/base-components/Headless"
  import Button from "@/base-components/Button"
  import Lucide from "@/base-components/Lucide"
  import {
    required,
    minLength,
    maxLength,
    email,
    url,
    integer,
    numeric,
    requiredIf,
  } from "@vuelidate/validators"
  import { useVuelidate } from "@vuelidate/core"
  import { IProductInput, IService, IServiceInput } from "@/_helper/types-api"
  import { toast } from "vue3-toastify"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"

  const props = defineProps({
    modalPreview: Boolean,
    isEdit: Boolean,
    data: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const formData = reactive<IProductInput>({
    _id: "",
    itemCode: "",
    itemName: "",
    itemPrice: 0,
    itemUnit: "",
    itemAmount: 0,
    createdAt: new Date(),
  })

  const initialFormData = { ...formData }

  const rules = {
    itemName: {
      required,
    },
    itemPrice: {
      required,
      numeric,
    },
    itemUnit: {
      required,
    },
  }

  watch(props, (newValue: any): any => {
    if (newValue.isEdit) {
      formData.itemCode = newValue?.data.itemCode || ""
      formData.itemName = newValue?.data.itemName || ""
      formData.itemPrice = newValue?.data.itemPrice || 0
      formData.itemUnit = newValue?.data.itemUnit || ""
      formData.itemAmount = newValue?.data.itemAmount || 0
      formData.createdAt = newValue?.data.createdAt || new Date()
    }
  })

  const closeModal = () => {
    validate.value.$reset()
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  const validate = useVuelidate(rules, toRefs(formData))
  const onSubmit = async () => {
    validate.value.$touch()
    if (validate.value.$invalid) {
      toast.error("error")
    } else {
      try {
        const saveData = {
          itemName: formData.itemName,
          itemPrice: formData.itemPrice,
          itemType: 'product',
          itemCategory: 'item',
          itemUnit: formData.itemUnit,
          itemAmount: formData.itemAmount,
        }
        if (props.isEdit) {
          const itemId = props.data?._id
          const response = await fetchWrapper.put(`item/${itemId}`, saveData)
          toast.success(response.message)
          validate.value.$reset()
          emit("update")
          Object.assign(formData, initialFormData)
        } else {
          const response = await fetchWrapper.post("item", saveData)
          toast.success(response.message)
          validate.value.$reset()
          emit("update")
          Object.assign(formData, initialFormData)
        }
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }

  const sendButtonRef = ref(null)
</script>

<template>
  <Dialog
    :open="props.modalPreview"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          {{ props.isEdit ? "Edit Item" : "Add Item" }}
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Nama Item
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.itemName.$model"
              type="text"
              name="itemName"
              :class="{
                'border-danger': validate.itemName.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.itemName.$error">
              <div
                v-for="(error, index) in validate.itemName.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Satuan
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.itemUnit.$model"
              type="text"
              name="itemUnit"
              :class="{
                'border-danger': validate.itemUnit.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.itemUnit.$error">
              <div
                v-for="(error, index) in validate.itemUnit.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Harga
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.itemPrice.$model"
              type="number"
              name="itemPrice"
              :class="{
                'border-danger': validate.itemPrice.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.itemPrice.$error">
              <div
                v-for="(error, index) in validate.itemPrice.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
