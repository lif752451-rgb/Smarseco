import { createApp } from "vue";
import App from "./App.vue";

// 引入全局样式
import "./style/index.less";
import { setupI18n } from "./i18n";

// 引入全局依赖
import setupGridLayout from "vue-grid-layout";
import { setupGlobDirectives } from "/@/directives";
import { setupRouter } from "/@/router";
import { setupStore } from "/@/store";
import { setupComponents } from "/@/components";
import { setupPlugin } from "/@/plugin";
import "default-passive-events";

async function bootstrap() {
  // 创建应用实例
  const app = createApp(App);

  // 配置路由
  setupRouter(app);

  // 配置存储
  setupStore(app);

  // 配置多语言
  setupI18n(app);

  // 注册全局组件
  setupComponents(app);

  // 注册全局插件
  setupPlugin(app);

  // 注册可视化方法
  setupGridLayout(app);

  // 注册全局指令
  setupGlobDirectives(app);

  app.mount("#app", true);
}

bootstrap();
