import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";

const app =createApp(App)

router.beforeEach((to, _unused, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  if (to.meta.description) {
    let tag = document.querySelector('meta[name="description"]');
    if (tag) {
      tag.setAttribute('content', to.meta.description as string);
    } else {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      tag.setAttribute('content', to.meta.description as string);
      document.head.appendChild(tag);
    }
  }

  next();
});


app.use(router);
app.mount('#app');
