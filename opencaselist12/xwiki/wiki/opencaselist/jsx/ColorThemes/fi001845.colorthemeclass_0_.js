if(typeof(XWiki)=="undefined"){XWiki=new Object()}if(typeof(XWiki.editors)=="undefined"){XWiki.editors=new Object()}XWiki.editors.ColorThemeWizard=Class.create({classPrefix:".colorthemewizard-",inputNamePrefix:"ColorThemes.ColorThemeClass_0_",propertyMap:new Object(),defaultValues:new Object(),initialize:function(){this.pickerSelector=this.classPrefix+"picker";this.triggerSelector=this.classPrefix+"trigger";this.maquetteSelector=this.classPrefix+"page";this.tipSelector=this.classPrefix+"tip";this.editableGroupSelector=this.classPrefix+"editable-group";this.visibleTriggerSelector=this.triggerSelector+"-visible";this.logoProperty="logoImage";this.logoSelector=this.classPrefix.substring(1)+"logo";this.logoPropertySelector=this.classPrefix+this.logoProperty;this.defaultLogoURL="";this.generateDefaultValues();this.createPropertyMap();this.hideCSSVersionPickers();this.redefineActivation();this.attachChangeListeners()},generateDefaultValues:function(){this.defaultValues.pageBackgroundColor="#F5F5F5";this.defaultValues.pageHeaderBackgroundColor="#FFFFFF";this.defaultValues.pageContentBackgroundColor="#FFFFFF";this.defaultValues.textColor="#636B75";this.defaultValues.textPrimaryColor="#9F9F9F";this.defaultValues.textSecondaryColor="#9F9F9F";this.defaultValues.titleColor="#2173AF";this.defaultValues.borderColor="#E8E8E8";this.defaultValues.linkColor="#0089DC";this.defaultValues.highlightColor="#FFFFCC";this.defaultValues.fieldGradientColor="#F5F5F5";this.defaultValues.menuBackgroundColor="#0272A6";this.defaultValues.menuGradientColor="#3A8ABC";this.defaultValues.menuLinkColor="#F3F3F3";this.defaultValues.menuContentBackgroundColor="#E1E1E1";this.defaultValues.menuContentGradientColor="#FFFFFF";this.defaultValues.menuContentLinkColor="#4D5860";this.defaultValues.menuSelectedEntryBackgroundColor="#EFEFEF";this.defaultValues.menuSelectedEntryLinkColor="#2173AF";this.defaultValues.menuAddEntryBackgroundColor="#4D9244";this.defaultValues.menuAddEntryLinkColor="#FFFFFF";this.defaultValues.submenuContentBackgroundColor="#F5F5F5";this.defaultValues.panelBackgroundColor="#FFFFFF";this.defaultValues.panelHeaderBackgroundColor="#E1E1E1";this.defaultValues.panelHeaderGradientColor="#FFFFFF";this.defaultValues.panelHeaderTextColor="#4D5860";this.defaultValues.panelTextColor="#636B75";this.defaultValues.panelCollapsedBackgroundColor="#E1E1E1";this.defaultValues.panelCollapsedGradientColor="#FFFFFF";this.defaultValues.panelCollapsedTextColor="#4D5860";this.defaultValues.buttonPrimaryBackgroundColor="#2173AF";this.defaultValues.buttonPrimaryGradientColor="#0089DC";this.defaultValues.buttonPrimaryTextColor="#FFFFFF";this.defaultValues.buttonSecondaryBackgroundColor="#E1E1E1";this.defaultValues.buttonSecondaryGradientColor="#FFFFFF";this.defaultValues.buttonSecondaryTextColor="#4D5860";this.defaultValues.backgroundSecondaryColor="#F3F3F3";this.defaultValues.notificationInfoColor="#336699";this.defaultValues.notificationSuccessColor="#008000";this.defaultValues.notificationWarningColor="#D09000";this.defaultValues.notificationErrorColor="#CC3333";this.defaultValues.logoImage="url(/xwiki/wiki/opencaselist/download/ColorThemes/DefaultColorTheme/logo.png)";this.defaultValues.headerBackgroundPosition="";this.defaultValues.pageBackgroundPosition="";this.defaultValues.pageBackgroundImage="";this.defaultValues.headerBackgroundImage="url(/xwiki/wiki/opencaselist/download/ColorThemes/DefaultColorTheme/header.png)"},createPropertyMap:function(){var a;this.propertyMap.page=new Object();this.propertyMap.page.cssProperties=new Array();a="background".camelize();this.propertyMap.page.cssProperties.push(a);this.propertyMap.page[a]=new Array();this.propertyMap.page[a].push("pageBackgroundColor");this.propertyMap.page[a].push("pageBackgroundImage");this.propertyMap.page[a].push("pageBackgroundPosition");a="color".camelize();this.propertyMap.page.cssProperties.push(a);this.propertyMap.page[a]=new Array();this.propertyMap.page[a].push("textColor");this.propertyMap.mainmenu=new Object();this.propertyMap.mainmenu.cssProperties=new Array();a="background".camelize();this.propertyMap.mainmenu.cssProperties.push(a);this.propertyMap.mainmenu[a]=new Array();this.propertyMap.mainmenu[a].push("menuBackgroundColor");a="color".camelize();this.propertyMap.mainmenu.cssProperties.push(a);this.propertyMap.mainmenu[a]=new Array();this.propertyMap.mainmenu[a].push("menuLinkColor");a="background-image".camelize();this.propertyMap.mainmenu.cssProperties.push(a);this.propertyMap.mainmenu[a]=new Array();this.propertyMap.mainmenu[a].push("menuBackgroundColor");this.propertyMap.mainmenu[a].push("menuGradientColor");this.propertyMap.menuaddentry=new Object();this.propertyMap.menuaddentry.cssProperties=new Array();a="background".camelize();this.propertyMap.menuaddentry.cssProperties.push(a);this.propertyMap.menuaddentry[a]=new Array();this.propertyMap.menuaddentry[a].push("menuAddEntryBackgroundColor");a="color".camelize();this.propertyMap.menuaddentry.cssProperties.push(a);this.propertyMap.menuaddentry[a]=new Array();this.propertyMap.menuaddentry[a].push("menuAddEntryLinkColor");this.propertyMap.contentmenu=new Object();this.propertyMap.contentmenu.cssProperties=new Array();a="background".camelize();this.propertyMap.contentmenu.cssProperties.push(a);this.propertyMap.contentmenu[a]=new Array();this.propertyMap.contentmenu[a].push("menuContentBackgroundColor");a="color".camelize();this.propertyMap.contentmenu.cssProperties.push(a);this.propertyMap.contentmenu[a]=new Array();this.propertyMap.contentmenu[a].push("menuContentLinkColor");a="background-image".camelize();this.propertyMap.contentmenu.cssProperties.push(a);this.propertyMap.contentmenu[a]=new Array();this.propertyMap.contentmenu[a].push("menuContentBackgroundColor");this.propertyMap.contentmenu[a].push("menuContentGradientColor");this.propertyMap.header=new Object();this.propertyMap.header.cssProperties=new Array();a="background".camelize();this.propertyMap.header.cssProperties.push(a);this.propertyMap.header[a]=new Array();this.propertyMap.header[a].push("pageHeaderBackgroundColor");this.propertyMap.header[a].push("headerBackgroundImage");this.propertyMap.header[a].push("headerBackgroundPosition");this.propertyMap.panelheader=new Object();this.propertyMap.panelheader.cssProperties=new Array();a="background".camelize();this.propertyMap.panelheader.cssProperties.push(a);this.propertyMap.panelheader[a]=new Array();this.propertyMap.panelheader[a].push("panelHeaderBackgroundColor");a="color".camelize();this.propertyMap.panelheader.cssProperties.push(a);this.propertyMap.panelheader[a]=new Array();this.propertyMap.panelheader[a].push("panelHeaderTextColor");a="border-color".camelize();this.propertyMap.panelheader.cssProperties.push(a);this.propertyMap.panelheader[a]=new Array();this.propertyMap.panelheader[a].push("borderColor");a="background-image".camelize();this.propertyMap.panelheader.cssProperties.push(a);this.propertyMap.panelheader[a]=new Array();this.propertyMap.panelheader[a].push("panelHeaderBackgroundColor");this.propertyMap.panelheader[a].push("panelHeaderGradientColor");this.propertyMap.panelcontents=new Object();this.propertyMap.panelcontents.cssProperties=new Array();a="background".camelize();this.propertyMap.panelcontents.cssProperties.push(a);this.propertyMap.panelcontents[a]=new Array();this.propertyMap.panelcontents[a].push("panelBackgroundColor");a="color".camelize();this.propertyMap.panelcontents.cssProperties.push(a);this.propertyMap.panelcontents[a]=new Array();this.propertyMap.panelcontents[a].push("panelTextColor");this.propertyMap.collapsedpanel=new Object();this.propertyMap.collapsedpanel.cssProperties=new Array();a="background".camelize();this.propertyMap.collapsedpanel.cssProperties.push(a);this.propertyMap.collapsedpanel[a]=new Array();this.propertyMap.collapsedpanel[a].push("panelCollapsedBackgroundColor");a="color".camelize();this.propertyMap.collapsedpanel.cssProperties.push(a);this.propertyMap.collapsedpanel[a]=new Array();this.propertyMap.collapsedpanel[a].push("panelCollapsedTextColor");a="background-image".camelize();this.propertyMap.collapsedpanel.cssProperties.push(a);this.propertyMap.collapsedpanel[a]=new Array();this.propertyMap.collapsedpanel[a].push("panelCollapsedBackgroundColor");this.propertyMap.collapsedpanel[a].push("panelCollapsedGradientColor");this.propertyMap.content=new Object();this.propertyMap.content.cssProperties=new Array();a="background".camelize();this.propertyMap.content.cssProperties.push(a);this.propertyMap.content[a]=new Array();this.propertyMap.content[a].push("pageContentBackgroundColor");a="color".camelize();this.propertyMap.content.cssProperties.push(a);this.propertyMap.content[a]=new Array();this.propertyMap.content[a].push("textColor");this.propertyMap.title=new Object();this.propertyMap.title.cssProperties=new Array();a="color".camelize();this.propertyMap.title.cssProperties.push(a);this.propertyMap.title[a]=new Array();this.propertyMap.title[a].push("titleColor");a="border-color".camelize();this.propertyMap.title.cssProperties.push(a);this.propertyMap.title[a]=new Array();this.propertyMap.title[a].push("borderColor");this.propertyMap.link=new Object();this.propertyMap.link.cssProperties=new Array();a="color".camelize();this.propertyMap.link.cssProperties.push(a);this.propertyMap.link[a]=new Array();this.propertyMap.link[a].push("linkColor");this.propertyMap.info=new Object();this.propertyMap.info.cssProperties=new Array();a="color".camelize();this.propertyMap.info.cssProperties.push(a);this.propertyMap.info[a]=new Array();this.propertyMap.info[a].push("textPrimaryColor");this.propertyMap.details=new Object();this.propertyMap.details.cssProperties=new Array();a="color".camelize();this.propertyMap.details.cssProperties.push(a);this.propertyMap.details[a]=new Array();this.propertyMap.details[a].push("textSecondaryColor");this.propertyMap.highlight=new Object();this.propertyMap.highlight.cssProperties=new Array();a="background".camelize();this.propertyMap.highlight.cssProperties.push(a);this.propertyMap.highlight[a]=new Array();this.propertyMap.highlight[a].push("highlightColor");this.propertyMap.table=new Object();this.propertyMap.table.cssProperties=new Array();a="border-color".camelize();this.propertyMap.table.cssProperties.push(a);this.propertyMap.table[a]=new Array();this.propertyMap.table[a].push("borderColor");this.propertyMap.th=new Object();this.propertyMap.th.cssProperties=new Array();a="background".camelize();this.propertyMap.th.cssProperties.push(a);this.propertyMap.th[a]=new Array();this.propertyMap.th[a].push("backgroundSecondaryColor");a="border-color".camelize();this.propertyMap.th.cssProperties.push(a);this.propertyMap.th[a]=new Array();this.propertyMap.th[a].push("borderColor");this.propertyMap.td=new Object();this.propertyMap.td.cssProperties=new Array();a="border-color".camelize();this.propertyMap.td.cssProperties.push(a);this.propertyMap.td[a]=new Array();this.propertyMap.td[a].push("borderColor");this.propertyMap.message=new Object();this.propertyMap.message.cssProperties=new Array();a="background".camelize();this.propertyMap.message.cssProperties.push(a);this.propertyMap.message[a]=new Array();this.propertyMap.message[a].push("backgroundSecondaryColor");a="border-color".camelize();this.propertyMap.message.cssProperties.push(a);this.propertyMap.message[a]=new Array();this.propertyMap.message[a].push("borderColor");this.propertyMap.button=new Object();this.propertyMap.button.cssProperties=new Array();a="background".camelize();this.propertyMap.button.cssProperties.push(a);this.propertyMap.button[a]=new Array();this.propertyMap.button[a].push("buttonPrimaryBackgroundColor");a="color".camelize();this.propertyMap.button.cssProperties.push(a);this.propertyMap.button[a]=new Array();this.propertyMap.button[a].push("buttonPrimaryTextColor");a="background-image".camelize();this.propertyMap.button.cssProperties.push(a);this.propertyMap.button[a]=new Array();this.propertyMap.button[a].push("buttonPrimaryBackgroundColor");this.propertyMap.button[a].push("buttonPrimaryGradientColor");this.propertyMap.secondaryButton=new Object();this.propertyMap.secondaryButton.cssProperties=new Array();a="background".camelize();this.propertyMap.secondaryButton.cssProperties.push(a);this.propertyMap.secondaryButton[a]=new Array();this.propertyMap.secondaryButton[a].push("buttonSecondaryBackgroundColor");a="color".camelize();this.propertyMap.secondaryButton.cssProperties.push(a);this.propertyMap.secondaryButton[a]=new Array();this.propertyMap.secondaryButton[a].push("buttonSecondaryTextColor");a="background-image".camelize();this.propertyMap.secondaryButton.cssProperties.push(a);this.propertyMap.secondaryButton[a]=new Array();this.propertyMap.secondaryButton[a].push("buttonSecondaryBackgroundColor");this.propertyMap.secondaryButton[a].push("buttonSecondaryGradientColor");this.propertyMap.tabshead=new Object();this.propertyMap.tabshead.cssProperties=new Array();a="background".camelize();this.propertyMap.tabshead.cssProperties.push(a);this.propertyMap.tabshead[a]=new Array();this.propertyMap.tabshead[a].push("menuContentBackgroundColor");a="color".camelize();this.propertyMap.tabshead.cssProperties.push(a);this.propertyMap.tabshead[a]=new Array();this.propertyMap.tabshead[a].push("menuContentLinkColor");a="background-image".camelize();this.propertyMap.tabshead.cssProperties.push(a);this.propertyMap.tabshead[a]=new Array();this.propertyMap.tabshead[a].push("menuContentBackgroundColor");this.propertyMap.tabshead[a].push("menuContentGradientColor");this.propertyMap.tabentryactive=new Object();this.propertyMap.tabentryactive.cssProperties=new Array();a="background".camelize();this.propertyMap.tabentryactive.cssProperties.push(a);this.propertyMap.tabentryactive[a]=new Array();this.propertyMap.tabentryactive[a].push("pageContentBackgroundColor");a="color".camelize();this.propertyMap.tabentryactive.cssProperties.push(a);this.propertyMap.tabentryactive[a]=new Array();this.propertyMap.tabentryactive[a].push("menuSelectedEntryLinkColor");this.propertyMap.tabdetails=new Object();this.propertyMap.tabdetails.cssProperties=new Array();a="color".camelize();this.propertyMap.tabdetails.cssProperties.push(a);this.propertyMap.tabdetails[a]=new Array();this.propertyMap.tabdetails[a].push("textSecondaryColor");this.propertyMap.tabscontent=new Object();this.propertyMap.tabscontent.cssProperties=new Array();a="background".camelize();this.propertyMap.tabscontent.cssProperties.push(a);this.propertyMap.tabscontent[a]=new Array();this.propertyMap.tabscontent[a].push("pageContentBackgroundColor");a="color".camelize();this.propertyMap.tabscontent.cssProperties.push(a);this.propertyMap.tabscontent[a]=new Array();this.propertyMap.tabscontent[a].push("textColor")},hideCSSVersionPickers:function(){$$(this.classPrefix+"picker-noscript").each(function(a){a.hide()})},fastUp:function(a,b){while(a!=document.documentElement){if(a.hasClassName(b)){break}a=a.up()}return a},fastDown:function(c,d){var b,a;var e=new RegExp("(^|\\s)"+d+"(\\s|$)");for(b=0,a=c.childNodes.length;b<a;++b){if(c.childNodes[b].nodeType==1&&e.test(c.childNodes[b].className)){return c.childNodes[b]}}},getMainClassName:function(a){return a.className.substring(0,a.className.indexOf(" "))},getMarker:function(a){return a.className.substring(this.classPrefix.length-1,a.className.indexOf(" "))},redefineActivation:function(){if(!$("body").hasClassName("inlinebody")){return}$$(this.editableGroupSelector).each(function(d){d.observe("mouseover",function(g){var e=this.getMainClassName(d);var h=e+"-trigger";var f=$(h);if(this.fastUp(Event.element(g),this.editableGroupSelector.substring(1))==d){d.removeClassName(e+"-unhover")}else{if(this.fastDown(this.fastDown(d,"colorthemewizard-trigger"),"colorthemewizard-picker").style.display!="block"){d.addClassName(e+"-unhover")}}}.bindAsEventListener(this));var c=$(this.fastDown(d,this.triggerSelector.substring(1)));c.observe("mouseover",function(e){if(this.fastDown(c,this.pickerSelector.substring(1)).style.display=="none"){this.fastDown(c,this.tipSelector.substring(1)).style.display="block"}}.bindAsEventListener(this));c.observe("mouseout",function(e){if(this.fastDown(c,this.pickerSelector.substring(1)).style.display!="none"||(!e.toElement||!($(e.toElement).descendantOf(parent)||e.toElement==parent))){this.fastDown(c,this.tipSelector.substring(1)).style.display=""}}.bindAsEventListener(this));c.observe("click",this.displayPicker.bindAsEventListener(this,c));if(Prototype.Browser.IE||Prototype.Browser.WebKit){shortcut.add("Esc",this.hidePicker.bindAsEventListener(this,c),{type:"keyup"})}else{shortcut.add("Esc",this.hidePicker.bindAsEventListener(this,c),{type:"keypress"})}var b=$(this.fastDown(c,this.pickerSelector.substring(1)));var a=new Element("div",{"class":"close-button",title:"Close"}).update("X");b.insert({top:a});a.observe("click",this.hidePicker.bindAsEventListener(this,this.fastUp(a,this.triggerSelector.substring(1))));b.style.display="none"}.bind(this))},displayPicker:function(b,a){if(b){Event.stop(b);if(b.element()!=a){return}}$$(this.visibleTriggerSelector).each(function(c){this.hidePicker(null,c)}.bind(this));a.addClassName(this.visibleTriggerSelector.substring(1));this.fastDown(a,this.pickerSelector.substring(1)).style.display="block";this.fastDown(a,this.tipSelector.substring(1)).style.display=""},hidePicker:function(b,a){if(b){Event.stop(b)}a.removeClassName(this.visibleTriggerSelector.substring(1));this.fastDown(a,this.pickerSelector.substring(1)).style.display="none";a.select("input[type=text]").each(function(c){c._x_undoButton._x_value=c.value;if(/Color$/.test(c.id)){c.style.backgroundColor=c.value;if(ProColor){var d=ProColor.prototype.computeTextColor(ProColor.prototype.decodeHexColor(c.value));d="#"+d.r.toColorPart()+d.g.toColorPart()+d.b.toColorPart();c.style.color=d}}c._x_undoButton.style.visibility="hidden"}.bind(this))},attachChangeListeners:function(){var a=["keyup","keypress","procolor:changed","procolor:closed"];$$(this.maquetteSelector+" input[type=text]").each(function(b){a.each(function(c){b.observe(c,this.inputValueChanged.bindAsEventListener(this,b))}.bind(this));b._x_undoButton=new Element("button",{"class":"undo",title:"Undo"}).update("Undo");b._x_undoButton._x_input=b;b._x_undoButton._x_value=b.value;b._x_undoButton.style.visibility="hidden";b.insert({after:b._x_undoButton});b._x_undoButton.observe("click",function(c){b.value=b._x_undoButton._x_value;this.inputValueChanged(null,b);b._x_undoButton.style.visibility="hidden"}.bindAsEventListener(this))}.bind(this));$$("input[type=reset]").each(function(b){b.observe("click",function(c){c.stop();b.form.reset();$$(this.maquetteSelector+", "+this.maquetteSelector+" *").each(function(d){this.refreshStyle(d)}.bind(this))}.bindAsEventListener(this))}.bind(this))},retrievePropertyName:function(a){return a.substring(this.inputNamePrefix.length)},inputValueChanged:function(c,b){var d=this.retrievePropertyName(b.name);if(d==this.logoProperty){if(b.value.trim()!=""){$(this.logoSelector).src=this.wrapImagePropertyValue(d,b.value)}else{$(this.logoSelector).src=this.defaultLogoURl}}else{var a=this.classPrefix+d;$$(a).each(function(e){this.refreshStyle(e)}.bind(this))}b._x_undoButton.style.visibility="visible"},refreshStyle:function(a){if(this.propertyMap[this.getMarker(a)]){this.propertyMap[this.getMarker(a)].cssProperties.each(function(d){var c="";this.propertyMap[this.getMarker(a)][d].each(function(g){var e=$(this.inputNamePrefix+g);var f="";if(e){f=e.value}if(!f||f==""){f=this.defaultValues[g];if((g.indexOf("Gradient")>=0)||(g.indexOf("Image")>=0)){f=""}}if(f&&f!=""){c+=" "+this.wrapCSSPropertyValue(g,f)}}.bind(this));c=c.strip();if(c!=""){try{if(d==="backgroundImage"){c=this.wrapGradients(c);a.style.cssText=a.style.cssText+" "+c}else{a.style[d]=c}}catch(b){}}}.bind(this))}},wrapGradients:function(f){var b=new RegExp("__gradient1__name__placeholder__","g");var a=new RegExp("__gradient2__name__placeholder__","g");var g="                                              background-image: -moz-linear-gradient(top, __gradient1__name__placeholder__ 0%, __gradient2__name__placeholder__ 100%);\n      background-image: -webkit-linear-gradient(top, __gradient1__name__placeholder__ 0%, __gradient2__name__placeholder__ 100%);\n      background-image: -o-linear-gradient(top, __gradient1__name__placeholder__ 0%, __gradient2__name__placeholder__ 100%);\n      background-image: -ms-linear-gradient(top, __gradient1__name__placeholder__ 0%, __gradient2__name__placeholder__ 100%);\n      background-image: linear-gradient(top, __gradient1__name__placeholder__ 0%, __gradient2__name__placeholder__ 100%);\n  ";var c="      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=__gradient1__name__placeholder__, endColorstr=__gradient2__name__placeholder__,GradientType=0 );\n  ";var e=f.split(" ");if(e.size()>=2){if(e[0]!=""&&e[1]!=""){var d=g.replace(b,e[1]).replace(a,e[0]);d=d+c.replace(b,e[1]).replace(a,e[0]);return d}}return f},wrapCSSPropertyValue:function(b,a){if(b.indexOf("Image")>=0){return"url("+this.wrapImagePropertyValue(b,a)+")"}return a},wrapImagePropertyValue:function(b,a){if(b.indexOf("Image")>=0){return"/xwiki/wiki/opencaselist/download/ColorThemes/Dusk/__attachment__name__placeholder__".replace("__attachment__name__placeholder__",a)}return a},info:function(a){new XWiki.widgets.Notification(a,"info",{timeout:false})}});document.observe("dom:loaded",function(){if(ProColor){ProColor.prototype.options.onChanged=function(b,a){Event.fire(b.input||b,"procolor:changed")};ProColor.prototype.options.onClosed=function(b,a){Event.fire(b.input||b,"procolor:closed")};ProColor.prototype.options.onCancelClick=function(b,a){Event.fire(b.input||b,"procolor:closed")}}new XWiki.editors.ColorThemeWizard()});