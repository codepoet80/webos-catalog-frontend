enyo.kind({
    name: "MyApp.SampleApp",
    kind: enyo.VFlexBox,
    components: [{
            kind: "myApp.AppMenu",
            name: "appMenu",
            components: [
                { caption: "Check for Updates", onclick: "menuClicked" }
            ],
            onItemSelected: 'handleItemSelected'
        },
        {
            kind: "Helpers.Updater", //Make sure the Updater Helper is included in your depends.json
            name: "myUpdater"
        }
    ],

    create: function() {
        this.inherited(arguments);
        /* Updater Example #1: Check for updates when the app launches */
        this.$.myUpdater.CheckForUpdate("webOS Archive Proxy");
    },

    /* Updater Example #2: another great option might be to have a menu option,
        this would let the user decide when to check for updates.  */
    handleItemSelected: function(inSender, inEvent) {
        switch (inEvent) {
            case 'Check for Updates':
                this.$.myUpdater.CheckForUpdate("webOS Archive Proxy");
                break;
        }
    },
});