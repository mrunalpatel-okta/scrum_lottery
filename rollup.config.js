import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;
const outputDir = 'docs';

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),
		del({ targets: `${outputDir}/*` }),
		copy({
			targets: [
			  { 
				src: 'public/favicon.png', 
				dest: outputDir
			  },
			  { 
				src: 'public/global.css', 
				dest: outputDir
			  },
			  { 
				src: 'public/build/bundle.css', 
				dest: outputDir
			  },
			  { 
				src: 'public/build/bundle.js', 
				dest: outputDir
			  },
			  { 
				src: 'public/index.html', 
				dest: outputDir,
				transform: (contents, filename) => {
					if(filename.match("index.html")) {
						return contents.toString()
						.replace('favicon.png', '/scrum_lottery/favicon.png')
						.replace('global.css', '/scrum_lottery/global.css')
						.replace('/build/bundle.css', '/scrum_lottery/bundle.css')
						.replace('/build/bundle.js', '/scrum_lottery/bundle.js')
						;
					}
					return contents
				} 
			  } // copies all files except `build`
			],
			copyOnce: true
		}),
		
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
