function MainAssistant() {
    /* this is the creator function for your scene assistant object. It will be passed all the 
       additional parameters (after the scene name) that were passed to pushScene. The reference
       to the scene controller (this.controller) has not be established yet, so any initialization
       that needs the scene controller should be done in the setup function below. */
}

MainAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */

    /* setup widgets here */

    /* add event handlers to listen to events from widgets */

    /* Updater Example #1: Check for updates when the app launches
        You can choose where and when to do this -- but don't do it in activate of a scene, 
        or it'll pop-up each time your scene moves to the top of the scene stack. */
    var updaterModel = null;
    updaterModel = new UpdaterModel(); //Make sure the Updater model is included in your sources.json
    updaterModel.CheckForUpdate("Your app name", this.handleUpdateResponse.bind(this));

    /* Updater Example #2: another great option might be to have a menu option, that let's users decide when to check.  */
    // Setup menu
    this.appMenuAttributes = { omitDefaultItems: true };
    this.appMenuModel = {
        label: "Settings",
        items: [
            { label: "Check for Updates", command: 'do-updateCheck' }
        ]
    };
    this.controller.setupWidget(Mojo.Menu.appMenu, this.appMenuAttributes, this.appMenuModel);
};

MainAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
       example, key handlers that are observing the document */
}

//Call back for Updater Check -- Used in Updater Example #1 and #2
MainAssistant.prototype.handleUpdateResponse = function(responseObj) {
    if (responseObj && responseObj.updateFound) {
        updaterModel.PromptUserForUpdate(function(response) {
            if (response)
                updaterModel.InstallUpdate();
            else {
                //No update found. Optionally tell the user.
                this.showDialogBox("No Update Found", "You're on the latest version!");
            }
        }.bind(this));
    }
}

//Handle menu and button bar commands -- Used in Updater Example #2
MainAssistant.prototype.handleCommand = function(event) {
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'do-updateCheck':
                var updaterModel = null;
                updaterModel = new UpdaterModel(); //Make sure the Updater model is included in your sources.json
                updaterModel.CheckForUpdate("Your app name", this.handleUpdateResponse.bind(this));
                break;
        }
    }
};

//Helper for showing a dialog box - Used in Updater Example #1 and #2
MainAssistant.showDialogBox = function(title, message) {
    var stageController = Mojo.Controller.getAppController().getActiveStageController();
    if (stageController) {
        this.controller = stageController.activeScene();

        this.controller.showAlertDialog({
            onChoose: function(value) {},
            title: title,
            message: message,
            choices: [{ label: 'OK', value: 'OK' }],
            allowHTMLMessage: true
        });
    }
}

MainAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};