
// switches to call right functions for context
function setSketchup() {
    // switch to actions for Sketchup (skp:...)
    log.debug('switching to Sketchup functions ...'); 
    SKETCHUP = true;
}

function setTest() {
    // set dummy actions
    try {
        log.debug('switching to test functions ...');
    } catch (e) {
        // log might not be defined yet
    }
    SKETCHUP = false;
}


function writeSkySettings() {
    // send back location and sky settings
    var params = modelLocation.toParamString();
    if (SKETCHUP == true) {
        log.debug("writeSkySettings(): " + params);
        window.location = 'skp:writeSkySettings@' + params;
    } else {
        log.debug("writeSkySettings(): no need to set shadow_info");
    }
}


function onApplySkySettingsToModel() {
    // apply settings to Sketchup shadow_info
    if (SKETCHUP == true) {
        log.info("applying settings to Sketchup model ...");
        window.location = 'skp:applySkySettingsToShadowInfo@';
    } else {
        log.debug("onApplySkySettingsToModel() ...");
        modelLocation.changed = false;
        // TODO:
        // msg = modelLocation.toJSON();
        // setShadowInfoFromJSON(msg);
        clearTZWarning();
        updateSkyPage();
    }
}
    

function getExportOptions() {
    // collect and set export option values
    if (SKETCHUP == true) {
        log.info("getting shadowInfo from SketchUp ...");
        window.location = 'skp:getExportOptions@';
        // setExportOptionsJSON() called by Sketchup
    } else {
        var s =    "[{\"name\":\"sceneName\"#COMMA#\"value\":\"Scene_Dummy1\"}";
        s += "#COMMA#{\"name\":\"scenePath\"#COMMA#\"value\":\"/home/user/tmp/testfile\"}";
        s += "#COMMA#{\"name\":\"exportMode\"#COMMA#\"value\":\"by color\"}";
        s += "#COMMA#{\"name\":\"triangulate\"#COMMA#\"value\":\"false\"}";
        s += "#COMMA#{\"name\":\"textures\"#COMMA#\"value\":\"true\"}";
        s += "#COMMA#{\"name\":\"global_coords\"#COMMA#\"value\":\"false\"}#COMMA#]";
        setExportOptionsJSON(s);
    }
}


function getSkySettings() {
    // get SketchUp shadow_info settings and apply to modelLocation
    if (SKETCHUP == true) {
        log.info("getting shadowInfo from SketchUp ...");
        window.location = 'skp:getSkySettings@';
        // setShadowInfoJSON() called by Sketchup
    } else {
        log.debug("getSkySettings(): 'skp:' not available");
        msg = _getSkySettingsTest();
        setShadowInfoJSON(msg);
    }
}

function _getSkySettingsTest() {
    // return dummy JSON string of SketchUp.shadow_info
    var msg =    "[{\"name\":\"City\"#COMMA#\"value\":\"foo_Boulder (CO)\"}";
    msg += "#COMMA#{\"name\":\"Country\"#COMMA#\"value\":\"foo_USA\"}";
    msg += "#COMMA#{\"name\":\"Latitude\"#COMMA#\"value\":\"40.017\"}";
    msg += "#COMMA#{\"name\":\"Longitude\"#COMMA#\"value\":\"-105.283\"}";
    msg += "#COMMA#{\"name\":\"TZOffset\"#COMMA#\"value\":\"-7.0\"}";
    msg += "#COMMA#{\"name\":\"NorthAngle\"#COMMA#\"value\":\"0.0\"}";
    msg += "#COMMA#{\"name\":\"DaylightSavings\"#COMMA#\"value\":\"false\"}";
    msg += "#COMMA#{\"name\":\"DisplayShadows\"#COMMA#\"value\":\"false\"}";
    msg += "#COMMA#{\"name\":\"ShadowTime\"#COMMA#\"value\":\"Fri Nov 08 13:30:00 +0000 2002\"}";
    msg += "#COMMA#{\"name\":\"ShadowTime_time_t\"#COMMA#\"value\":\"1036762200\"}";
    msg += "#COMMA#{\"name\":\"UseSunForAllShading\"#COMMA#\"value\":\"false\"}";
    msg += "#COMMA#{\"name\":\"SkyCommand\"#COMMA#\"value\":\"!gensky +i 03 21 12:34 -a 40.017 -o 105.283 -m 105.0 -g 0.22 -t 1.8\"}]";
    return msg;
}

function loadFileCallback(text) {
    //dummy function to be reasigned to real callback
}

function loadTextFile(fname) {
    log.debug("loadTextFile() fname='" + fname + "'");
    if (SKETCHUP == true) {
        window.location = 'skp:loadTextFile@' + fname;
    } else {
        log.warn("Warning: can't load file without backend! (fname='" + fname + "')");
        loadFileCallback('');
    }
}

function applyExportOptions() {
    var param = exportSettings.toString();
    if (SKETCHUP == true) {
        window.location = 'skp:applyExportOptions@' + param;
    } else {
        log.debug("no options to apply");
        param = param.replace(/&/g,"<br/>");
        setStatusMsg("applyExportOptions:<br/>" + param);
    }
}

function applyRenderOptions() {
    param = radOpts.toString();
    if (SKETCHUP == true) {
        log.debug("param=" + param);
        window.location = 'skp:applyRenderOptions@' + param;
    } else {
        log.debug("no options to apply");
    }
}

function encodeJSON(json) {
    var text = escape(json);
    return text;
}


function setViewsListJSON(text) {
    // eval JSON views string from SketchUp
    var json = unescape(text);
    var newViews = new Array();
    try {
        eval("newViews = " + json);
        //log.debug("eval(): newViews.length=" + newViews.length); 
    } catch (e) {
        log.error("setViewsListJSON: error in eval() '" + e.name + "'");
        log.error("json= " + json)
    }
    viewsList.setViewsList(newViews);
}

function getViewsList() {
    if (SKETCHUP == true) {
        log.info("getting views from SketchUp ...");
        window.location = 'skp:getViewsList@'; 
        // setViewsListJSON() called by Sketchup
    } else {
        log.debug("getViewsList(): 'skp:' not available");
        var msg = _getViewsListTest();
        setViewsListJSON( encodeJSON(msg) );
    }    
}

function _getViewsListTest() {
    // return dummy JSON string of SketchUp views
    var msg = "[{\"name\":\"view_1\",\"selected\":\"false\",\"current\":\"false\"}";
    msg +=    ",{\"name\":\"front (1)\",\"selected\":\"false\",\"current\":\"false\"}";
    msg +=    ",{\"name\":\"current view\",\"selected\":\"false\",\"current\":\"true\"}";
    msg +=    ",{\"name\":\"sel_view\",\"selected\":\"true\",\"current\":\"false\"}";
    msg +=    ",{\"name\":\"scene (2)\",\"selected\":\"true\",\"current\":\"false\"}";
    msg +=    ",{\"name\":\"next to last\",\"selected\":\"false\",\"current\":\"false\"}";
    msg +=    ",{\"name\":\"last\",\"selected\":\"false\",\"current\":\"false\"}]";
    return msg;
}

function applyViews() {
    var text = viewsList.toString();
    var param = encodeURI(text);
    //log.error("TEST: escape(text)=</br>" + param);
    if (SKETCHUP == true) {
        window.location = 'skp:applyViews@' + param;
    } else {
        log.debug("no action for applyViews()"); 
    }
}







