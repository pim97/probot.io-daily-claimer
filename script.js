const Scrappey = require('scrappey-wrapper');
const crypto = require('crypto');
const CapSolver = require('node-capsolver')

// Replace the following details with your own details
const SCRAPPEY_API_KEY = 'scrappey.com';
const AUTHORIZATION_HEADER_KEY = 'autoirization_header_key_from_probot.io_when_logging_in'
const CAPSOLVER_API_KEY = 'capsolver.com'
const PROXY = 'your_proxy_here'

//Do not change
const PROBOT_V2_KEY = '6LceDTMUAAAAAFQhYmUzmvKn6uahUjgguWpg-KO1'

// Create an instance of Scrappey
const scrappey = new Scrappey(SCRAPPEY_API_KEY);
const handler = new CapSolver(CAPSOLVER_API_KEY, {
    verbose: true, // Optional
})
const date = new Date().toISOString();

/**
 * Extra security measure from Probot
 * @param {*} id 
 * @returns 
 */
function hash(id) {
    const e = {
        id: id
    }; 
    const i = date; 
    const concatenatedString = "Backlands-Magnetize2-Parkway".concat(null == e ? void 0 : e.id).concat(i);
    const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
    return hash;
}

/**
 * Using CapSolver to solve the captcha
 * @returns 
 */
async function getCaptchaAnswer() {
    const taskData =
    {
        type: "ReCaptchaV2TaskProxyLess",
        websiteURL: "https://probot.io/api/claim_daily",
        websiteKey: PROBOT_V2_KEY
    }
    let response;

    let b = await handler.getBalance();
    if (b.balance > 0) {
        response = await handler.solve({
            type: taskData.type,
            websiteURL: taskData.websiteURL,
            websiteKey: taskData.websiteKey,
            proxy: PROXY
        })
    } else {
        console.log("Insufficient balance.")
    }
    return response.solution.gRecaptchaResponse
}

/**
 * Runs the script
 */
async function run() {
    try {
        const sessionRequest = await scrappey.createSession({
            proxy: PROXY
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
    
        const captcha = await getCaptchaAnswer()

        console.log(`Found answer answer ${captcha}`)

        const post = {
            c: hash(result.id),
            captcha: captcha,
            d: date,
        }

        const claim = await scrappey.post({
            url: 'https://probot.io/api/claim_daily',
            session: session,
            customHeaders: {
                'content-type': 'application/json',
                "authorization": AUTHORIZATION_HEADER_KEY,
                "referer": "https://probot.io/daily",
                "origin": "https://probot.io",
            },
            requestType: "request",
            postData: JSON.stringify(post),
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
