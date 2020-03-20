// This needs to be called from within the userscript, so it needs to be global
var init_settings_button = function init_settings_button(text, callback) {
  if (typeof(unitedPropertiesIf) != "undefined") {
	try {
	  var version_code = parseInt(unitedPropertiesIf.getVersionCode());
	  // In version 4.1.9, the settings box was inlined into the main settings screen, rendering this panel useless
	  if (version_code >= 419) return;
	} catch (e) {
	  // continue with normal setup
	}
  }
  var options = document.createElement("span");
  options.style.opacity = 0;
  options.innerText = text;
  options.style.backgroundColor = "white";
  options.style.color = "black";
  options.addEventListener("mouseover", function() {
    options.style.opacity = 1;
  });
  options.addEventListener("mouseout", function() {
    options.style.opacity = 0;
  });
  options.addEventListener("click", callback);
  options.style.position = "fixed";
  options.style.bottom = "10px";
  options.style.left = "10px";
  options.style.padding = "3px";
  options.style.borderRadius = "3px";
  options.id = "options_button";
  document.body.appendChild(options);
}
// very very global
window.init_settings_button = init_settings_button;
// Adds the userscript to the page. Do NOT call until you've set up GM_{s,g}etValue
var add_script = function add_script() {
  var s = document.createElement("script")
  s.src = "/userscript_no_cache"
  document.head.appendChild(s);
}
// If we're on mobile
if (typeof(unitedPropertiesIf) != "undefined") {
  // Format shit for a mobile screen
  var sc = document.getElementById("sitecorner")
  if (sc != null) {
    sc.style.margin = "0";
    sc.style.border = "none";
    sc.style.width = "100%";
    sc.style.padding = "0";
  }
  // This looks fragile
  var header = document.getElementsByTagName("img")[0];
  if (header != null) {
    // Scale to the device width rather than a fixed 395px
    header.style.width = "100%";
    header.style.height = "auto";
  }
  var draggable = document.getElementById("draggable");
  if (draggable != null) {
    document.getElementById("draggable").style.width = "auto";
  }
  var mc = document.getElementById("maincontainer");
  if (mc != null) {
    mc.style.margin = "0";
    mc.style.border = "none";
    mc.style.padding = "0";
    mc.style.borderRadius = "0";
    mc.style.width = "100%";
  }
  // If the user has enabled userscript from the mobile settings, set up GM_{s,g}etValue and add the script
  if (unitedPropertiesIf.getProperty("userscript").toUpperCase() == "TRUE") {
    window.GM_getValue = function(a, b) {
      var res = unitedPropertiesIf.getProperty(a);
      if (res == "") return b;
      return res;
    }
    window.GM_setValue = function(a, b) {
      unitedPropertiesIf.setProperty(a, b);
    }
    add_script();
  }
} else {
  // We're not on mobile
  var userscript = localStorage.getItem("userscript") == "true";
  // If we're on desktop and the user has enabled userscript set up the script
  // (PREF) The functions should persist no matter what imo, it's not like two more things inside of window will kill anything.
  // plus the anti-doubleposting script relies on this being present in global
  window.GM_setValue = function GM_setValue(k, v) { localStorage.setItem(k, v); };
  window.GM_getValue = function GM_getValue(k, d) { 
    var value = localStorage.getItem(k);
    return value == null ? d : value;
  };

  if (userscript) {
    add_script();
  } else {
    // Create the "enable userscript" button in the bottom left
    var enable = function enable() {
      localStorage.setItem("userscript", true);
      window.location.reload();
    }
    init_settings_button("Enable Userscript", enable);
  }
  if ((localStorage.getItem("thread_watcher", "true") || "true").toUpperCase() == "TRUE") {
    var s = document.createElement("script");
    s.src = "/static/thread-watcher.js";
    document.head.appendChild(s);
  }
}
