enyo.kind({
    name: "Helpers.Updater",
    kind: "Control",
    published: {
        lastUpdateResponse: null,
    },
    components: [{
            name: "updateServiceCheck",
            kind: "WebService",
            url: "http://appcatalog.webosarchive.com/WebService/getLatestVersionInfo.php",
            onSuccess: "updateCheckSuccess",
            onFailure: "updateCheckFailure"
        },
        {
            name: "serviceRequest",
            kind: "PalmService",
            service: "palm://com.palm.applicationManager",
            method: "open"
        },
        {
            kind: "Popup",
            name: "updatePopUp",
            lazy: false,
            layoutKind: "VFlexLayout",
            style: "width: 80%;height:210px",
            components: [
                { content: "<b>Update Available</b>" },
                {
                    kind: "BasicScroller",
                    flex: 1,
                    components: [
                        { name: "updateMsg", kind: "HtmlContent", flex: 1, pack: "center", align: "left", style: "text-align: left;padding-top:10px;padding-bottom: 10px" }
                    ]
                },
                {
                    layoutKind: "HFlexLayout",
                    pack: "center",
                    components: [
                        { kind: "Button", caption: "Update Now", onclick: "updateConfirmClick" },
                        { kind: "Button", caption: "Later", onclick: "updateCancelClick" }
                    ]
                }
            ]
        },
    ],
    create: function() {
        this.inherited(arguments);
        enyo.log("Update Helper created.");
    },
    CheckForUpdate: function(appName) {
        enyo.log("Update Helper is checking for updates...");
        this.$.updateServiceCheck.call(appName);
    },
    openUpdatePopup: function(message) {
        if (this.lastUpdateResponse == null) {
            enyo.warn("Updater Helper: Not prompting user for update when no update has been discovered.");
        } else {
            if (!message)
                message = "An update for this app was found in App Museum II. Do you want to update now?";
            this.$.updateMsg.setContent(message);
            this.$.updatePopUp.openAtCenter();
        }
    },
    updateConfirmClick: function() {
        this.$.updatePopUp.close();
        if (!this.lastUpdateResponse || !this.lastUpdateResponse.downloadURI) {
            enyo.warn("Updater Helper: Not performing update when no update has been discovered.");
        } else {
            enyo.log("I should do an update for: " + JSON.stringify(this.lastUpdateResponse));
            this.$.serviceRequest.call({ id: "org.webosinternals.preware", params: { type: "install", file: this.lastUpdateResponse.downloadURI } });
        }
    },
    updateCancelClick: function() {
        this.$.updatePopUp.close();
    },
    updateCheckSuccess: function(inSender, inResponse, inRequest) {
        enyo.log("got success from update check: " + JSON.stringify(inResponse));
        var currVersion = enyo.fetchAppInfo().version;
        enyo.log("Updater Helper found Current version: " + currVersion + ", Update version: " + inResponse.version);
        currVersion = this.getVersionObject(currVersion);
        if (inResponse.version != null) {
            this.lastUpdateResponse = inResponse;
            var museumVersion = this.getVersionObject(inResponse.version);
            if (this.isVersionHigher(currVersion, museumVersion)) {
                enyo.log("Updater Helper found an update in webOS App Museum II!");
                this.openUpdatePopup(inResponse.versionNote);
            } else {
                enyo.log("Updater Helper did not find an update in webOS App Museum II!");
                inResponse = false;
            }
        } else {
            enyo.error("Update Helper could not find museum version number");
        }
    },
    updateCheckFailure: function(inSender, inResponse, inRequest) {
        enyo.error("Got failure from update check: " + inResponse);
    },
    //Turn a version string into an object with three independent number values
    getVersionObject: function(versionNum) {
        versionNumParts = versionNum.split(".");
        if (versionNumParts.length <= 2 || versionNumParts > 3) {
            enyo.log("Updater Helper: An invalid version number was passed, webOS version numbers are #.#.#");
            return false;
        } else {
            var versionObject = {
                majorVersion: versionNumParts[0] * 1,
                minorVersion: versionNumParts[1] * 1,
                buildVersion: versionNumParts[2] * 1
            }
            return versionObject;
        }
    },
    //Given a current version and a version to compare, return true or false if the compare version is newer
    isVersionHigher: function(currVersion, compareVersion) {
        if (!currVersion || !compareVersion) {
            enyo.log("Updater Helper: Pass the versions to compare. If the second version is higher than the first, this function will return true");
        } else {
            if (compareVersion.majorVersion > currVersion.majorVersion)
                return true;
            if (compareVersion.majorVersion == currVersion.majorVersion && compareVersion.minorVersion > currVersion.minorVersion)
                return true;
            if (compareVersion.majorVersion == currVersion.majorVersion && compareVersion.minorVersion == currVersion.minorVersion && compareVersion.buildVersion > currVersion.buildVersion)
                return true;
            return false;
        }
    },

});