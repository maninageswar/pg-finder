// reason why this file is created in the first place 

// problem : as we know how sveltekit renders the page let's say when you directly hit the url /bookPropertyRoom/diss82vgw1h65mp(http://localhost:5173/bookPropertyRoom/diss82vgw1h65mp)
// sveltekit renders bookPropertyRoom/[id] first in server and sends the rendered page to client. But here in +page.svelte of bookPropertyRoom/[id] we are using sessionStorage which can
// only be accessed in client side. So when sveltekit tries to access sessionStorage in server side it throws error and page fails to load. To avoid this we can disable server side 
// rendering for this page by creating +page.js file and exporting ssr as false from it. By doing this sveltekit will only render this page in client side and we can safely access 
// sessionStorage without any error.

export const ssr = false;