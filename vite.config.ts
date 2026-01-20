import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // 允许在客户端代码中使用 process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});