var XWiki=(function(b){var a=b.viewers=b.viewers||{};
a.Attachments=Class.create({counter:1,initialize:function(){if($("attachform")){this.addDeleteListener();
this.prepareForm()
}else{this.addTabLoadListener()
}},addDeleteListener:function(){$$(".attachment a.deletelink").each(function(c){c.observe("click",function(d){c.blur();
d.stop();
if(c.disabled){return
}else{new b.widgets.ConfirmedAjaxRequest(c.readAttribute("href")+(Prototype.Browser.Opera?"":"&ajax=1"),{onCreate:function(){c.disabled=true
},onSuccess:function(){c.up(".attachment").remove();
this.updateCount()
}.bind(this),onComplete:function(){c.disabled=false
}},{confirmationText:"Are you sure you want to delete this attachment?",progressMessageText:"Deleting...",successMessageText:"Attachment deleted",failureMessageText:"Failed to delete attachment: "})
}}.bindAsEventListener(this))
}.bind(this))
},updateCount:function(){if($("Attachmentstab")&&$("Attachmentstab").down(".itemCount")){$("Attachmentstab").down(".itemCount").update("(__number__)".replace("__number__",$("Attachmentspane").select(".attachment").size()))
}if($("attachmentsshortcut")&&$("attachmentsshortcut").down(".itemCount")){$("attachmentsshortcut").down(".itemCount").update("(__number__)".replace("__number__",$("Attachmentspane").select(".attachment").size()))
}},prepareForm:function(){if(!$("attachform")){return
}this.form=$("attachform").up("form");
this.defaultFileDiv=this.form.down("input[type='file']").up("div");
this.inputSize=this.form.down("input[type='file']").size;
var c=this.attachHTML5Uploader(this.form.down("input[type='file']"));
if(c){this.addDeleteListener=this.addDeleteListener.bindAsEventListener(this);
this.form.observe("xwiki:html5upload:done",this.addDeleteListener);
c.hideFormButtons()
}else{this.addInitialRemoveButton();
this.addAddButton();
this.resetOnCancel()
}this.blockEmptySubmit()
},attachHTML5Uploader:function(c){if(typeof(b.FileUploader)!="undefined"){c.multiple=true;
return new b.FileUploader(c,{responseContainer:$("_attachments"),responseURL:b.currentDocument.getURL("get","xpage=attachmentslist&forceTestRights=1")})
}return false
},addInitialRemoveButton:function(){this.defaultFileDiv.appendChild(this.createRemoveButton())
},addAddButton:function(){var c=new Element("input",{type:"button",value:"Add another file",className:"attachmentActionButton add-file-input"});
this.addDiv=new Element("div");
this.addDiv.appendChild(c);
Event.observe(c,"click",this.addField.bindAsEventListener(this));
this.defaultFileDiv.up().insertBefore(this.addDiv,this.defaultFileDiv.next())
},blockEmptySubmit:function(){Event.observe(this.form,"submit",this.onSubmit.bindAsEventListener(this))
},resetOnCancel:function(){Event.observe(this.form,"reset",this.onReset.bindAsEventListener(this));
Event.observe(this.form.down(".cancel"),"click",this.onReset.bindAsEventListener(this))
},addField:function(f){var e=new Element("input",{type:"file",name:"filepath_"+this.counter,size:this.inputSize,className:"uploadFileInput"});
var c=new Element("input",{type:"hidden",name:"filename_"+this.counter});
var d=this.createRemoveButton();
var g=new Element("div",{"class":"fileupload-field"});
g.insert(c).insert(e).insert(d);
this.addDiv.parentNode.insertBefore(g,this.addDiv);
f.element().blur();
this.counter++
},removeField:function(c){c.element().up("div").remove()
},createRemoveButton:function(){var c=new Element("input",{type:"button",value:"Remove",title:"Remove this file",className:"attachmentActionButton remove-file-input"});
Event.observe(c,"click",this.removeField.bindAsEventListener(this));
return c
},onSubmit:function(d){var c=false;
this.form.getInputs("file").each(function(e){if(e.value!=""){c=true
}});
if(!c){d.stop()
}},onReset:function(c){if(c){c.stop()
}this.form.getInputs("file").each(function(d){d.up().remove()
});
this.counter=1;
this.addField(c)
},addTabLoadListener:function(c){var d=function(e){if(e.memo.id=="Attachments"){this.addDeleteListener();
this.prepareForm();
document.stopObserving("xwiki:docextra:loaded",d);
delete d
}}.bindAsEventListener(this);
document.observe("xwiki:docextra:loaded",d)
}});
(b.domIsLoaded&&new a.Attachments())||document.observe("xwiki:dom:loaded",function(){new a.Attachments()
});
return b
}(XWiki||{}));