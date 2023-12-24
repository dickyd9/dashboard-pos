import { App } from "vue"
import Dialog from "./Dialog/index"

export default {
  install: (app: App) => {
    // Hanya daftarkan komponen yang diperlukan
    app.component("dxDialog", Dialog)
  },
}
