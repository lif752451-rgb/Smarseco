import vue from "@vitejs/plugin-vue";
import { PluginOption } from "vite";

// 注册setup name语法增强
import vueSetupExtend from "vite-plugin-vue-setup-extend";

// 引入svg精灵图
import { configSvgIconsPlugin } from "./svgSprite";

import DefineOptions from "unplugin-vue-define-options/vite";

import vueJsx from "@vitejs/plugin-vue-jsx";

export function createVitePlugins(viteEnv: any, isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueSetupExtend()];

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild) as any);

  vitePlugins.push(vueJsx());

  vitePlugins.push(DefineOptions());

  return vitePlugins;
}