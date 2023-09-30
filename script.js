const Scrappey = require('scrappey-wrapper');

// Replace the following details with your own details
const SCRAPPEY_API_KEY = 'scrappey_key_from_scrappey.com';

// Replace the authorization header found from probot.io
const AUTHORIZATION_HEADER_KEY_PROBOT_IO = 'auth_key'

// Create an instance of Scrappey
const scrappey = new Scrappey(SCRAPPEY_API_KEY);

// Optional to add proxy, one is added if not added
const PROXY = 'http://user:pass@host:port'

async function run() {
    try {

        /**
         * Send the authorization key to Scrappey and scrappey does the rest.
         * 
         * Scrappey solve's the Cloudflare and Turnstile automatically for you by using the
         * Scrappey's Task system
         * 
         * ** Disclaimer **
         * 
         * Be aware that you are sending your key to login to Scrappey for Probot.io.
         * We recommend to only send credentials that you are okay to lose.
         * Scrappey does not store your key, it is only used to claim the rewards.
         */
        const claim = await scrappey.get({
            "url": "https://probot.io",
            "proxy": PROXY, //optional, can be left out
            "task": "probot",
            "taskData": {
                "authorization_key": AUTHORIZATION_HEADER_KEY_PROBOT_IO
            }
        })

        if (claim && claim.solution && claim.solution.innerText) {

            //Success!
            console.log(claim.solution.innerText)
        } else {

            //Something went wrong
            console.log(claim)
        }

    } catch (error) {
        console.error(error);
    }
}

run();