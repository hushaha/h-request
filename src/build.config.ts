import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['index'],
	clean: true,
	declaration: 'node16',
	rollup: {
		inlineDependencies: true,
		esbuild: {
			target: 'node18',
			minify: true
		}
	}
});
