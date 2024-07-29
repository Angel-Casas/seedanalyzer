import { createApp, provide, h } from "vue"
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";


const app = createApp({
    setup() {
    },
    render: () => h(App),
})

app.use(createPinia());
app.use(router);
app.use(VueApexCharts);

app.mount("#App");
