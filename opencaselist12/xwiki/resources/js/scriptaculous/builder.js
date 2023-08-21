var Builder={NODEMAP:{AREA:"map",CAPTION:"table",COL:"table",COLGROUP:"table",LEGEND:"fieldset",OPTGROUP:"select",OPTION:"select",PARAM:"object",TBODY:"table",TD:"table",TFOOT:"table",TH:"table",THEAD:"table",TR:"table"},node:function(a){a=a.toUpperCase();
var g=this.NODEMAP[a]||"div";
var b=document.createElement(g);
try{b.innerHTML="<"+a+"></"+a+">"
}catch(f){}var d=b.firstChild||null;
if(d&&(d.tagName.toUpperCase()!=a)){d=d.getElementsByTagName(a)[0]
}if(!d){d=document.createElement(a)
}if(!d){return
}if(arguments[1]){if(this._isStringOrNumber(arguments[1])||(arguments[1] instanceof Array)||arguments[1].tagName){this._children(d,arguments[1])
}else{var c=this._attributes(arguments[1]);
if(c.length){try{b.innerHTML="<"+a+" "+c+"></"+a+">"
}catch(f){}d=b.firstChild||null;
if(!d){d=document.createElement(a);
for(attr in arguments[1]){d[attr=="class"?"className":attr]=arguments[1][attr]
}}if(d.tagName.toUpperCase()!=a){d=b.getElementsByTagName(a)[0]
}}}}if(arguments[2]){this._children(d,arguments[2])
}return $(d)
},_text:function(a){return document.createTextNode(a)
},ATTR_MAP:{className:"class",htmlFor:"for"},_attributes:function(a){var b=[];
for(attribute in a){b.push((attribute in this.ATTR_MAP?this.ATTR_MAP[attribute]:attribute)+'="'+a[attribute].toString().escapeHTML().gsub(/"/,"&quot;")+'"')
}return b.join(" ")
},_children:function(b,a){if(a.tagName){b.appendChild(a);
return
}if(typeof a=="object"){a.flatten().each(function(c){if(typeof c=="object"){b.appendChild(c)
}else{if(Builder._isStringOrNumber(c)){b.appendChild(Builder._text(c))
}}})
}else{if(Builder._isStringOrNumber(a)){b.appendChild(Builder._text(a))
}}},_isStringOrNumber:function(a){return(typeof a=="string"||typeof a=="number")
},build:function(b){var a=this.node("div");
$(a).update(b.strip());
return a.down()
},dump:function(b){if(typeof b!="object"&&typeof b!="function"){b=window
}var a=("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
a.each(function(c){b[c]=function(){return Builder.node.apply(Builder,[c].concat($A(arguments)))
}
})
}};