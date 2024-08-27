import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:4523/m1/5061126-4722382-default/',
				changeOrigin: false,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
