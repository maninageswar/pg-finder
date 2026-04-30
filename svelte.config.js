import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},

	vitePlugin: {
		// this plugin is used to directly open the svelte component in the editor when clicking on the component
		// in the browser (dev mode only) just run the application in dev mode click and hold option + x (for mac)
		// or alt + x (for windows) then you will see a orange border around the elements just click on the element
		// to open the file in the editor that is responsible for that element in the browser
		inspector:true,
	}
};

export default config;
