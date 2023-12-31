var XWiki=(function(b){var a=b.widgets=b.widgets||{};
a.Notification=Class.create({text:"Hello world!",defaultOptions:{plain:{timeout:5},info:{timeout:5},warning:{timeout:5},error:{timeout:10},inprogress:{timeout:false},done:{timeout:2}},initialize:function(e,d,c){this.text=e||this.text;
this.type=(typeof this.defaultOptions[d]!="undefined")?d:"plain";
this.options=Object.extend(Object.clone(this.defaultOptions[this.type]),c||{});
this.createElement();
if(!this.options.inactive){this.show()
}},createElement:function(){if(!this.element){this.element=new Element("div",{"class":"xnotification xnotification-"+this.type}).update(this.text);
if(this.options.icon){this.element.setStyle({backgroundImage:this.options.icon,paddingLeft:"22px"})
}if(this.options.backgroundColor){this.element.setStyle({backgroundColor:this.options.backgroundColor})
}if(this.options.color){this.element.setStyle({color:this.options.color})
}this.element=this.element.wrap(new Element("div",{"class":"xnotification-wrapper"}));
Event.observe(this.element,"click",this.hide.bindAsEventListener(this))
}},show:function(){if(!this.element.descendantOf(a.Notification.getContainer())){a.Notification.getContainer().insert({top:this.element})
}this.element.show();
if(this.options.timeout){this.timer=window.setTimeout(this.hide.bind(this),this.options.timeout*1000)
}},hide:function(){this.element.hide();
if(this.element.parentNode){this.element.remove()
}if(this.timer){window.clearTimeout(this.timer);
this.timer=null
}},replace:function(c){if(this.element.parentNode){this.element.replace(c.element)
}if(this.timer){window.clearTimeout(this.timer);
this.timer=null
}c.show()
}});
a.Notification.container=null;
a.Notification.getContainer=function(){if(!a.Notification.container){a.Notification.container=new Element("div",{"class":"xnotification-container"});
$("body").insert(a.Notification.container)
}return a.Notification.container
};
return b
}(XWiki||{}));