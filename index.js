const BASE_URL = "https://calm-math-effa.cf-api.workers.dev/"
const LINKS = "links"

addEventListener('fetch', event => {
    console.log(`Received new request: ${event.request.url}`)
    event.respondWith(handleRequest(event.request))
})


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

    if(request.url.equals(BASE_URL+LINKS)){
        const links = [{ "name": "Link Name", "url": "https://linkurl" },
            { "name": "Link Name", "url": "https://linkurl" },
            { "name": "Link Name", "url": "https://linkurl" }]

        const jsonLinks = JSON.stringify(links, null, 2)

        return new Response(jsonLinks, {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        })
    }

    else {
        return new Response('hello world', {status: 200})
    }

}
