var XWiki=(function(a){a.widgets=a.widgets||{};
Object.extend(a,{constants:{anchorSeparator:"#",docextraCommentsAnchor:"Comments",docextraAttachmentsAnchor:"Attachments",docextraHistoryAnchor:"History",docextraInformationAnchor:"Information"},resource:{get:function(e,h){var d="",j=["Attachments"];
var g=[a.EntityType.DOCUMENT];
for(var f=0;
f<j.length;
f++){if(e.endsWith(a.constants.anchorSeparator+j[f])){d=j[f];
e=e.substr(0,e.length-(d.length+1));
h=h||g[f];
break
}}var b;
if(h){b=a.Model.resolve(e,h)
}else{b=a.Model.resolve(e,a.EntityType.ATTACHMENT);
if(!b.parent){b=a.Model.resolve(e,a.EntityType.DOCUMENT);
if(!b.parent){var c=a.Model.resolve(e,a.EntityType.SPACE);
if(c.parent){b=c
}else{}}}}return this.fromEntityReference(b,d)
},fromEntityReference:function(e,g){var l=e.extractReference(a.EntityType.WIKI);
l=(l&&l.name)||a.currentWiki;
var c=e.extractReference(a.EntityType.SPACE);
c=(c&&c.name)||a.currentSpace;
var j=e.extractReference(a.EntityType.DOCUMENT);
j=(j&&j.name)||a.currentPage;
var h=e.extractReference(a.EntityType.ATTACHMENT);
h=(h&&h.name)||"";
var f=new a.DocumentReference(l,c,j);
var d=a.Model.serialize(f.relativeTo(new a.WikiReference(l)));
var b=a.Model.serialize(f.parent);
var i=a.Model.serialize(f);
return{wiki:l,space:c,prefixedSpace:b,fullName:d,prefixedFullName:i,name:j,attachment:h,anchor:g}
},asEntityReference:function(e){var b;
var d=[e.wiki,e.space,e.name,e.attachment];
for(var c=0;
c<d.length;
c++){if(d[c]){b=new a.EntityReference(d[c],c,b)
}}return b
},serialize:function(c){var b=a.Model.serialize(this.asEntityReference(c));
if(c.anchor){if(b.length>0){b+=a.constants.anchorSeparator
}b+=c.anchor
}return b
}},getResource:function(b){return this.resource.get(b)
},displayDocExtra:function(b,c,e){var d=function(f){var g=document.getElementById(f+"tab");
var h=document.getElementById(f+"pane");
if(window.activeDocExtraTab!=null){window.activeDocExtraTab.className="";
window.activeDocExtraPane.className="hidden"
}window.activeDocExtraTab=g;
window.activeDocExtraPane=h;
window.activeDocExtraTab.className="active";
window.activeDocExtraPane.className="";
g.blur();
document.fire("xwiki:docextra:activated",{id:f})
};
if($(b+"pane").className.indexOf("empty")!=-1){if(window.activeDocExtraPane!=null){window.activeDocExtraPane.className="invisible"
}$("docextrapanes").className="loading";
new Ajax.Updater(b+"pane",window.docgeturl+"?xpage=xpart&vm="+c,{method:"post",evalScripts:true,onComplete:function(f){$("docextrapanes").className="";
document.fire("xwiki:docextra:loaded",{id:b,element:$(b+"pane")});
d(b);
if(e){$(b+"anchor").id=b;
location.href="#"+b;
$(b).id=b+"anchor"
}}})
}else{d(b);
if(e){$(b+"anchor").id=b;
location.href="#"+b;
$(b).id=b+"anchor"
}}},makeRenderingErrorsExpandable:function(b){if(typeof b=="undefined"){b=document.body
}$(b).select(".xwikirenderingerror").each(function(c){if(c.next().innerHTML!==""&&c.next().hasClassName("xwikirenderingerrordescription")){c.style.cursor="pointer";
c.title="Read technical information related to this error";
Event.observe(c,"click",function(d){d.element().next().toggleClassName("hidden")
})
}})
},fixLinksTargetAttribute:function(g){if(a.contextaction=="view"||a.contextaction=="preview"){if(typeof g=="undefined"){g=document.body
}var f=g.select("a[rel]");
for(var e=0;
e<f.length;
e++){var d=f[e];
if(d.getAttribute("href")&&d.getAttribute("rel")){var b=d.getAttribute("rel").split(" ");
for(var c=0;
c<b.length;
c++){if(b[c].charAt(0)=="_"){d.target=b[c].substring(1);
break
}else{if(b[c]=="external"){d.target="_blank";
break
}}}}}}},insertSectionEditLinks:function(){if(a.docsyntax!="xwiki/1.0"&&a.contextaction=="view"&&a.hasEdit){var e=1;
var b=$("xwikicontent");
if(!b){return
}b=b.childNodes;
var d=new RegExp("H[1-"+3+"]");
for(var c=0;
c<b.length;
c++){var g=$(b[c]);
if(d.test(g.nodeName)&&g.className.include("wikigeneratedheader")==false){var f=document.createElement("SPAN");
var h=document.createElement("A");
h.href=window.docediturl+"?section="+e;
h.style.textDecoration="none";
h.innerHTML="Edit";
f.className="edit_section";
f.appendChild(h);
g.insert({after:f});
e++
}}}},insertCreatePageFromTemplateModalBoxes:function(){if(a.docsyntax!="xwiki/1.0"&&a.contextaction=="view"&&a.hasEdit&&a.widgets.ModalPopup){a.widgets.CreatePagePopup=Class.create(a.widgets.ModalPopup,{initialize:function($super,e){var d=new Element("div",{"class":"modal-popup"});
d.insert(e.content);
$super(d,{show:{method:this.showDialog,keys:[]},close:{method:this.closeDialog,keys:["Esc"]}},{displayCloseButton:true,verticalPosition:"center",backgroundColor:"#FFF"});
this.showDialog();
this.setClass("createpage-modal-popup")
}});
var c=document.body.select("span.wikicreatelink");
for(var b=0;
b<c.length;
b++){c[b].down("a").observe("click",function(d){new Ajax.Request(d.findElement("a").href+"&xpage=createinline&ajax=1",{method:"get",onSuccess:function(f){var e=f.getHeader("redirect");
if(e){window.location=e
}else{new a.widgets.CreatePagePopup({content:f.responseText})
}},onFailure:function(){new a.widgets.Notification("An error occurred, please refresh the page and try again","error",{inactive:true}).show()
}});
d.stop()
})
}}},watchlist:{actionsMap:{tmWatchDocument:"adddocument",tmUnwatchDocument:"removedocument",tmWatchSpace:"addspace",tmUnwatchSpace:"removespace",tmWatchWiki:"addwiki",tmUnwatchWiki:"removewiki"},flowMap:{tmWatchDocument:"tmUnwatchDocument",tmUnwatchDocument:"tmWatchDocument",tmWatchSpace:"tmUnwatchSpace",tmUnwatchSpace:"tmWatchSpace",tmWatchWiki:"tmUnwatchWiki",tmUnwatchWiki:"tmWatchWiki"},executeAction:function(b){var d=window.docgeturl+"?xpage=watch&do="+this.actionsMap[b.id];
var c=new Ajax.Request(d,{method:"get",onComplete:function(){if(b.nodeName=="A"){b.up().toggleClassName("hidden");
$(a.watchlist.flowMap[b.id]).up().toggleClassName("hidden")
}else{b.toggleClassName("hidden");
$(a.watchlist.flowMap[b.id]).toggleClassName("hidden")
}}})
},initialize:function(){for(button in a.watchlist.actionsMap){if($(button)!=null){var c=$(button);
var b=this;
if(c.nodeName!="A"){c=$(button).down("A")
}c.stopObserving("click");
c.observe("click",function(e){Event.stop(e);
var d=e.element();
while(d.id==""){d=d.up()
}a.watchlist.executeAction(d)
})
}}}},cookies:{create:function(d,e,f){if(f){var c=new Date();
c.setTime(c.getTime()+(f*24*60*60*1000));
var b="; expires="+c.toGMTString()
}else{var b=""
}document.cookie=d+"="+e+b+"; path=/"
},read:function(d){var f=d+"=";
var b=document.cookie.split(";");
for(var e=0;
e<b.length;
e++){var g=b[e];
while(g.charAt(0)==" "){g=g.substring(1,g.length)
}if(g.indexOf(f)==0){return g.substring(f.length,g.length)
}}return null
},erase:function(b){a.cookies.create(b,"",-1)
}},togglePanelVisibility:function(b){b=$(b);
b.toggleClassName("collapsed")
},registerPanelToggle:function(){$$(".panel .xwikipaneltitle").each(function(b){b.observe("click",this.togglePanelVisibility.bind(this,b.up(".panel")))
}.bind(this))
},initialize:function(){if(typeof this.isInitialized=="undefined"||this.isInitialized==false){if(typeof a.lastScriptLoaded=="undefined"){a.failedInit=true;
return
}this.isInitialized=true;
document.fire("xwiki:dom:loading");
this.makeRenderingErrorsExpandable();
this.fixLinksTargetAttribute();
this.insertSectionEditLinks();
this.insertCreatePageFromTemplateModalBoxes();
this.watchlist.initialize();
this.registerPanelToggle();
this.domIsLoaded=true;
document.fire("xwiki:dom:loaded")
}}});
return a
})(XWiki||{});
document.observe("dom:loaded",XWiki.initialize.bind(XWiki));
function showsubmenu(a){if(a.lastChild.tagName.toLowerCase()=="span"){if(window.hidetimer){if(window.hideelement==a.lastChild){clearTimeout(window.hidetimer);
window.hidetimer=null;
window.hideelement=null
}else{doHide()
}}var b=Element.positionedOffset(a);
a.lastChild.style.left=(b[0]-10)+"px";
a.lastChild.style.top=(b[1]+a.offsetHeight)+"px";
a.lastChild.className=a.lastChild.className.replace("hidden","visible")
}}function hidesubmenu(a){if(a.lastChild.tagName.toLowerCase()=="span"){window.hideelement=a.lastChild;
window.hidetimer=setTimeout(doHide,100)
}}function doHide(){window.hideelement.className=window.hideelement.className.replace("visible","hidden");
clearTimeout(window.hidetimer);
window.hidetimer=null;
window.hideelement=null
}function toggleClass(b,a){if(!eltHasClass(b,a)){b.className+=" "+a
}else{rmClass(b,a)
}}function addClass(b,a){if(!eltHasClass(b,a)){b.className+=" "+a
}}function eltHasClass(b,a){if(!b.className){return false
}return new RegExp("\\b"+a+"\\b").test(b.className)
}function rmClass(b,a){b.className=b.className.replace(new RegExp("\\s*\\b"+a+"\\b"),"")
}function openURL(a){win=open(a,"win","titlebar=0,width=990,height=500,resizable,scrollbars");
if(win){win.focus()
}}function openHelp(){win=open("../../../../../../../../platform.xwiki.org/xwiki/bin/view/Main/XWikiSyntax-xpage=print"/*tpa=http://platform.xwiki.org/xwiki/bin/view/Main/XWikiSyntax?xpage=print*/,"XWikiSyntax","titlebar=0,width=750,height=480,resizable,scrollbars");
if(win){win.focus()
}}function updateName(a,d,c){var b=a.value;
b=noaccent(b);
if(c!=false){b=b.replace(/class$/gi,"")
}if(d==null){a.value=b
}else{d.value=b
}if(b==""){return false
}return true
}function noaccent(a){temp=a.replace(/[\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u0100\u0102\u0104\u01cd\u01de\u01e0\u01fa\u0200\u0202\u0226]/g,"A");
temp=temp.replace(/[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u0101\u0103\u0105\u01ce\u01df\u01e1\u01fb\u0201\u0203\u0227]/g,"a");
temp=temp.replace(/[\u00c6\u01e2\u01fc]/g,"AE");
temp=temp.replace(/[\u00e6\u01e3\u01fd]/g,"ae");
temp=temp.replace(/[\u008c\u0152]/g,"OE");
temp=temp.replace(/[\u009c\u0153]/g,"oe");
temp=temp.replace(/[\u00c7\u0106\u0108\u010a\u010c]/g,"C");
temp=temp.replace(/[\u00e7\u0107\u0109\u010b\u010d]/g,"c");
temp=temp.replace(/[\u00d0\u010e\u0110]/g,"D");
temp=temp.replace(/[\u00f0\u010f\u0111]/g,"d");
temp=temp.replace(/[\u00c8\u00c9\u00ca\u00cb\u0112\u0114\u0116\u0118\u011a\u0204\u0206\u0228]/g,"E");
temp=temp.replace(/[\u00e8\u00e9\u00ea\u00eb\u0113\u0115\u0117\u0119\u011b\u01dd\u0205\u0207\u0229]/g,"e");
temp=temp.replace(/[\u011c\u011e\u0120\u0122\u01e4\u01e6\u01f4]/g,"G");
temp=temp.replace(/[\u011d\u011f\u0121\u0123\u01e5\u01e7\u01f5]/g,"g");
temp=temp.replace(/[\u0124\u0126\u021e]/g,"H");
temp=temp.replace(/[\u0125\u0127\u021f]/g,"h");
temp=temp.replace(/[\u00cc\u00cd\u00ce\u00cf\u0128\u012a\u012c\u012e\u0130\u01cf\u0208\u020a]/g,"I");
temp=temp.replace(/[\u00ec\u00ed\u00ee\u00ef\u0129\u012b\u012d\u012f\u0131\u01d0\u0209\u020b]/g,"i");
temp=temp.replace(/[\u0132]/g,"IJ");
temp=temp.replace(/[\u0133]/g,"ij");
temp=temp.replace(/[\u0134]/g,"J");
temp=temp.replace(/[\u0135]/g,"j");
temp=temp.replace(/[\u0136\u01e8]/g,"K");
temp=temp.replace(/[\u0137\u0138\u01e9]/g,"k");
temp=temp.replace(/[\u0139\u013b\u013d\u013f\u0141]/g,"L");
temp=temp.replace(/[\u013a\u013c\u013e\u0140\u0142\u0234]/g,"l");
temp=temp.replace(/[\u00d1\u0143\u0145\u0147\u014a\u01f8]/g,"N");
temp=temp.replace(/[\u00f1\u0144\u0146\u0148\u0149\u014b\u01f9\u0235]/g,"n");
temp=temp.replace(/[\u00d2\u00d3\u00d4\u00d5\u00d6\u00d8\u014c\u014e\u0150\u01d1\u01ea\u01ec\u01fe\u020c\u020e\u022a\u022c\u022e\u0230]/g,"O");
temp=temp.replace(/[\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u014d\u014f\u0151\u01d2\u01eb\u01ed\u01ff\u020d\u020f\u022b\u022d\u022f\u0231]/g,"o");
temp=temp.replace(/[\u0156\u0158\u0210\u0212]/g,"R");
temp=temp.replace(/[\u0157\u0159\u0211\u0213]/g,"r");
temp=temp.replace(/[\u015a\u015c\u015e\u0160\u0218]/g,"S");
temp=temp.replace(/[\u015b\u015d\u015f\u0161\u0219]/g,"s");
temp=temp.replace(/[\u00de\u0162\u0164\u0166\u021a]/g,"T");
temp=temp.replace(/[\u00fe\u0163\u0165\u0167\u021b\u0236]/g,"t");
temp=temp.replace(/[\u00d9\u00da\u00db\u00dc\u0168\u016a\u016c\u016e\u0170\u0172\u01d3\u01d5\u01d7\u01d9\u01db\u0214\u0216]/g,"U");
temp=temp.replace(/[\u00f9\u00fa\u00fb\u00fc\u0169\u016b\u016d\u016f\u0171\u0173\u01d4\u01d6\u01d8\u01da\u01dc\u0215\u0217]/g,"u");
temp=temp.replace(/[\u0174]/g,"W");
temp=temp.replace(/[\u0175]/g,"w");
temp=temp.replace(/[\u00dd\u0176\u0178\u0232]/g,"Y");
temp=temp.replace(/[\u00fd\u00ff\u0177\u0233]/g,"y");
temp=temp.replace(/[\u0179\u017b\u017d]/g,"Z");
temp=temp.replace(/[\u017a\u017c\u017e]/g,"z");
temp=temp.replace(/[\u00df]/g,"SS");
temp=temp.replace(/[^a-zA-Z0-9_]/g,"");
return temp
}function prepareName(b){var d=b.register_first_name.value;
var a=b.register_last_name.value;
var c=b.xwikiname;
if(d!=""){d=d.substring(0,1).toUpperCase()+d.substring(1);
d.replace(/ /g,"")
}if(a!=""){a=a.substring(0,1).toUpperCase()+a.substring(1);
a.replace(/ /g,"")
}if(c.value==""){c.value=noaccent(d+a)
}}function checkAdvancedContent(a){result=false;
if(!document.forms.edit){return true
}data=document.forms.edit.content.value;
myRE=new RegExp("</?(html|body|img|a|i|b|embed|script|form|input|textarea|object|font|li|ul|ol|table|center|hr|br|p) ?([^>]*)>","ig");
results=data.match(myRE);
if(results&&results.length>0){result=true
}myRE2=new RegExp("(#(set|include|if|end|for)|#(#) Advanced content|public class|/* Advanced content */)","ig");
results=data.match(myRE2);
if(results&&results.length>0){result=true
}if(result==true){return confirm(a)
}return true
}shortcut={all_shortcuts:{},add:function(b,h,d){var g={type:"keydown",propagate:false,disable_in_input:false,target:document,keycode:false};
if(!d){d=g
}else{for(var a in g){if(typeof d[a]=="undefined"){d[a]=g[a]
}}}var f=d.target;
if(typeof d.target=="string"){f=document.getElementById(d.target)
}var c=this;
b=b.toLowerCase();
var e=function(p){p=p||window.event;
if(d.disable_in_input){var m;
if(p.target){m=p.target
}else{if(p.srcElement){m=p.srcElement
}}if(m.nodeType==3){m=m.parentNode
}if(m.tagName=="INPUT"||m.tagName=="TEXTAREA"||m.tagName=="SELECT"){return
}}var j=0;
if(p.keyCode){j=p.keyCode
}else{if(p.which){j=p.which
}}var o=String.fromCharCode(j).toLowerCase();
if(j==188){o=","
}if(j==190){o="."
}var t=b.split("+");
var s=0;
var q={"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":":","'":'"',",":"<",".":">","/":"?","\\":"|"};
var n={esc:27,escape:27,tab:9,space:32,"return":13,enter:13,backspace:8,scrolllock:145,scroll_lock:145,scroll:145,capslock:20,caps_lock:20,caps:20,numlock:144,num_lock:144,num:144,pause:19,"break":19,insert:45,home:36,"delete":46,end:35,pageup:33,page_up:33,pu:33,pagedown:34,page_down:34,pd:34,left:37,up:38,right:39,down:40,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123};
var r={shift:{wanted:false,pressed:false},ctrl:{wanted:false,pressed:false},alt:{wanted:false,pressed:false},meta:{wanted:false,pressed:false}};
if(p.ctrlKey){r.ctrl.pressed=true
}if(p.shiftKey){r.shift.pressed=true
}if(p.altKey){r.alt.pressed=true
}if(p.metaKey){r.meta.pressed=true
}for(var l=0;
k=t[l],l<t.length;
l++){if(k=="ctrl"||k=="control"){s++;
r.ctrl.wanted=true
}else{if(k=="shift"){s++;
r.shift.wanted=true
}else{if(k=="alt"){s++;
r.alt.wanted=true
}else{if(k=="meta"){s++;
r.meta.wanted=true
}else{if(k.length>1){if(n[k]==j){s++
}}else{if(d.keycode){if(d.keycode==j){s++
}}else{if(o==k){s++
}else{if(q[o]&&p.shiftKey){o=q[o];
if(o==k){s++
}}}}}}}}}}if(s==t.length&&r.ctrl.pressed==r.ctrl.wanted&&r.shift.pressed==r.shift.wanted&&r.alt.pressed==r.alt.wanted&&r.meta.pressed==r.meta.wanted){h(p);
if(!d.propagate){p.cancelBubble=true;
p.returnValue=false;
if(document.all&&!window.opera&&window.XMLHttpRequest){p.keyCode=0
}if(p.stopPropagation){p.stopPropagation();
p.preventDefault()
}return false
}}};
this.all_shortcuts[b]={callback:e,target:f,event:d.type};
if(f.addEventListener){f.addEventListener(d.type,e,false)
}else{if(f.attachEvent){f.attachEvent("on"+d.type,e)
}else{f["on"+d.type]=e
}}},remove:function(a){a=a.toLowerCase();
var d=this.all_shortcuts[a];
delete (this.all_shortcuts[a]);
if(!d){return
}var b=d.event;
var c=d.target;
var e=d.callback;
if(c.detachEvent){c.detachEvent("on"+b,e)
}else{if(c.removeEventListener){c.removeEventListener(b,e,false)
}else{c["on"+b]=false
}}}};
function BrowserDetect(){var a=navigator.userAgent.toLowerCase();
this.isGecko=(a.indexOf("gecko")!=-1&&a.indexOf("safari")==-1);
this.isAppleWebKit=(a.indexOf("applewebkit")!=-1);
this.isKonqueror=(a.indexOf("konqueror")!=-1);
this.isSafari=(a.indexOf("safari")!=-1);
this.isOmniweb=(a.indexOf("omniweb")!=-1);
this.isOpera=(a.indexOf("opera")!=-1);
this.isIcab=(a.indexOf("icab")!=-1);
this.isAol=(a.indexOf("aol")!=-1);
this.isIE=(a.indexOf("msie")!=-1&&!this.isOpera&&(a.indexOf("webtv")==-1));
this.isMozilla=(this.isGecko&&a.indexOf("gecko/")+14==a.length);
this.isFirefox=(a.indexOf("firefox/")!=-1||a.indexOf("firebird/")!=-1);
this.isNS=((this.isGecko)?(a.indexOf("netscape")!=-1):((a.indexOf("mozilla")!=-1)&&!this.isOpera&&!this.isSafari&&(a.indexOf("spoofer")==-1)&&(a.indexOf("compatible")==-1)&&(a.indexOf("webtv")==-1)&&(a.indexOf("hotjava")==-1)));
this.isIECompatible=((a.indexOf("msie")!=-1)&&!this.isIE);
this.isNSCompatible=((a.indexOf("mozilla")!=-1)&&!this.isNS&&!this.isMozilla);
this.geckoVersion=((this.isGecko)?a.substring((a.lastIndexOf("gecko/")+6),(a.lastIndexOf("gecko/")+14)):-1);
this.equivalentMozilla=((this.isGecko)?parseFloat(a.substring(a.indexOf("rv:")+3)):-1);
this.appleWebKitVersion=((this.isAppleWebKit)?parseFloat(a.substring(a.indexOf("applewebkit/")+12)):-1);
this.versionMinor=parseFloat(navigator.appVersion);
if(this.isGecko&&!this.isMozilla){this.versionMinor=parseFloat(a.substring(a.indexOf("/",a.indexOf("gecko/")+6)+1))
}else{if(this.isMozilla){this.versionMinor=parseFloat(a.substring(a.indexOf("rv:")+3))
}else{if(this.isIE&&this.versionMinor>=4){this.versionMinor=parseFloat(a.substring(a.indexOf("msie ")+5))
}else{if(this.isKonqueror){this.versionMinor=parseFloat(a.substring(a.indexOf("konqueror/")+10))
}else{if(this.isSafari){this.versionMinor=parseFloat(a.substring(a.lastIndexOf("safari/")+7))
}else{if(this.isOmniweb){this.versionMinor=parseFloat(a.substring(a.lastIndexOf("omniweb/")+8))
}else{if(this.isOpera){this.versionMinor=parseFloat(a.substring(a.indexOf("opera")+6))
}else{if(this.isIcab){this.versionMinor=parseFloat(a.substring(a.indexOf("icab")+5))
}}}}}}}}this.versionMajor=parseInt(this.versionMinor);
this.isDOM1=(document.getElementById);
this.isDOM2Event=(document.addEventListener&&document.removeEventListener);
this.mode=document.compatMode?document.compatMode:"BackCompat";
this.isWin=(a.indexOf("win")!=-1);
this.isWin32=(this.isWin&&(a.indexOf("95")!=-1||a.indexOf("98")!=-1||a.indexOf("nt")!=-1||a.indexOf("win32")!=-1||a.indexOf("32bit")!=-1||a.indexOf("xp")!=-1));
this.isMac=(a.indexOf("mac")!=-1);
this.isUnix=(a.indexOf("unix")!=-1||a.indexOf("sunos")!=-1||a.indexOf("bsd")!=-1||a.indexOf("x11")!=-1);
this.isLinux=(a.indexOf("linux")!=-1);
this.isNS4x=(this.isNS&&this.versionMajor==4);
this.isNS40x=(this.isNS4x&&this.versionMinor<4.5);
this.isNS47x=(this.isNS4x&&this.versionMinor>=4.7);
this.isNS4up=(this.isNS&&this.versionMinor>=4);
this.isNS6x=(this.isNS&&this.versionMajor==6);
this.isNS6up=(this.isNS&&this.versionMajor>=6);
this.isNS7x=(this.isNS&&this.versionMajor==7);
this.isNS7up=(this.isNS&&this.versionMajor>=7);
this.isIE4x=(this.isIE&&this.versionMajor==4);
this.isIE4up=(this.isIE&&this.versionMajor>=4);
this.isIE5x=(this.isIE&&this.versionMajor==5);
this.isIE55=(this.isIE&&this.versionMinor==5.5);
this.isIE5up=(this.isIE&&this.versionMajor>=5);
this.isIE6x=(this.isIE&&this.versionMajor==6);
this.isIE6up=(this.isIE&&this.versionMajor>=6);
this.isIE4xMac=(this.isIE4x&&this.isMac)
}var browser=new BrowserDetect();
XWiki.Document=Class.create({initialize:function(c,b,a){this.page=c||XWiki.Document.currentPage;
this.space=b||XWiki.Document.currentSpace;
this.wiki=a||XWiki.Document.currentWiki
},getURL:function(c,d,b){c=c||"view";
var a=XWiki.Document.URLTemplate;
a=a.replace("__space__",encodeURIComponent(this.space));
a=a.replace("__page__",(this.page=="WebHome")?"":encodeURIComponent(this.page));
a=a.replace("__action__/",(c=="view")?"":(encodeURIComponent(c)+"/"));
if(d){a+="?"+d
}if(b){a+="#"+b
}return a
},getRestURL:function(a,c){a=a||"";
var b=XWiki.Document.RestURLTemplate;
b=b.replace("__wiki__",this.wiki);
b=b.replace("__space__",this.space);
b=b.replace("__page__",this.page);
if(a){b+="/"+a
}if(c){b+="?"+c
}return b
}});
document.observe("xwiki:dom:loading",function(){XWiki.Document.currentWiki=($$("meta[name=wiki]").length>0)?$$("meta[name=wiki]")[0].content:(XWiki.currentWiki||"xwiki");
XWiki.Document.currentSpace=($$("meta[name=space]").length>0)?$$("meta[name=space]")[0].content:(XWiki.currentSpace||"Main");
XWiki.Document.currentPage=($$("meta[name=page]").length>0)?$$("meta[name=page]")[0].content:(XWiki.currentPage||"WebHome");
XWiki.Document.URLTemplate="/xwiki/wiki/opencaselist11/__action__/__space__/__page__";
XWiki.Document.RestURLTemplate="/xwiki/rest/wikis/__wiki__/spaces/__space__/pages/__page__";
XWiki.Document.WikiSearchURLStub="/xwiki/rest/wikis/__wiki__/search";
XWiki.Document.SpaceSearchURLStub="/xwiki/rest/wikis/__wiki__/spaces/__space__/search";
XWiki.Document.getRestSearchURL=function(d,c,a){a=a||XWiki.Document.currentWiki;
var b;
if(c){b=XWiki.Document.SpaceSearchURLStub.replace("__wiki__",a).replace("__space__",c)
}else{b=XWiki.Document.WikiSearchURLStub.replace("__wiki__",a)
}if(d){b+="?"+d
}return b
};
XWiki.currentDocument=new XWiki.Document()
});
(function(){var a=function(){if(this.value==this.defaultValue){this.value=""
}else{this.select()
}};
var b=function(){if(this.value==""){this.value=this.defaultValue
}};
document.observe("xwiki:addBehavior:withTip",function(d){var c=d.memo.element;
if(c){c.observe("focus",a.bindAsEventListener(c));
c.observe("blur",b.bindAsEventListener(c))
}});
document.observe("xwiki:dom:loaded",function(){$$("input.withTip","textarea.withTip").each(function(c){document.fire("xwiki:addBehavior:withTip",{element:c})
})
});
document.observe("xwiki:dom:updated",function(c){c.memo.elements.each(function(d){d.select("input.withTip","textarea.withTip").each(function(e){document.fire("xwiki:addBehavior:withTip",{element:e})
})
})
})
})();
document.observe("xwiki:dom:loaded",function(){var b={documents:{script:XWiki.Document.getRestSearchURL("scope=name&number=10&media=json&"),varname:"q",icon:"../../../../../../resources/icons/silk/page_white_text.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/resources/icons/silk/page_white_text.png*/,noresults:"Document not found",json:true,resultsParameter:"searchResults",resultId:"id",resultValue:"pageFullName",resultInfo:"pageFullName"},spaces:{script:XWiki.Document.getRestSearchURL("scope=spaces&number=10&media=json&"),varname:"q",icon:"../../../../../../resources/icons/silk/folder.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/resources/icons/silk/folder.png*/,noresults:"Space not found",json:true,resultsParameter:"searchResults",resultId:"id",resultValue:"space",resultInfo:"space"},users:{script:XWiki.currentDocument.getURL("get","xpage=uorgsuggest&classname=XWiki.XWikiUsers&wiki=local&uorg=user&"),varname:"input",icon:"../../../../../../resources/icons/silk/user.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/resources/icons/silk/user.png*/,noresults:"User not found"},groups:{script:XWiki.currentDocument.getURL("get","xpage=uorgsuggest&classname=XWiki.XWikiGroups&wiki=local&uorg=group&"),varname:"input",icon:"../../../../../../resources/icons/silk/group.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/resources/icons/silk/group.png*/,noresults:"Group not found"}};
var a=function(f){if(typeof(XWiki.widgets.Suggest)!="undefined"){var e=Object.keys(b);
for(var d=0;
d<e.length;
d++){var c="input.suggest"+e[d].capitalize();
f.each(function(g){$(g).select(c).each(function(i){if(!i.hasClassName("initialized")){var h={timeout:30000,parentContainer:i.up()};
Object.extend(h,b[e[d]]);
var j=new XWiki.widgets.Suggest(i,h);
i.addClassName("initialized")
}})
})
}}};
a([$(document.documentElement)]);
document.observe("xwiki:dom:updated",function(c){a(c.memo.elements)
})
});
["xwiki:dom:loaded","xwiki:dom:updated"].each(function(a){document.observe(a,function(b){if(typeof(XWiki.widgets.Suggest)!="undefined"){var c=b.memo&&b.memo.elements||[document.documentElement];
c.each(function(d){d.select(".suggested").each(function(e){e.setAttribute("autocomplete","off");
if(typeof e.onfocus==="function"){e.onfocus();
e.removeAttribute("onfocus")
}})
})
}})
});
document.observe("xwiki:dom:loaded",function(){var h=$("hierarchy");
var d=$("breadcrumbs");
var f=$("editParentTrigger");
var b=$("parentinput");
var a=$("xwikidocparentinput");
var g=$("xwikidoctitleinput");
function e(j){if(j){j.stop()
}b.removeClassName("active");
f.addClassName("edit-parent");
f.removeClassName("hide-edit-parent")
}function i(j){if(j){j.stop()
}b.addClassName("active");
a.focus();
f.removeClassName("edit-parent");
f.addClassName("hide-edit-parent")
}function c(j){j.stop();
j.element().blur();
if(f.hasClassName("edit-parent")){i()
}else{e()
}}if($("hideEditParentTrigger")){$("hideEditParentTrigger").style.display="none"
}if(f){f.observe("click",c)
}if(a){if(h||d){["blur","change","xwiki:suggest:selected"].each(function(j){a.observe(j,function(){var l={xpage:"xpart",vm:(h?"hierarchy.vm"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/opencaselist11/skin/resources/js/xwiki/hierarchy.vm*/:"space.vm"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/opencaselist11/skin/resources/js/xwiki/space.vm*/),parent:a.value};
if(g){l.title=g.value
}new Ajax.Request(XWiki.currentDocument.getURL("edit"),{parameters:l,onSuccess:function(m){if(h){h.replace(m.responseText);
h=$("hierarchy")
}else{var n=new Element("div");
n.update(m.responseText);
d.replace(n.down("[id=breadcrumbs]"));
d=$("breadcrumbs")
}}})
})
})
}$("body").observe("click",function(j){if(!j.element().descendantOf(b)&&j.element()!=b&&j.element()!=f){e()
}})
}});
document.observe("xwiki:dom:loaded",function(){var f=$("contentmenu")||$("editmenu");
var d=$("mainContentArea")||$("mainEditArea");
if(f&&d){e(f);
Event.observe(window,"resize",function(){if(f.style.position=="fixed"){f.style.width=d.getWidth()+"px";
if(typeof(f.__fm_extra)!="undefined"){if(f.__fm_extra.getStyle("padding-left").replace(/[^a-z]/g,"")=="px"){var g=f.__fm_extra.getStyle("border-left-width").replace(/[^0-9.]/g,"")-0;
g+=f.__fm_extra.getStyle("padding-left").replace(/[^0-9.]/g,"")-0;
g+=f.__fm_extra.getStyle("padding-right").replace(/[^0-9.]/g,"")-0;
g+=f.__fm_extra.getStyle("border-right-width").replace(/[^0-9.]/g,"")-0
}else{g=50
}f.__fm_extra.style.width=(d.getWidth()-g)+"px"
}}});
if(!browser.isIE6x){Event.observe(window,"scroll",b);
document.observe("xwiki:annotations:settings:loaded",b)
}}function b(){var h=$$(".annotationsettings");
var g=0;
if(h&&h.size()>0){f.__fm_extra=h[0];
e(f.__fm_extra);
g=f.__fm_extra.getHeight()
}var m=f.getHeight();
var l=d.cumulativeOffset().top-g;
if(document.viewport.getScrollOffsets().top>=l){var j=d.getWidth();
var i=d.cumulativeOffset().left;
c(f,0,i,j);
if(f.__fm_extra){c(f.__fm_extra,m,i,(j-f.__fm_extra.getStyle("border-left-width").replace(/[^0-9]/g,"")-f.__fm_extra.getStyle("border-right-width").replace(/[^0-9]/g,"")-f.__fm_extra.getStyle("padding-right").replace(/[^0-9]/g,"")-f.__fm_extra.getStyle("padding-left").replace(/[^0-9]/g,"")))
}}else{a(f);
a(f.__fm_extra)
}}function e(g){if(typeof(g.__fm_ghost)=="undefined"){g.__fm_ghost=new Element("div");
g.__fm_ghost.hide();
g.insert({after:g.__fm_ghost})
}g.__fm_ghost.clonePosition(g,{setWidth:false})
}function c(g,j,i,h){if(g){g.addClassName("floating-menu");
g.style.position="fixed";
g.style.top=j+"px";
g.style.left=i+"px";
g.style.width=h+"px";
g.__fm_ghost.show()
}}function a(g){if(g){g.removeClassName("floating-menu");
g.style.position="";
g.style.top="";
g.style.left="";
g.style.width="";
g.__fm_ghost.hide()
}}});