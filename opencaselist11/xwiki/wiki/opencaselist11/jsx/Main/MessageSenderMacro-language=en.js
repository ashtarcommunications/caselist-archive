var XWiki=(function(a){a.MessageStream=Class.create({targetsWithName:["user","group"],suggestParameters:{user:{script:"/xwiki/wiki/opencaselist11/get/Main/MessageSenderMacro?xpage=uorgsuggest&classname=XWiki.XWikiUsers&wiki=local&uorg=user&",varname:"input",icon:"../../../../resources/icons/silk/user.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/resources/icons/silk/user.png*/,noresults:"User not found",timeout:30000,},group:{script:"/xwiki/wiki/opencaselist11/get/Main/MessageSenderMacro?xpage=uorgsuggest&classname=XWiki.XWikiGroups&wiki=local&uorg=group&",varname:"input",icon:"../../../../resources/icons/silk/group.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/resources/icons/silk/group.png*/,noresults:"Group not found",timeout:30000,}},initialize:function(){this.prepareForms();this.enhanceSelect()},prepareTargetInput:function(c,b){if(c){b.blur()}$w(b.className).each(function(e){b.removeClassName(e)});var d=b.options[b.selectedIndex].value;b.addClassName(d);if(!b.__targetNameInput){return}if(this.targetsWithName.indexOf(d)<0){b.__targetNameInput.addClassName("hidden");if(b.__targetNameInput.__x_suggest){b.__targetNameInput.__x_suggest.detach()}}else{b.__targetNameInput.removeClassName("hidden");if(this.suggestParameters[d]){new a.widgets.Suggest(b.__targetNameInput,this.suggestParameters[d])}}},enhanceSelect:function(){$$('.messagestream select[name="visibilityLevel"]').each(function(b){b.addClassName(b.options[b.selectedIndex].value);b.__targetNameInput=b.up(".messagestream").down('input[name="targetName"]');if(b.__targetNameInput&&this.targetsWithName.indexOf(b.options[b.selectedIndex].value)<0){b.__targetNameInput.addClassName("hidden")}b.observe("change",this.prepareTargetInput.bindAsEventListener(this,b));this.prepareTargetInput(null,b)}.bind(this))},prepareForms:function(){$$(".messagestream form").each(function(b){b.action=b.action.replace(/xredirect=.*$/,"xpage=plain");b.observe("submit",function(c){c.stop();if(b._disabled==true||b.down("textarea").value.strip()==""){return}new Ajax.Request(b.action,{parameters:b.serialize(true),onCreate:function(){b._disabled=true;b._notification=new a.widgets.Notification("Sending...","inprogress")},onSuccess:function(){if(b){b.messagestream_message.value=""}if(b&&b._notification){b._notification.hide()}b._notification=new a.widgets.Notification("Message sent","done");document.fire("xwiki:activity:newActivity",b)},onFailure:function(d){var e="";if(d.statusText==""||d.status==12031){e="Server not responding"}else{e=d.statusText}if(b){b._disabled=false;if(b._notification){b._notification.hide()}b._notification=new a.widgets.Notification("Failed to send message: "+e,"error")}},on1223:function(d){d.request.options.onSuccess(d)},on0:function(d){d.request.options.onFailure(d)},onComplete:function(){b._disabled=false}.bind(this)})}.bindAsEventListener(this))}.bind(this))}});return a}(XWiki||{}));document.observe("xwiki:dom:loaded",function(){new XWiki.MessageStream()});