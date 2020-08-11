# offPIM-Server
offPIM Server for easy Synchronization

## Tips

* Enable CORS in the admin interface
    * CORS is strict here. If using another host than offpim.app, add the URL to `config.json` cors.origins like this `"https://offpim.app",http://yoururl.com"`. It is important that the format is a comma-separated string. The offpim.app can be safely removed if not used.
* offPIM Server struggles with **Microsoft Edge Legacy** during replication.
    * Verified working with Brave or Chrome (Webkit in general)