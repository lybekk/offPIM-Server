/**
 * offPIM RSS Reader test concept
 */

const rssReader = {}

/**
 * Shortcut for attaching child element to parent
 * @param parent Parent DOM Element
 * @param child Child DOM Element
 */
function to(parent, child) {
    parent.appendChild(child)
}

class RssReader extends HTMLElement {
    constructor() {
        super();
    }

    showSubscriptionAddForm() {
        console.log('TODO: Open dialog')
    }

    connectedCallback() {
        this.innerHTML = `
        <h1 style="margin-bottom: 0;">RSS Reader</h1>
        <h2>Work in progress</h2>
        <material-grid>
            <material-grid-inner>

                <material-grid-cell>
                    <material-button label="Back" onclick="rssReader.removeContainer()"></material-button>
                    <material-button id="formAddSubBtn" label="Add subscription"></material-button>
                </material-grid-cell>

            </material-grid-inner>
        </material-grid>

        <rss-reader-form-add-subscription></rss-reader-form-add-subscription>

        <div id="rssSubscriptions">
        </div>
        `;
        let f = document.querySelector('#formAddSubBtn')
        f.onclick = () => this.showSubscriptionAddForm()
    }

    disconnectedCallback() {
        console.log('RSS Reader removed')
    }

}
customElements.define('rss-reader', RssReader);

/**
 * 
 */
class RssReaderAddSubscriptionForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <!-- TODO: make into dialog or bottom sheet -->
            <material-grid-cell>
                <form id="subscriptionForm">
                    <material-textfield label="Feed URL" name="url" required></material-textfield>
                    <material-textfield label="Name" name="name"></material-textfield>
                    <br />
                </form>
                <material-button label="Save" onclick="rssReader.insertSubscription()"></material-button>
            </material-grid-cell>
        `;
    }

}
customElements.define('rss-reader-form-add-subscription', RssReaderAddSubscriptionForm);

/**
 * Creates main container
 */
rssReader.createContainer = () => {

    const main = document.querySelector('main')
    main.classList.add('slideUp')

    const isRendered = document.querySelector('#rssSubscriptions')
    const parent = document.querySelector('#rssreadercontainer')
    if (!isRendered) {
        //return
        const child = document.createElement('rss-reader')
        to(parent,child)
    }
    parent.classList.remove('slideUp')
}

rssReader.removeContainer = () => {
    const rssReader = document.querySelector('#rssreadercontainer')
    rssReader.classList.add('slideUp')
    const main = document.querySelector('main')
    main.classList.remove('slideUp')
}

rssReader.insertSubscription = () => {
    const { url, name } = subscriptionForm.elements
    let doc = {
        "@type": "webFeed",
        url: url.value,
        name: name.value,
        dateCreated: new Date().toISOString()
    }
    console.log('Work in progress: ',doc)
}

export function attachToWindow() {
    window.rssReader = {
        ...rssReader
        /**
         * TODO
         * getSubscriptions
         * getFeedAll
         * getFeedOne
         * insertSubscription
         */
    }
}
