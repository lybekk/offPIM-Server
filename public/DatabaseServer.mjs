var {
    hostname,
    protocol
} = location

        export class DatabaseServer {
            constructor() {
                this.name = 'PouchDB Express server';
                this.url = `${protocol + '//' + hostname}:3000`;
                this.bindAddress = null;
                this.dbAvailable = false;
            }

            get activeDatabase() {
                const name = localStorage.getItem('activeDatabase')
                console.log(name)
                sendToTerminal(`Active database set to: ${name}`)
                return name
            }

            set activeDatabase(name) {
                //this.activeDatabaseName = name
                localStorage.setItem('activeDatabase', name)
            }

            get networkAvailability() {
                return this.checkNetworkAvailability()
            }

            checkNetworkAvailability() {
                return ['127.0.0.1', 'localhost'].includes(this.bindAddress)
            }

            async initialize() {
                await this.statusCheck()
                this.getDatabaseList()
            }

            static async start() {
                dbAction({
                    msg: `${this.name} starting.`,
                    url: '/action/start',
                })
            }

            static async shutdown() {
                dbAction({
                    msg: `Shutting down ${this.name}`,
                    url: '/action/shutdown',
                })
            }

            static async restart() {
                dbAction({
                    msg: `Restarting ${this.name}`,
                    url: '/action/restart',
                })
            }

            //static async statusCheck() {
            async statusCheck() {
                const box = document.querySelector('#bindResultBox');                
                try {
                    const response = await fetch('/config')
                    const data = await response.json()
                    this.url = data.dbServerURL
                    this.bindAddress = data.bindAddress
                    this.databaseList = []
    
                    if (this.networkAvailability) {
                        box.innerHTML = 'offPIM Server is available on all ports';
                    } else {
                        box.innerHTML = 'Secure environment. offPIM Server is available on localhost only';
                    }
                    this.dbAvailable = true;
                    const box2 = document.querySelector('#dbServerStatusBox');
                    box2.innerHTML = this.dbAvailable ? 'Online' : 'Offline';
    
                    let u = this.url;
                    document.querySelector('#dbLink').href = u;
                    document.querySelector('#dbLinkAdmin').href = u + '/_utils';
                    //return
                } catch (error) {
                    this.dbAvailable = false;
                    let txt = 'offPIM Server reported an error: ' + error;
                    console.log(txt)
                    setTerminalBox(txt)
                    box.innerHTML = txt;
                }
            }

            async getDatabaseList() {
                try {                    
                    const response = await fetch(`${this.url}/_all_dbs`, {
                        "referrer": "http://localhost:3001/",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": null,
                        "method": "GET",
                        //"mode": "no-cors",
                        "credentials": "include"
                  });
                  const data = await response.json();
                  this.databaseList = data

                  // TODO: Separate into renderDatabaseList function
                  let listContainer = document.querySelector('#databaseList');
                  data.forEach(item => {
                        let radio = document.createElement('material-radio')
                        radio.setAttribute('label', item)
                        radio.setAttribute('name', item)
                        //radio.onclick = this.activeDatabase(item) // may need change to db.setActiveDatabase()
                        radio.onclick = () => {this.activeDatabase = item} // may need change to db.setActiveDatabase()
                        if (['_replicator','_users'].includes(item)) {
                            radio.setAttribute('disabled', '')
                        }
                        if (this.activeDatabase === item) {
                            radio.setAttribute('checked', '')
                        }
                        listContainer.appendChild(radio)
                  });
                  // TODO: Set active database in list on render
                    // set radio checked <input class="mdc-radio__native-control" type="radio" id="radio-1" name="radios" checked>
                    // disabled	Boolean	Setter/getter for the radio's disabled state. Setter proxies to foundation's setDisabled method
                    // checked	Boolean	Setter/getter for the radio's checked state
                    // value	String	Setter/getter for the radio's value
                  // TODO: Function for setting active database. When active database is changed, rerender list

                  //localStorage.setItem('databaseList', JSON.stringify(data))
                  //this.url
                } catch (error) {
                    console.log('Error: ', error)
                    // TODO: print to terminal that Cors settings may be shit. Check network developer tab
                }

                  /*
                  <li class="mdc-list-item">
                  <a id="dbLink" href="http://localhost:3000" target="_blank">
                      <span class="mdc-list-item__text">
                          <span class="mdc-list-item__primary-text">DB root (/)</span>
                          <span class="mdc-list-item__secondary-text">PouchDB Server</span>
                      </span>
                  </a>
                </li>
*/
            }


        }
