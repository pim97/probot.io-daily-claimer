const Scrappey = require('scrappey-wrapper');

// Replace the following details with your own details
const SCRAPPEY_API_KEY = 'scrappey.com';
const AUTHORIZATION_HEADER_KEY = 'probot_auth_header'

// Create an instance of Scrappey
const scrappey = new Scrappey(SCRAPPEY_API_KEY);

// Optional to add proxy, one is added if not added
const PROXY = ''

/**
 * Runs the script
 */
async function run() {
    try {
        const sessionRequest = await scrappey.createSession({
            // proxy: PROXY //optional
        });
        const session = sessionRequest.session;

        console.log('Created Session:', session);

        const get = await scrappey.get({
            url: 'https://probot.io/api/user',
            session: session,
            customHeaders: {
                "authorization": AUTHORIZATION_HEADER_KEY
            }
        })

        const result = JSON.parse(get.solution.innerText)

        const claim = await scrappey.post({
            url: 'https://probot.io/api/claim_daily',
            session: session,
            customHeaders: {
                "content-type": "application/json",
                "authorization": AUTHORIZATION_HEADER_KEY
            },
            probotData: {
                id: result.id, //send us your ID from /api/user
            },
            postData: "probot", //keep this
        })

        console.log(claim)

        // Manually destroy the session (automatically destroys after 4 minutes)
        await scrappey.destroySession(session);
        console.log('Session destroyed.');
    } catch (error) {
        console.error(error);
    }
}

run();