/**
 * Created 09.10.2020
 * @author Umut Emre Bayramoglu
 */

const BASE_URL = "https://calm-math-effa.cf-api.workers.dev/"
const LINKS = "links"

const LINKS_ARR = [{ "name": "Home Page", "url": "https://www.cloudflare.com/" },
    { "name": "Community", "url": "https://community.cloudflare.com/" },
    { "name": "Documentation", "url": "https://developers.cloudflare.com/docs/" }]

const SOCIAL_LINKS_ARR = [{url:"http://facebook.com", svg:"<svg role='img' viewBox='0 0 24 24'><path fill='white' d='M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z'/></svg>"},
    {url:"https://github.com/umutbayramoglu", svg:"<svg role='img' viewBox='0 0 24 24'><path fill='white' d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/></svg>"}]

const AVATAR_SRC = "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
const USERNAME = "umutemrebayramoglu"

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * @return {Response} Json or HTML response
 * @param {Request} request
 */
async function handleRequest(request) {
    
    if(request.url === BASE_URL+LINKS){
        return linksJsonResponse();
    }
    else{
        return htmlResponse();
    }
}

/**
 * When user make fetch request to "/links" endpoint, url list is returned as JSON response. 
 */
function linksJsonResponse(){
    const jsonLinks = JSON.stringify(LINKS_ARR)
    return new Response(jsonLinks, {
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}


/**
 * If the user access a page other than "/links" endpoint, a transformed html response is returned.
 */
function htmlResponse(){
    url = "https://static-links-page.signalnerve.workers.dev"
    return fetch(url)
        .then(res => {
            if(res.ok) {
                let rewriter = new HTMLRewriter()
                    .on("#profile", new ElementHandler("style","display: none",""))
                    .on("#social", new ElementHandler("style","display: none",""))
                    .on("body", new ElementHandler("class","bg-gray-900","bg-green-900"))
                    .on("#avatar", new ElementHandler("src",null,AVATAR_SRC))
                    .on("#name", new ElementHandler(null,null,USERNAME))
                    .on("title", new ElementHandler(null,null,"Changed Title"))
                    .on("#links", new LinksTransformer(LINKS_ARR))
                    .on("#social", new SocialLinksTransformer(SOCIAL_LINKS_ARR));

                return rewriter.transform(res)
            }
            else alert("An error occured. (Error Code)");
        })

}


/**
 * Rewriter class to transform elements.
 */
class ElementHandler {

    constructor(attr, oldValue, newValue) {
        this.attr = attr
        this.newValue = newValue;
        this.oldValue = oldValue;
    }

    element(e) {
        const attribute = e.getAttribute(this.attr)
        if (attribute)
            e.setAttribute(this.attr,attribute.replace(this.oldValue,this.newValue))
        else{
            if(e.tagName === "h1" ||  e.tagName === "title")
                e.setInnerContent(this.newValue);
            else
                e.setAttribute(this.attr, this.newValue);
        }
          
    }
}

/**
 * Rewriter class to transform web-site links.
 */
class LinksTransformer {

    constructor(links) {
        this.links = links
    }

    element(e) {
        let linksContent  = "";
        this.links.forEach((item) => {
            linksContent += `<a href='${item.url}' target='_blank'>${item.name}</a>\n`
        })

        e.append(linksContent,{ html: true });
    }
}


/**
 * Rewriter class to transform social media links.
 */
class SocialLinksTransformer {

    constructor(links) {
        this.links = links
    }

    element(e) {
        let linksContent = "";
        this.links.forEach(item => {
            linksContent += `<a href='${item.url}'>`
                + item.svg
                + "</a>";
        })
        e.append(linksContent,{ html: true });
    }
}