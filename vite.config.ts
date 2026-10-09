import visualizer from "rollup-plugin-visualizer";
import * as path from "path";

import { loadEnv } from "vite";

// 注册项目插件
import { createVitePlugins } from "./build/vite/plugin";

// 创建本地请求代理服务
import { createProxy } from "./build/vite/proxy";
import { OUTPUT_DIR } from "./build/constant";
import { wrapperEnv } from "./build/utils";

// https://vitejs.dev/config/
process.env.VITE_APP_BUILD_TIME = require("dayjs")().format("YYYY-M-D HH:mm:ss");

export default ({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_PROXY } = viteEnv;

  const isBuild = command === "build";

  let devServerFs: any = {};
  let devAlias: any[] = [];
  if (mode.startsWith("debug")) {
    devAlias = [
      { find: /@fast-crud\/fast-crud\/dist/, replacement: path.resolve("../../fast-crud/src/") },
      { find: /@fast-crud\/fast-extends\/dist/, replacement: path.resolve("../../fast-extends/src/") }
    ];
    devServerFs = {};
  }

  return {
    plugins: createVitePlugins(viteEnv, isBuild),
    optimizeDeps: {},
    esbuild: {
      drop: command === "build" ? ["debugger"] : [],
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    resolve: {
      alias: [
        ...devAlias,
        { find: "/@", replacement: path.resolve("./src") },
        { find: "/#", replacement: path.resolve("./types") }
      ],
      dedupe: ["vue"]
    },
    build: {
      outDir: OUTPUT_DIR,
      rollupOptions: {
        plugins: [visualizer()]
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: VITE_PORT,
      fs: devServerFs,
      proxy: createProxy(VITE_PROXY)
    }
  };
};
