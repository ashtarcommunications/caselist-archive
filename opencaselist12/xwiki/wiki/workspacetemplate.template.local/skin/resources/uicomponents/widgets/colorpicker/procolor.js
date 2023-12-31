/*
**  PROCOLOR LICENSE
**  ----------------
**
**  Redistribution and use in source and binary forms, with or without
**  modification, are permitted provided that the following conditions are met:
**
**    * Redistributions of source code must retain the above copyright
**       notice, this list of conditions and the following disclaimer.
**
**    * Redistributions in binary form must reproduce the above copyright
**       notice, this list of conditions and the following disclaimer in the
**       documentation and/or other materials provided with the distribution.
**
**  THIS SOFTWARE IS PROVIDED BY THE PHANTOM INKER AND CONTRIBUTORS "AS IS"
**  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
**  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
**  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
**  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
**  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
**  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
**  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
**  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
**  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
**  THE POSSIBILITY OF SUCH DAMAGE.
*/
if(typeof Prototype=="undefined"){alert("ProColor Error:  Prototype is not loaded. Please make sure that your page includes prototype.js before it includes procolor.js.")
}if(Prototype.Version<"1.6"){alert("ProColor Error:  Minimum Prototype 1.6.0 is required; you are using "+Prototype.Version)
}Element.addMethods({build:function(b,d,a,c){var f=$(document.createElement(d));
$H(a).each(function(e){f[e.key]=e.value
});
if(c){f.setStyle(c)
}b.appendChild(f);
return f
},isEventIn:function(b,c){var f=b.getDimensions();
var e=b.cumulativeOffset();
var a=c.pointerX(),g=c.pointerY();
return(a>=e.left&&g>=e.top&&a<e.left+f.width&&g<e.top+f.height)
}});
var MouseCapture=Class.create({initialize:function(){},onEvent:function(a,b){if(b&&a.type!="mouseover"&&a.type!="mouseout"){b(a,a.type)
}a.stop()
},setCursor:function(a){if(this.div){this.div.setStyle({cursor:a})
}},begin:function(c){this.listener=this.onEvent.bindAsEventListener(this,c);
Event.observe(document,"mouseup",this.listener);
Event.observe(document,"mousemove",this.listener);
Event.observe(document,"mousedown",this.listener);
Event.observe(document,"mouseover",this.listener);
Event.observe(document,"mouseout",this.listener);
Event.observe(document,"keyup",this.listener);
Event.observe(document,"keydown",this.listener);
this.old_body_ondrag=document.body.ondrag;
this.old_body_onselectstart=document.body.onselectstart;
document.body.ondrag=function(){return false
};
document.body.onselectstart=function(){return false
};
var a=Element.extend(document.body);
var b=a.getDimensions();
this.div=a.build("div",{},{display:"block",position:"absolute",top:"0px",left:"0px",width:b.width+"px",height:b.height+"px",zIndex:999999999,cursor:"default",backgroundColor:"#FFFFFF",opacity:0.0001})
},end:function(){this.div.remove();
Event.stopObserving(document,"mouseup",this.listener);
Event.stopObserving(document,"mousemove",this.listener);
Event.stopObserving(document,"mousedown",this.listener);
Event.stopObserving(document,"mouseover",this.listener);
Event.stopObserving(document,"mouseout",this.listener);
Event.stopObserving(document,"keyup",this.listener);
Event.stopObserving(document,"keydown",this.listener);
document.body.ondrag=this.old_body_ondrag;
document.body.onselectstart=this.old_body_onselectstart;
delete this.old_body_ondrag;
delete this.old_body_onselectstart
}});
var ProColor=Class.create({palette:["F00C30900633963C63","FC9FC0C93F93F96F60","993CC3FF0FF6FF9FFC","3306639966939C39C6","0F09C99F9CFCCF69F0","3C36960630933C6396","6999CC9FF0FF6FC3C9","36603303936F69F0CF","00666C00F66F99FCCF","C9F90F60C63F30930C","96CC6FC3F90C639306","C9C969C6CF9F909606","F0FF9CC69F39F69F06","F66F99FCC936C36C39"],options:{imgPath:"/xwiki/resources/uicomponents/widgets/colorpicker/img/procolor_win_",showInField:true},initialize:function(a){var c=navigator.appVersion.split("MSIE");
var d=parseFloat(c[1]);
this.old_ie=(d>=5.5&&d<7&&document.body.filters);
this.div=null;
this.color=null;
this.listeners={};
this.dblclk={time:0};
if(a.parent){this.parent=$(a.parent)
}else{this.parent=Element.extend(document.body)
}if(a.input){this.input=$(a.input)
}else{this.input=null
}this.options={mode:"static",width:360,height:192,offsetx:13,offsety:8,input:null,showInField:false,parent:null,closeButton:(a.mode=="popup"),imgPath:"/xwiki/resources/uicomponents/widgets/colorpicker/img/procolor_win_",color:(!this.input?"#FFFFFF":this.input.tagName=="INPUT"?this.input.value:this.input.innerHTML),editbg:"#FFFFFF",edittext:"#4C4C4C",outputFormat:"#{RR}{GG}{BB}",onOpening:null,onOpened:null,onClosing:null,onClosed:null,onCloseButton:null,onChanging:null,onChanged:null,onCancelClick:null,onAcceptClick:null};
for(var b in a){this.options[b]=a[b]
}if(this.options.onOpening){this.options.onOpening(this,"opening")
}this.createDiv();
if(this.options.mode=="popup"){this.positionPopup();
Event.observe(document,"mousedown",this.closeClickHandler=this.handleCloseClick.bindAsEventListener(this));
Event.observe(document,"keypress",this.keyPressHandler=this.handleKeyPress.bindAsEventListener(this))
}if(this.options.onOpened){this.options.onOpened(this,"opened")
}},positionPopup:function(){var i=this.div.cumulativeOffset(),k=i[0],h=i[1];
var c=this.div.getDimensions(),m=c.height,b=c.width;
var d=document.viewport.getHeight(),n=document.viewport.getWidth();
var q=document.viewport.getScrollOffsets();
var o=$(this.input).cumulativeOffset(),f=o[1],p=o[0];
var g=$(this.input).getDimensions().height,j=f+g;
if(p+b>n-8){p=n-8-b
}if(p<8){p=8
}var l=(j+m>q.top+d)&&(j-m>q.top);
var a=p.toString()+"px";
var e=(l?(f-m):(f+g)).toString()+"px";
this.div.style.left=a;
this.div.style.top=e;
this.div.setStyle({visibility:"",display:"block"})
},createDiv:function(){var b={display:"block",width:this.options.width+"px",height:this.options.height+"px",backgroundPosition:"0% 0%",backgroundAttachment:"scroll",backgroundRepeat:"no-repeat",backgroundImage:"url("+this.options.imgPath+(this.old_ie?"bg.gif)":"bg.png)"),color:"#BBBBD7",left:0,top:0};
if(this.options.mode=="popup"){b.position="absolute";
b.display="none";
b.visibility="hidden";
b.zIndex=999999
}else{b.position="relative"
}this.div=$(this.parent).build("div",{className:"procolor_box"},b);
this.img_palette=this.loadBgImage(this.div,"palette_raw.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/skin/resources/uicomponents/widgets/colorpicker/palette_raw.png*/,0,1,66,174);
this.img_bar_lower=this.loadBgImage(this.div,"bars.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/skin/resources/uicomponents/widgets/colorpicker/bars.png*/,77,1,20,174,{zIndex:1,opacity:1});
this.img_bar_middle=this.loadBgImage(this.div,"bars.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/skin/resources/uicomponents/widgets/colorpicker/bars.png*/,77,1,20,174,{zIndex:2,opacity:0});
this.img_bar_upper=this.loadBgImage(this.div,"bars.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/skin/resources/uicomponents/widgets/colorpicker/bars.png*/,77,1,20,174,{zIndex:3,opacity:0});
this.img_wheel_rgb=this.loadBgImage(this.div,"wheel_rgb.jpg"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/skin/resources/uicomponents/widgets/colorpicker/wheel_rgb.jpg*/,105,0,176,176,{zIndex:1,opacity:1});
this.img_wheel_black=this.loadBgImage(this.div,"wheel_black.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/skin/resources/uicomponents/widgets/colorpicker/wheel_black.png*/,105,0,176,176,{zIndex:2,opacity:1});
this.img_boxes=this.loadBgImage(this.div,"boxes.png"/*tpa=http://opencaselist.paperlessdebate.com/xwiki/wiki/workspacetemplate.template.local/skin/resources/uicomponents/widgets/colorpicker/boxes.png*/,287,25,50,149,{zIndex:1});
this.img_bar_dragger=this.createImageButton(this.div,"sel_rect",73+this.options.offsetx,-1+this.options.offsety,24,8,{zIndex:4});
this.img_wheel_dragger=this.createImageButton(this.div,"sel_circle",184+this.options.offsetx,79+this.options.offsety,17,17,{zIndex:5});
this.listeners.wheel=this.onWheelEvent.bindAsEventListener(this);
this.img_wheel_black.observe("mousedown",this.listeners.wheel);
this.img_wheel_dragger.observe("mousedown",this.listeners.wheel);
this.img_wheel_dragger.observe("keydown",this.listeners.wheel);
this.listeners.bar=this.onBarEvent.bindAsEventListener(this);
this.img_bar_upper.observe("mousedown",this.listeners.bar);
this.img_bar_dragger.observe("mousedown",this.listeners.bar);
this.img_bar_dragger.observe("keydown",this.listeners.bar);
this.listeners.palette=this.onPaletteEvent.bindAsEventListener(this);
this.img_palette.observe("mousedown",this.listeners.palette);
this.wheel={left:106+this.options.offsetx,top:1+this.options.offsety,width:174,height:174};
this.bar={left:77+this.options.offsetx,top:2+this.options.offsety,width:20,height:172};
this.wheelsel={width:17,height:17};
this.barsel={width:24,height:8};
this.listeners.rgb=this.onNumberBox.bindAsEventListener(this,"rgb",0,255,0);
this.r_edit=this.createEdit(this.div,287,25,37,20,this.listeners.rgb);
this.g_edit=this.createEdit(this.div,287,47,37,20,this.listeners.rgb);
this.b_edit=this.createEdit(this.div,287,69,37,20,this.listeners.rgb);
this.listeners.hue=this.onNumberBox.bindAsEventListener(this,"hsb",0,359,360);
this.listeners.satbrt=this.onNumberBox.bindAsEventListener(this,"hsb",0,100,0);
this.hue_edit=this.createEdit(this.div,287,110,37,20,this.listeners.hue);
this.sat_edit=this.createEdit(this.div,287,132,37,20,this.listeners.satbrt);
this.brt_edit=this.createEdit(this.div,287,154,37,20,this.listeners.satbrt);
if(this.options.closeButton){this.img_close=this.createImageButton(this.div,"close",this.options.width-40,0,24,16);
this.listeners.close=this.onCloseEvent.bindAsEventListener(this);
this.img_close.observe("mouseover",this.listeners.close);
this.img_close.observe("mouseout",this.listeners.close);
this.img_close.observe("mousedown",this.listeners.close);
this.img_close.observe("keydown",this.listeners.close);
this.img_close.trackingMouse=false
}if(this.input&&this.input.tagName=="INPUT"){this.listeners.input=this.onInput.bindAsEventListener(this);
this.input.observe("keyup",this.listeners.input);
this.input.observe("focus",this.listeners.input);
this.input.observe("blur",this.listeners.input)
}else{this.listeners.input=null
}var a=this.decodeHexColor(this.options.color);
if(!a){a={r:0,g:0,b:0}
}this.update("rgb",a,[])
},loadBgImage:function(g,a,f,e,j,d,k){var b={display:"block",position:"absolute",width:j+"px",height:d+"px",left:f+this.options.offsetx+"px",top:e+this.options.offsety+"px",padding:"0",backgroundImage:"url("+this.options.imgPath+a+")"};
if(k){for(var c in k){b[c]=k[c]
}}return g.build("div",{},b)
},createImageButton:function(j,a,g,f,k,e,l){var b={display:"block",position:"absolute",width:k+"px",height:e+"px",left:g+"px",top:f+"px",border:"0",cursor:"default",padding:"0",fontSize:"1px",backgroundImage:"url("+this.options.imgPath+a+(this.old_ie?".gif)":".png)")};
if(l){for(var d in l){b[d]=l[d]
}}var c=j.build("a",{href:"#"},b);
return c
},createEdit:function(f,a,i,b,e,g){a+=5;
b-=9;
i+=2;
e-=6;
var d={display:"inline",position:"absolute",width:b+"px",height:e+"px",left:a+this.options.offsetx+"px",top:i+this.options.offsety+"px",verticalAlign:"top",backgroundColor:this.options.editbg,padding:"0",color:this.options.edittext,fontFamily:"Verdana,Tahoma,Arial,sans-serif,sans serif,sans",fontSize:"12px",fontStyle:"Normal",fontVariant:"Normal",fontWeight:"Normal",textAlign:"right",direction:"ltr",border:0,zIndex:10};
var c=f.build("input",{type:"text",value:"0",maxLength:3},d);
c.observe("keypress",g);
c.observe("keyup",g);
c.observe("focus",g);
c.observe("blur",g);
return c
},close:function(){if(!this.div){return false
}if(this.options.onClosing){this.options.onClosing(this,"closing")
}if(this.options.closeButton){Event.stopObserving(this.img_close)
}Event.stopObserving(this.r_edit);
Event.stopObserving(this.g_edit);
Event.stopObserving(this.b_edit);
Event.stopObserving(this.hue_edit);
Event.stopObserving(this.sat_edit);
Event.stopObserving(this.brt_edit);
Event.stopObserving(this.img_wheel_black);
Event.stopObserving(this.img_bar_upper);
Event.stopObserving(this.img_palette);
Event.stopObserving(this.img_wheel_dragger);
Event.stopObserving(this.img_bar_dragger);
if(this.listeners.input){Event.stopObserving(this.input,"keyup",this.listeners.input);
Event.stopObserving(this.input,"focus",this.listeners.input);
Event.stopObserving(this.input,"blur",this.listeners.input)
}Event.stopObserving(document,"mousedown",this.closeClickHandler);
Event.stopObserving(document,"keypress",this.keyPressHandler);
this.div.remove();
this.div=null;
this.listeners={};
this.dblclk={};
if(this.input.type!="hidden"&&!this.input.disabled){this.input.focus()
}if(this.options.onClosed){this.options.onClosed(this,"closed")
}},updateState:{},updateTimeout:false,queuedUpdate:function(d,a,b){if(!Prototype.Browser.IE){this.update(d,a,b)
}else{var c=this;
c.updateState={mode:d,color:a,sources:b};
if(c.updateTimeout==false){c.updateTimeout=setTimeout(function(){c.updateTimeout=false;
c.update(c.updateState.mode,c.updateState.color,c.updateState.sources)
},25)
}}},finalUpdate:function(){if(this.updateTimeout){clearTimeout(this.updateTimeout);
this.updateTimeout=false;
this.update(this.updateState.mode,this.updateState.color,this.updateState.sources);
this.updateState={}
}},update:function(j,g,a){if(typeof(g)!="object"){g={r:0,g:0,b:0,hue:0,sat:0,brt:0}
}g.r=this.toNumber(g.r);
g.g=this.toNumber(g.g);
g.b=this.toNumber(g.b);
g.hue=this.toNumber(g.hue);
g.sat=this.toNumber(g.sat);
g.brt=this.toNumber(g.brt);
var l,h;
if(j=="rgb"){l=g;
h=this.RGBtoHSB(l)
}else{if(j=="hsb"){h=g;
l=this.HSBtoRGB(h)
}}if(l.r<0){l.r=0
}if(l.r>255){l.r=255
}if(l.g<0){l.g=0
}if(l.g>255){l.g=255
}if(l.b<0){l.b=0
}if(l.b>255){l.b=255
}h.hue=h.hue%360;
if(h.hue<0){h.hue+=360
}if(h.sat<0){h.sat=0
}if(h.sat>100){h.sat=100
}if(h.brt<0){h.brt=0
}if(h.brt>100){h.brt=100
}source={};
a.each(function(c){source[c]=true
});
var r=this;
if(!source.wheel){var b=h.brt/100;
if(b>0.9999){b=0.9999
}r.img_wheel_black.setOpacity(1-b);
var d=((h.hue+270)%360)*(Math.PI*2/360);
var k=Math.cos(d);
var u=Math.sin(d);
var p=Math.floor(k*h.sat*r.wheel.width/200+0.5)+r.wheel.left+((r.wheel.width-4)/2)+2;
var m=Math.floor(u*h.sat*r.wheel.height/200+0.5)+r.wheel.top+((r.wheel.height-4)/2)+2;
r.img_wheel_dragger.setStyle({left:p-Math.floor(r.wheelsel.width/2)+"px",top:m-Math.floor(r.wheelsel.height/2)+"px"})
}if(!source.bar){var f=Math.floor(h.hue/60);
var i=(f+1)%6;
r.img_bar_lower.setStyle({backgroundPosition:(-f*20-20)+"px 0px"});
r.img_bar_middle.setStyle({backgroundPosition:(-i*20-20)+"px 0px"});
r.img_bar_middle.setOpacity((h.hue-f*60)/60);
var b=(100-h.sat)/100;
if(b<0.0001){b=0.0001
}r.img_bar_upper.setOpacity(b);
r.img_bar_dragger.setStyle({top:r.bar.top-Math.floor(r.barsel.height/2)+Math.floor((100-h.brt)*r.bar.height/100+0.5)+"px",left:r.bar.left+Math.floor(r.bar.width-r.barsel.width)/2+"px"})
}l.r=Math.floor(l.r+0.5);
l.g=Math.floor(l.g+0.5);
l.b=Math.floor(l.b+0.5);
h.hue=Math.floor(h.hue+0.5);
h.sat=Math.floor(h.sat+0.5);
h.brt=Math.floor(h.brt+0.5);
h.hue=h.hue%360;
this.color="#"+(l.r.toColorPart()+l.g.toColorPart()+l.b.toColorPart()).toUpperCase();
if(!source.rgb){this.r_edit.value=l.r;
this.g_edit.value=l.g;
this.b_edit.value=l.b
}if(!source.hsb){this.hue_edit.value=h.hue;
this.sat_edit.value=h.sat;
this.brt_edit.value=h.brt
}if(this.options.input){var n=$(this.options.input);
if(!source.input){var q=this.internalFormatOutput(l,h,this.options.outputFormat);
if(n.tagName=="INPUT"){n.value=q
}else{n.innerHTML=q
}}if(this.options.showInField){var e=this.computeTextColor(l);
n.setStyle({backgroundColor:this.color,color:"#"+e.r.toColorPart()+e.g.toColorPart()+e.b.toColorPart()})
}}},toNumber:function(a){switch(typeof a){case"number":return a;
case"string":if(matches=/^[^0-9.+-]*([+-]?(?:[0-9]*\.[0-9]+|[0-9]+(?:\.[0-9]*)?))(?:[^0-9]|$)/.exec(a)){return Number(matches[1])
}else{return 0
}case"boolean":return a?1:0;
case"object":return a?1:0;
case"function":return 1;
default:case"undefined":return 0
}},formatOutput:function(b,c){if(!c){c="#{RR}{GG}{BB}"
}var a=this.decodeHexColor(b);
if(!a){a={r:0,g:0,b:0}
}return this.internalFormatOutput(a,this.RGBtoHSB(a),c)
},internalFormatOutput:function(c,a,e){var d=e.match(/(\{\w+\}|[^{]+)/g);
var b="";
d.each(function(g){var f;
switch(g){case"{RR}":f=c.r.toColorPart().toUpperCase();
break;
case"{GG}":f=c.g.toColorPart().toUpperCase();
break;
case"{BB}":f=c.b.toColorPart().toUpperCase();
break;
case"{rr}":f=c.r.toColorPart().toLowerCase();
break;
case"{gg}":f=c.g.toColorPart().toLowerCase();
break;
case"{bb}":f=c.b.toColorPart().toLowerCase();
break;
case"{R}":f=this.halfColorPart(c.r).toUpperCase();
break;
case"{G}":f=this.halfColorPart(c.g).toUpperCase();
break;
case"{B}":f=this.halfColorPart(c.b).toUpperCase();
break;
case"{r}":f=this.halfColorPart(c.r).toLowerCase();
break;
case"{g}":f=this.halfColorPart(c.g).toLowerCase();
break;
case"{b}":f=this.halfColorPart(c.b).toLowerCase();
break;
case"{red}":f=c.r.toString();
break;
case"{grn}":f=c.g.toString();
break;
case"{blu}":f=c.b.toString();
break;
case"{hue}":f=a.hue.toString();
break;
case"{sat}":f=a.sat.toString();
break;
case"{brt}":f=a.brt.toString();
break;
default:f=g;
break
}b+=f
});
return b
},halfColorPart:function(a){return Math.floor((a+8)/17).toString(16)
},decodeHexColor:function(c){var f;
if(f=/^[^0-9A-Fa-f]*([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{0,2})(?:[^0-9A-Fa-f]|$)/.exec(c)){return{r:parseInt(f[1],16),g:parseInt(f[2],16),b:parseInt(f[3],16)}
}if(f=/^[^0-9A-Fa-f]*([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f])(?:[^0-9A-Fa-f]|$)/.exec(c)){var a=parseInt(f[3],16);
return{r:parseInt(f[1],16),g:parseInt(f[2],16),b:a*16+a}
}if(f=/^[^0-9A-Fa-f]*([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})(?:[^0-9A-Fa-f]|$)/.exec(c)){var e=parseInt(f[2],16);
return{r:parseInt(f[1],16),g:e,b:e}
}if(f=/^[^0-9A-Fa-f]*([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f]{0,2})(?:[^0-9A-Fa-f]|$)/.exec(c)){var d=parseInt(f[1],16);
var e=parseInt(f[2],16);
var a=parseInt(f[3],16);
return{r:d*16+d,g:e*16+e,b:a*16+a}
}if(f=/^[^0-9A-Fa-f]*([0-9A-Fa-f]{2})(?:[^0-9A-Fa-f]|$)/.exec(c)){var e=parseInt(f[1],16);
return{r:e,g:e,b:e}
}if(f=/^[^0-9A-Fa-f]*([0-9A-Fa-f])(?:[^0-9A-Fa-f]|$)/.exec(c)){var e=parseInt(f[1],16);
e=e*16+e;
return{r:e,g:e,b:e}
}return false
},trueBrightness:function(a){return(a.r/255*0.3)+(a.g/255*0.59)+(a.b/255*0.11)
},computeTextColor:function(c){var d=this.trueBrightness(c);
if(d<0.5){var a=Math.floor(d*20)+3;
var b=255*(a-1)
}else{var a=Math.floor((1-d)*20)+3;
var b=0
}return{r:Math.floor((c.r+b)/a),g:Math.floor((c.g+b)/a),b:Math.floor((c.b+b)/a)}
},RGBtoHSB:function(f){var a=Math.floor(this.toNumber(f.r)+0.5);
var e=Math.floor(this.toNumber(f.g)+0.5);
var i=Math.floor(this.toNumber(f.b)+0.5);
if(a<0){a=0
}if(a>255){a=255
}if(e<0){e=0
}if(e>255){e=255
}if(i<0){i=0
}if(i>255){i=255
}var j,m,k,c;
var d=a,n=e,l=i;
if(a>e){if(a>i){l=j=a,c=0,k=e-i
}else{l=j=i,c=240,k=a-e
}m=j-((e<i)?e:i)
}else{if(e>i){l=j=e,c=120,k=i-a
}else{l=j=i,c=240,k=a-e
}m=j-((a<i)?a:i)
}if(j!=0){n=Math.floor((m*100)/j+0.5)
}else{n=0
}if(n!=0){d=(c+Math.floor(k*120/(m*2)+0.5))%360;
if(d<0){d+=360
}}else{d=0
}l=Math.floor(l*100/255+0.5);
return{hue:d,sat:n,brt:l}
},HSBtoRGB:function(d){var j=this.toNumber(d.brt);
if(j<0){j=0
}if(j>100){j=100
}j=j*255/100;
var l=this.toNumber(d.sat);
if(l<=0){j=Math.floor(j+0.5);
return{r:j,g:j,b:j}
}if(l>100){l=100
}var e=this.toNumber(d.hue);
e=e%360;
if(e<0){e+=360
}var k=j*l/100;
var c=(k*((e*256/60)%256))/256;
var a,f,i;
switch(Math.floor(e/60)){case 0:a=j;
f=j-k+c;
i=j-k;
break;
case 1:a=j-c;
f=j;
i=j-k;
break;
case 2:a=j-k;
f=j;
i=j-k+c;
break;
case 3:a=j-k;
f=j-c;
i=j;
break;
case 4:a=j-k+c;
f=j-k;
i=j;
break;
case 5:a=j;
f=j-k;
i=j-c;
break
}a=Math.floor(a+0.5);
f=Math.floor(f+0.5);
i=Math.floor(i+0.5);
if(a<0){a=0
}if(a>255){a=255
}if(f<0){f=0
}if(f>255){f=255
}if(i<0){i=0
}if(i>255){i=255
}return{r:a,g:f,b:i}
},acceptAndClose:function(){if(this.options.onAcceptClick){this.options.onAcceptClick(this,"acceptclick")
}if(this.options.mode=="popup"){this.close()
}},cancelAndClose:function(){if(this.options.onCancelClick){this.options.onCancelClick(this,"cancelclick")
}if(this.options.mode=="popup"){this.close()
}},closeOnDoubleClick:function(d){var a=d.pointerX(),f=d.pointerY();
var b=new Date;
var c=b.getTime();
if(Math.abs(this.dblclk.x-a)<3&&Math.abs(this.dblclk.y-f)<3&&c-this.dblclk.time<=500){this.dblclk.time=0;
this.acceptAndClose();
return true
}else{this.dblclk.x=a;
this.dblclk.y=f;
this.dblclk.time=c;
return false
}},brtFromPoint:function(a,e){var c=this.img_bar_upper.getDimensions();
var b=this.img_bar_upper.cumulativeOffset();
if(e<b.top){return 100
}else{if(e>=b.top+c.height){return 0
}else{return((b.top+c.height-1-e)*100/c.height)
}}},hueSatFromPoint:function(a,i){var h=this.img_wheel_rgb.getDimensions();
var g=this.img_wheel_rgb.cumulativeOffset();
var b=(i-(g.top+h.height/2))/((h.height-4)/2);
var f=(a-(g.left+h.width/2))/((h.width-4)/2);
var e=Math.sqrt(b*b+f*f)*100+0.5;
var c=Math.atan2(b,f)*180/Math.PI+90;
if(e<=0){c=e=0
}if(e>100){e=100
}if(c<0){c+=360
}return{sat:e,hue:c}
},colorFromPalette:function(c,j){var i=this.img_palette.getDimensions();
var h=this.img_palette.cumulativeOffset();
if(c<h.left||c>=h.left+i.width){return false
}c=Math.floor((c-h.left)/11);
if(j>=h.top&&j<h.top+12){line="000333666999CCCFFF"
}else{if(j>h.top+20&&j<h.top+20+this.palette.length*11){line=this.palette[Math.floor((j-(h.top+20))/11)]
}else{return false
}}var f=parseInt(line.substr(c*3,1),16);
var e=parseInt(line.substr(c*3+1,1),16);
var a=parseInt(line.substr(c*3+2,1),16);
return{r:f*16+f,g:e*16+e,b:a*16+a}
},updateByMode:function(a){this.update(a,{r:this.r_edit.value,g:this.g_edit.value,b:this.b_edit.value,hue:this.hue_edit.value,sat:this.sat_edit.value,brt:this.brt_edit.value},[a])
},onCloseEvent:function(c){switch(c.type){case"keydown":switch(c.keyCode){case Event.KEY_RETURN:case 32:if(this.options.onCloseButton){if(!this.options.onCloseButton(this,"closebutton")){break
}}if(this.options.mode=="popup"){this.close()
}break
}break;
case"mouseover":if(!this.img_close.trackingMouse){this.img_close.setStyle({backgroundPosition:"0px -16px"})
}break;
case"mouseout":if(!this.img_close.trackingMouse){this.img_close.setStyle({backgroundPosition:"0px 0px"})
}break;
case"mousedown":this.img_close.trackingMouse=true;
this.img_close.setStyle({backgroundPosition:"0px -32px"});
c.stop();
if(this.img_close.focus){this.img_close.focus()
}var b=true;
var a=new MouseCapture;
a.setCursor("default");
a.begin((function(e,d){switch(d){case"mouseup":case"keyup":a.end();
this.img_close.trackingMouse=false;
if(!b){this.img_close.setStyle({backgroundPosition:"0px 0px"})
}else{this.img_close.setStyle({backgroundPosition:"0px -16px"});
if(this.options.onCloseButton){if(!this.options.onCloseButton(this,"closebutton")){break
}}if(this.options.mode=="popup"){this.close()
}}break;
case"mousemove":b=(this.img_close.getStyle("backgroundPosition")=="0px -32px");
if(this.img_close.isEventIn(e)!=b){b=!b;
if(!b){this.img_close.setStyle({backgroundPosition:"0px 0px"})
}else{this.img_close.setStyle({backgroundPosition:"0px -32px"})
}}break
}}).bind(this));
break
}},onBarEvent:function(h){switch(h.type){case"keydown":var f=this;
var g=this.toNumber(f.brt_edit.value),b=g;
var d=h.shiftKey||h.ctrlKey||h.altKey;
switch(h.keyCode){case Event.KEY_UP:g+=d?10:1;
h.stop();
break;
case Event.KEY_DOWN:g-=d?10:1;
h.stop();
break;
case Event.KEY_PAGEUP:g+=d?25:10;
h.stop();
break;
case Event.KEY_PAGEDOWN:g-=d?25:10;
h.stop();
break;
case Event.KEY_HOME:g=100;
h.stop();
break;
case Event.KEY_END:g=0;
h.stop();
break
}if(g<0){g=0
}if(g>100){g=100
}if(f.options.onChanging&&(b!=g)){f.options.onChanging(f,"changing")
}f.update("hsb",{hue:f.hue_edit.value,sat:f.sat_edit.value,brt:g},[]);
if(f.options.onChanged&&(b!=g)){f.options.onChanged(f,"changed")
}break;
case"mousedown":h.stop();
var f=this;
f.oldcolor=f.color;
if(f.img_bar_dragger.focus){f.img_bar_dragger.focus()
}var c=function(j){var i={hue:f.hue_edit.value,sat:f.sat_edit.value,brt:f.brtFromPoint(j.pointerX(),j.pointerY())};
f.queuedUpdate("hsb",i,[]);
if(f.options.onChanging){f.options.onChanging(f,"changing")
}};
c(h);
if(this.closeOnDoubleClick(h)){break
}var a=new MouseCapture;
a.setCursor("default");
a.begin(function(i,e){switch(e){case"mouseup":case"keyup":a.end();
f.finalUpdate();
if(f.options.onChanged&&f.oldcolor!=f.color){f.options.onChanged(f,"changed")
}break;
case"mousemove":c(i);
break
}});
break
}},onWheelEvent:function(f){switch(f.type){case"keydown":var j=this;
var d=this.toNumber(j.hue_edit.value),a=d;
var c=this.toNumber(j.sat_edit.value),h=c;
var g=f.shiftKey||f.ctrlKey||f.altKey;
switch(f.keyCode){case Event.KEY_UP:c+=g?10:1;
f.stop();
break;
case Event.KEY_DOWN:c-=g?10:1;
f.stop();
break;
case Event.KEY_LEFT:d-=g?10:1;
f.stop();
break;
case Event.KEY_RIGHT:d+=g?10:1;
f.stop();
break;
case Event.KEY_PAGEUP:c+=g?25:10;
f.stop();
break;
case Event.KEY_PAGEDOWN:c-=g?25:10;
f.stop();
break;
case Event.KEY_HOME:c=100;
f.stop();
break;
case Event.KEY_END:c=0;
f.stop();
break
}if(c<0){c=0
}if(c>100){c=100
}d=d%360;
if(d<0){d+=360
}if(j.options.onChanging&&(a!=d||h!=c)){j.options.onChanging(j,"changing")
}j.update("hsb",{hue:d,sat:c,brt:j.brt_edit.value},[]);
if(j.options.onChanged&&(a!=d||h!=c)){j.options.onChanged(j,"changed")
}break;
case"mousedown":f.stop();
var j=this;
j.oldcolor=j.color;
if(j.img_wheel_dragger.focus){j.img_wheel_dragger.focus()
}var b=function(l){var k=j.hueSatFromPoint(l.pointerX(),l.pointerY());
k.brt=j.brt_edit.value;
j.queuedUpdate("hsb",k,[]);
if(j.options.onChanging){j.options.onChanging(j,"changing")
}};
b(f);
if(this.closeOnDoubleClick(f)){break
}var i=new MouseCapture;
i.setCursor("default");
i.begin(function(k,e){switch(e){case"mouseup":case"keyup":i.end();
j.finalUpdate();
if(j.options.onChanged&&j.oldcolor!=j.color){j.options.onChanged(j,"changed")
}break;
case"mousemove":b(k);
break
}});
break
}},onPaletteEvent:function(d){switch(d.type){case"mousedown":var c=this;
c.oldcolor=c.color;
if(c.img_palette.focus){c.img_palette.focus()
}var b=function(g){var f=c.colorFromPalette(g.pointerX(),g.pointerY());
if(f){c.queuedUpdate("rgb",f,[])
}if(c.options.onChanging){c.options.onChanging(c,"changing")
}return f
};
if(!b(d)){break
}d.stop();
if(this.closeOnDoubleClick(d)){break
}var a=new MouseCapture;
a.setCursor("default");
a.begin(function(f,e){switch(e){case"mouseup":case"keyup":a.end();
c.finalUpdate();
if(c.options.onChanged&&c.oldcolor!=c.color){c.options.onChanged(c,"changed")
}break;
case"mousemove":b(f);
break
}});
break
}},onNumberBox:function(f,g,e,a,d){var c=Event.element(f);
switch(f.type){case"keypress":if(!f||f.ctrlKey||f.altKey){f.stop()
}else{if((f.charCode>=48&&f.charCode<=57)||(f.keyCode>=48&&f.keyCode<=57)){}else{if(f.keyCode>0&&f.keyCode<48){}else{f.stop()
}}}break;
case"keyup":if(f.keyCode!=Event.KEY_TAB){this.updateByMode(g);
if(this.options.onChanging){this.options.onChanging(this,"changing")
}}if(f.keyCode==Event.KEY_RETURN){this.acceptAndClose();
f.stop()
}if(f.keyCode==Event.KEY_ESC){this.cancelAndClose();
f.stop()
}break;
case"focus":this.oldcolor=this.color;
break;
case"blur":var b=this.toNumber(c.value);
if(b<e||b>a){if(d){b%=d;
if(b<0){b+=d
}}else{if(b<e){b=e
}else{b=a
}}c.value=b;
this.updateByMode(g)
}if(this.options.onChanged&&this.oldcolor!=this.color){this.options.onChanged(this,"changed")
}break
}},onInput:function(b){switch(b.type){case"keyup":if(b.keyCode!=Event.KEY_TAB){this.update("rgb",this.decodeHexColor(this.input.value),["input"]);
if(this.options.onChanging){this.options.onChanging(this,"changing")
}}if(b.keyCode==Event.KEY_RETURN){this.acceptAndClose();
b.stop()
}if(b.keyCode==Event.KEY_ESC){this.cancelAndClose();
b.stop()
}break;
case"focus":this.oldcolor=this.color;
break;
case"blur":var a=this.decodeHexColor(this.input.value);
this.update("rgb",a,[]);
if(this.oldcolor!=this.color){this.input.value=this.internalFormatOutput(a,this.RGBtoHSB(a),this.options.outputFormat);
if(this.options.onChanged){this.options.onChanged(this,"changed")
}}break
}},handleCloseClick:function(b){var a=$(Event.element(b));
if(a==this.div||a.descendantOf(this.div)){return
}if(a==this.input||a.descendantOf(this.input)){return
}this.cancelAndClose()
},handleKeyPress:function(a){if(a.keyCode==Event.KEY_ESC){this.cancelAndClose()
}},attachButton:function(f,c){f=$(f);
if(!f){return
}var g;
if(c.imgPath){g=c.imgPath
}else{g=""
}var d=$(document.createElement("a"));
d.setStyle({display:"inline-block",visibility:"visible",border:"0px",textDecoration:"none",verticalAlign:"bottom",width:"40px",height:"24px",padding:"0px",marginLeft:"2px",backgroundImage:"url("+g+"drop.png)",backgroundPosition:"0px 0px",backgroundRepeat:"no-repeat",cursor:"default"});
d.href="#";
for(var a in this.buttonMembers){d[a]=this.buttonMembers[a]
}var b=c.color;
d.buttonHandler=d.eventHandler.bindAsEventListener(d);
d.options=Object.clone(c);
d.options.input=f;
d.options.pc=this;
delete d.options.color;
if(!d.options.outputFormat){d.options.outputFormat="#{RR}{GG}{BB}"
}Event.observe(d,"click",d.buttonHandler);
Event.observe(d,"mouseover",d.buttonHandler);
Event.observe(d,"mouseout",d.buttonHandler);
Event.observe(d,"mousedown",d.buttonHandler);
Event.observe(d,"mouseup",d.buttonHandler);
Event.observe(d,"keydown",d.buttonHandler);
Event.observe(d,"keyup",d.buttonHandler);
if(f.nextSibling){f.parentNode.insertBefore(d,f.nextSibling)
}else{f.parentNode.appendChild(d)
}d.inputHandler=d.onInput.bindAsEventListener(d);
d.observeInput();
if(b){f.value=b
}d.colorSync(true);
return d
},buttonMembers:{pressed:false,hovered:false,inputHandler:false,options:{},setImg:function(a){this.setStyle({backgroundPosition:"0px "+(a*-24)+"px"})
},observeInput:function(){Event.observe(this.options.input,"keyup",this.inputHandler);
Event.observe(this.options.input,"focus",this.inputHandler);
Event.observe(this.options.input,"blur",this.inputHandler)
},stopObservingInput:function(){Event.stopObserving(this.options.input,"keyup",this.inputHandler);
Event.stopObserving(this.options.input,"focus",this.inputHandler);
Event.stopObserving(this.options.input,"blur",this.inputHandler)
},toggle:function(){if(this.pressed){this.setImg(this.hovered?1:0);
this.pressed=false;
if(this.popup){this.popup.close();
this.popup=null
}this.observeInput()
}else{var a=this;
this.setImg(2);
this.pressed=true;
this.stopObservingInput();
this.popup=new ProColor(Object.extend(Object.clone(this.options),{mode:"popup",closeButton:true,onClosed:function(c,b){a.popup=null;
a.setImg(this.hovered?1:0);
a.pressed=false;
a.observeInput();
if(a.options.onClosed){a.options.onClosed(c,b)
}},parent:null}))
}},colorSync:function(c){var d=this.options.pc.decodeHexColor(this.options.input.value);
if(d){if(this.options.showInField){var a=this.options.pc.computeTextColor(d);
this.options.input.setStyle({backgroundColor:"#"+d.r.toColorPart()+d.g.toColorPart()+d.b.toColorPart(),color:"#"+a.r.toColorPart()+a.g.toColorPart()+a.b.toColorPart()})
}var b=this.options.pc.internalFormatOutput(d,this.options.pc.RGBtoHSB(d),this.options.outputFormat);
if(b!=this.options.input.value&&this.options.onChanging){this.options.onChanging(this.options.input,"changing")
}if(c){if(b!=this.options.input.value){this.options.input.value=b;
if(this.options.onChanged){this.options.onChanged(this.options.input,"changed")
}}}}},onInput:function(a){switch(a.type){case"keyup":if(a.keyCode!=Event.KEY_TAB&&this.options.showInField){this.colorSync(false)
}break;
case"focus":case"blur":this.colorSync(true);
break
}},eventHandler:function(b){switch(b.type){case"click":b.stop();
break;
case"keydown":switch(b.keyCode){case Event.KEY_RETURN:case 32:this.toggle();
b.stop();
break
}break;
case"keyup":break;
case"mousedown":this.focus();
var a=this;
setTimeout(function(){a.toggle()
},20);
break;
case"mouseup":break;
case"mouseover":if(this.pressed){this.setImg(2)
}else{this.setImg(1)
}this.hovered=true;
break;
case"mouseout":if(this.pressed){this.setImg(2)
}else{this.setImg(0)
}this.hovered=false;
break
}}}});
Event.observe(window,"load",function(){$$("input.procolor").each(function(a){ProColor.prototype.attachButton(a,ProColor.prototype.options)
})
});