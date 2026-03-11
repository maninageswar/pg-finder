export async function load({ params, locals, depends }) {
    // here if i am using depends then i must be using invalidate why have i used this depends and invalidate i have
    // given the provision to the users that they can directly see the home page with out any autherization(login)
    // here you can see this load function returns pgInventories and user. now this user details i am accessing in .svelte
    // files of pgProperty page and bookPropertyRoom page so when an unauthorized user hits the home url directly this load
    // function runs once and since every other page is a child of this page(home) so if we navige to any child pages 
    // this load function won't run. so when user navigates to login page(which is a chlid page) and logged in this load 
    // function won't and it won't set the user even though user is logged in so now when the user is logged in and tries
    // to click the "book room" button at pgProperty page where the user(user goes form this load function) is user it will
    // be null and he will be redirected to login (according to the condition that is given in that book room button) even 
    // though the user is logged in

    // so to fix this issue whenever user is logged in i am redirecting the user form login page to home page there before 
    // navigating to home page i invaidated this load function which means this load function will run again there by fetching
    // the user(locals.user) data. so that the child pages where this user is used they can access it
    depends('app:home');
    try {
        const pgInventories = await locals.pb.collection('pgProperties').getList(1, 50);
        return {pgInventories, user : locals.user};
    } catch (err) {
        console.error("Failed to create record:", err.response?.data || err.message);
    }
}