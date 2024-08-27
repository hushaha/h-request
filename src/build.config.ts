import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['index'],
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
		inlineDependencies: true,
		esbuild: {
			target: 'node18',
			minify: true
		}
	}
});
