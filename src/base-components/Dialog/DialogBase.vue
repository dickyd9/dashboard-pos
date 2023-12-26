<script lang="ts">
  export default {
    inheritAttrs: false,
  }
</script>

<script lang="ts" setup>
  import { ElMessageBox } from "element-plus"
  import { InputHTMLAttributes, Ref, computed, provide, ref } from "vue"

  export type ProvideDialog = {
    isOpen: boolean
    withConfirm: boolean
    title: Ref<string>
  }

  interface DialogProps extends /* @vue-ignore */ InputHTMLAttributes {
    isOpen?: boolean
    withConfirm?: boolean
    title: string
  }

  const props = withDefaults(defineProps<DialogProps>(), {
    isOpen: false,
    withConfirm: false,
  })

  const openDialog = computed(() => props.isOpen)
  const dialogConfirm = computed(() => props.withConfirm)
  const title = ref(props.title)

  const emit = defineEmits<{
    (e: "close", value: boolean): void
  }>()

  provide<ProvideDialog>("dialog", {
    isOpen: openDialog.value,
    withConfirm: dialogConfirm.value,
    title: title,
  })

  const handleClose = (done: () => void) => {
    if (props.withConfirm) {
      ElMessageBox.confirm("Are you sure to close this dialog?")
        .then(() => {
          done()
          emit("close", false)
        })
        .catch(() => {
          // catch error
        })
    } else {
      emit("close", false)
      done()
    }
  }
</script>
<template>
  <el-dialog
    :modelValue="isOpen"
    :title="title"
    destroy-on-close
    width="30%"
    center
    :before-close="handleClose">
    <span>
      It should be noted that the content will not be aligned in center by
      default
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">Cancel</el-button>
        <el-button type="primary" @click="emit('close', false)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>
