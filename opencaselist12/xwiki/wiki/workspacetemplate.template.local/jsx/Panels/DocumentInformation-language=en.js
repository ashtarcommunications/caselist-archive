if(typeof(XWiki)=="undefined"){XWiki=new Object()}XWiki.SyntaxConverter=Class.create({validSourceSyntaxes:["xwiki/2.1","markdown/1.0","xwiki/2.0","twiki/1.0","xwiki/1.0","jspwiki/1.0","mediawiki/1.0","docbook/4.4","html/4.01"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/jsx/Panels/html/4.01*/,"xhtml/1.0","creole/1.0","confluence/1.0","plain/1.0"],validTargetSyntaxes:["docbook/4.4","tex/1.0","xwiki/2.1","annotatedxhtml/1.0","xwiki/2.0","xhtml/1.0","xhtmlmacro/1.0","plain/1.0"],initialize:function(){if($("xwikidocsyntaxinput2")){this.gatherMembers();this.addSyntaxChangeListener()}},gatherMembers:function(){this.contentField=$("content");this.syntaxField=$("xwikidocsyntaxinput2");this.storeNewSyntax();var a=$$("meta[name='document']");if(a.length>0){this.name=a[0].content}else{if(document.location.pathname.indexOf("/edit/")>=0){this.name=document.location.pathname.substring(document.location.pathname.indexOf("/edit/")+6).replace("/",".")}else{this.name="Main.WebHome"}}this.loading=new Element("div").setStyle({backgroundColor:"#000",backgroundImage:"url(/xwiki/resources/icons/xwiki/ajax%2Dloader%2Dlarge.gif)",backgroundPosition:"center",backgroundRepeat:"no-repeat",opacity:0.6}).hide();document.body.appendChild(this.loading);this.loading.absolutize().clonePosition(this.contentField)},addSyntaxChangeListener:function(){Event.observe(this.syntaxField,"change",this.syntaxChanged.bind(this))},syntaxChanged:function(){var c=this.syntaxField.selectedIndex;var a=this.syntaxField.options.item(c).value;if(this.validSourceSyntaxes.indexOf(this.originalSyntax)==-1||this.validTargetSyntaxes.indexOf(a)==-1){}else{if(XWiki.editor=="wysiwyg"){if(XWiki.docisnew||confirm("Do you want to also convert the document's content and objects to the selected syntax? Choosing 'cancel' will reset the syntax to the previous one and do nothing. Note that if you choose 'ok' you will loose modifications and this will save the document automatically, you can cancel this modification by going to the document history interface and revert the last version.")){this.disableEditingArea();var b="/xwiki/wiki/workspacetemplate.template.local/Panels/DocumentInformation?action=convertSyntax&xpage=plain&outputSyntax=plain&documentName="+encodeURIComponent(this.name)+"&oldSyntaxId="+encodeURIComponent(this.originalSyntax)+"&newSyntaxId="+encodeURIComponent(a)+"&form_token="+encodeURIComponent($$("meta[name=form_token]")[0].content);new Ajax.Request(b,{method:"post",onSuccess:this.successfulWYSIWYGConversion.bindAsEventListener(this),onFailure:this.failedConversion.bindAsEventListener(this),onComplete:this.enableEditingArea.bind(this)})}else{this.syntaxField.value=this.originalSyntax}}else{if(!this.contentField.value.blank()){if(confirm("Do you want to also convert the document's content and objects to the selected syntax? Choosing 'cancel' will only change the syntax identifier, without modifying the document's content. Note that if you choose 'ok' this will save the document automatically, you can cancel this modification by going to the document history interface and revert the last version.")){this.disableEditingArea();new Ajax.Request("/xwiki/wiki/workspacetemplate.template.local/get/Panels/DocumentInformation",{method:"post",parameters:{action:"convertSyntax",xpage:"plain",outputSyntax:"plain",form_token:$$("meta[name=form_token]")[0].content,documentName:this.name,oldSyntaxId:this.originalSyntax,newSyntaxId:a,content:$("content").value},onSuccess:this.successfulConversion.bindAsEventListener(this),onFailure:this.failedConversion.bindAsEventListener(this),onComplete:this.enableEditingArea.bind(this)})}}}return}this.storeNewSyntax()},successfulConversion:function(a){this.storeNewSyntax();this.contentField.value=a.responseText.substring(3)},successfulWYSIWYGConversion:function(a){this.storeNewSyntax();window.location.reload(true)},failedConversion:function(a){alert("Failed to convert to the selected syntax. If you want to use this syntax anyway, you can select it again and choose not to perform the conversion.");this.syntaxField.selectedIndex=this.originalSyntaxIndex},disableEditingArea:function(){this.syntaxField.disabled=true;this.contentField.disabled=true;this.loading.show()},enableEditingArea:function(){this.syntaxField.disabled=false;this.loading.hide();this.contentField.disabled=false},storeNewSyntax:function(){this.originalSyntaxIndex=this.syntaxField.selectedIndex;this.originalSyntax=this.syntaxField.options.item(this.originalSyntaxIndex).value}});document.observe("dom:loaded",function(){new XWiki.SyntaxConverter()});