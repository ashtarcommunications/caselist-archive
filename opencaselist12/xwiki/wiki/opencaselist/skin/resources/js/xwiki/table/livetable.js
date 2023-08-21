var XWiki=(function(XWiki){var widgets=XWiki.widgets=XWiki.widgets||{};
XWiki.widgets.LiveTable=Class.create({initialize:function(url,domNodeName,handler,options){if(!options){var options={}
}this.domNodeName=domNodeName;
if($(this.domNodeName).down("tr.xwiki-livetable-initial-message")){$(this.domNodeName).down("tr.xwiki-livetable-initial-message").remove()
}this.displayNode=$(domNodeName+"-display")||$("display1");
this.filtersNodes=[options.filterNodes||$(options.filtersNode)||$(domNodeName).down(".xwiki-livetable-display-filters")].flatten().compact();
this.paginationNodes=options.paginationNodes||$(this.domNodeName).select(".xwiki-livetable-pagination");
this.pageSizeNodes=options.pageSizeNodes||$(this.domNodeName).select(".xwiki-livetable-pagesize");
if(typeof options=="undefined"){options={}
}this.action=options.action||"view";
this.limit=options.limit||10;
this.lastOffset=1;
$(this.domNodeName).select("th.sortable").each(function(el){if(el.hasClassName("selected")){this.selectedColumn=el
}},this);
this.throttlingDelay=options.throttlingDelay||0.5;
this.permalinks=new LiveTableHash(this,(typeof options.permalinks=="undefined"||options.permalinks));
this.limit=this.permalinks.getLimit();
var initialPage=this.permalinks.getPage();
if(typeof this.pageSizeNodes!="undefined"){this.pageSizer=new LiveTablePageSizer(this,this.pageSizeNodes,options.pageSizeBounds,this.limit)
}if(typeof this.paginationNodes!="undefined"){this.paginator=new LiveTablePagination(this,this.paginationNodes,options.maxPages||10)
}if(this.filtersNodes.length>0){this.filter=new LiveTableFilter(this,this.filtersNodes,this.permalinks.getFilters(),{throttlingDelay:this.throttlingDelay})
}if($(domNodeName+"-tagcloud")){this.tagCloud=new LiveTableTagCloud(this,domNodeName+"-tagcloud")
}this.loadingStatus=$(this.domNodeName+"-ajax-loader")||$("ajax-loader");
this.limitsDisplay=$(this.domNodeName+"-limits")||new Element("div");
this.filters="";
this.handler=handler||function(){};
this.totalRows=-1;
this.fetchedRows=new Array();
this.getUrl=url;
this.sendReqNo=0;
this.recvReqNo=0;
this.observeSortableColumns(this.permalinks.getSortColumn(),this.permalinks.getSortDirection());
this.currentOffset=(initialPage-1)*this.limit+1;
this.showRows(this.currentOffset,this.limit)
},setPageSize:function(pageSize){this.limit=pageSize;
this.showRows(1,this.limit)
},getRows:function(reqOffset,reqLimit,displayOffset,displayLimit,delay){var self=this;
if(this.nextRequestTimeoutId){window.clearTimeout(this.nextRequestTimeoutId);
delete this.nextRequestTimeoutId
}var doRequest=function(){var url=self.getUrl+"&offset="+reqOffset+"&limit="+reqLimit+"&reqNo="+(++self.sendReqNo);
if(self.filter){self.filters=self.filter.serializeFilters();
if(self.filters!=undefined&&self.filters!=""){url+=self.filters
}}if(typeof self.tags!="undefined"&&self.tags.length>0){self.tags.each(function(tag){url+=("&tag="+encodeURIComponent(tag.unescapeHTML()))
})
}url+=self.getSortURLFragment();
document.fire("xwiki:livetable:"+this.domNodeName+":loadingEntries");
document.fire("xwiki:livetable:loadingEntries",{tableId:this.domNodeName});
var ajx=new Ajax.Request(url,{method:"get",onComplete:function(transport){document.fire("xwiki:livetable:"+self.domNodeName+":loadingComplete",{status:transport.status});
document.fire("xwiki:livetable:loadingComplete",{status:transport.status,tableId:self.domNodeName});
self.loadingStatus.addClassName("hidden")
},onSuccess:function(transport){var res=eval("("+transport.responseText+")");
if(res.reqNo<self.sendReqNo){return
}self.recvReqNo=res.reqNo;
if(self.tagCloud&&res.matchingtags){self.tagCloud.updateTagCloud(res.tags,res.matchingtags)
}document.fire("xwiki:livetable:"+this.domNodeName+":receivedEntries",{data:res});
document.fire("xwiki:livetable:receivedEntries",{data:res,tableId:self.domNodeName});
self.updateFetchedRows(res);
self.displayRows(displayOffset,displayLimit)
}})
};
self.loadingStatus.removeClassName("hidden");
if(typeof delay!="undefined"&&delay>0){this.nextRequestTimeoutId=Function.delay.call(doRequest,delay)
}else{doRequest()
}},updateFetchedRows:function(json){this.json=json;
this.totalRows=json.totalrows;
for(var i=json.offset;
i<json.offset+json.returnedrows;
++i){this.fetchedRows[i]=json.rows[i-json.offset]
}},clearDisplay:function(){var object=this.displayNode;
while(object.hasChildNodes()){object.removeChild(object.firstChild)
}},displayRows:function(offset,limit){var f=offset+limit-1;
if(f>this.totalRows){f=this.totalRows
}var off=(this.totalRows>0)?offset:0;
var msg="<strong>"+off+"</strong> - <strong>"+f+"</strong> out of <strong>"+this.totalRows+"</strong>";
msg=msg.toLowerCase();
this.limitsDisplay.innerHTML="Results "+msg;
this.clearDisplay();
for(var i=off;
i<=f;
i++){if(this.fetchedRows[i]){var elem=this.handler(this.fetchedRows[i],i,this);
this.displayNode.appendChild(elem);
var memo={data:this.fetchedRows[i],row:elem,table:this,tableId:this.domNodeName};
document.fire("xwiki:livetable:"+this.domNodeName+":newrow",memo);
document.fire("xwiki:livetable:newrow",memo)
}}if(this.paginator){this.paginator.refreshPagination()
}document.fire("xwiki:livetable:"+this.domNodeName+":displayComplete");
document.fire("xwiki:livetable:displayComplete",{tableId:this.domNodeName})
},showRows:function(offset,limit,delay){this.lastOffset=offset;
this.permalinks.update();
var buff="request to display rows "+offset+" to "+(offset+limit)+" <br />\n";
if(this.totalRows==-1){this.getRows(offset,limit,offset,limit,delay);
buff+="table is empty so we get all rows";
return buff
}var min=-1;
var max=-1;
for(var i=offset;
i<(offset+limit);
++i){if(this.fetchedRows[i]==undefined){if(min==-1){min=i
}max=i
}}if(min==-1){buff+="no need to get new rows <br />\n";
this.displayRows(offset,limit)
}else{buff+="we need to get rows "+min+" to "+(max+1)+" <br />\n";
this.getRows(min,max-min+1,offset,limit)
}if(this.paginator){this.paginator.refreshPagination()
}return buff
},deleteAndShiftRows:function(indx){for(var i in this.fetchedRows){if(i>=indx){this.fetchedRows[i]=this.fetchedRows[""+(parseInt(i)+1)]
}}},debugFetchedRows:function(){var buf="";
for(var i in this.fetchedRows){if(this.fetchedRows[i]!=undefined){buf+=i+" "
}}return buf
},deleteRow:function(indx){this.deleteAndShiftRows(indx);
var newoffset=this.lastOffset;
if(indx>this.totalRows-this.limit-1){newoffset-=1
}if(newoffset<=0){newoffset=1
}this.totalRows-=1;
if(this.totalRows<this.limit){this.showRows(newoffset,this.totalRows)
}else{this.showRows(newoffset,this.limit)
}if(this.paginator){this.paginator.refreshPagination()
}document.fire("xwiki:livetable:"+this.domNodeName+":displayComplete");
document.fire("xwiki:livetable:displayComplete",{tableId:this.domNodeName})
},getSortURLFragment:function(){var column=this.getSortColumn();
var fragment="";
if(column!=null){fragment+="&sort="+column;
var direction=this.getSortDirection();
if(direction!=null){return fragment+="&dir="+direction
}}return fragment
},getSortColumn:function(){if(!this.selectedColumn){return null
}var a=this.selectedColumn.down("a");
if(!a){return null
}return a.getAttribute("rel")
},getSortDirection:function(){if(!this.selectedColumn){return null
}return(this.selectedColumn.hasClassName("desc")?"desc":"asc")
},clearCache:function(){this.fetchedRows.clear();
this.totalRows=-1
},observeSortableColumns:function(column,direction){var self=this;
$(this.domNodeName).select("th.sortable").each(function(el){var colname=el.down("a")?el.down("a").getAttribute("rel"):null;
if(colname==column){self.selectedColumn=el;
el.addClassName("selected");
if(direction=="asc"){if(el.hasClassName("desc")){el.removeClassName("desc")
}el.addClassName("asc")
}else{if(el.hasClassName("asc")){el.removeClassName("asc")
}el.addClassName("desc")
}}else{if(el.hasClassName("selected")){el.removeClassName("selected")
}if(!el.hasClassName("desc")&&!el.hasClassName("asc")){el.addClassName("desc")
}}Event.observe(el,"click",function(event){var elem=event.element();
if(!elem.hasClassName("sortable")){elem=elem.up("th.sortable")
}if(elem==null){return
}if(elem.hasClassName("selected")){var direction=elem.hasClassName("asc")?"asc":"desc";
var newDirection=direction=="asc"?"desc":"asc";
elem.removeClassName(direction);
elem.addClassName(newDirection)
}else{if(self.selectedColumn){self.selectedColumn.removeClassName("selected")
}elem.addClassName("selected");
self.selectedColumn=elem
}self.clearCache();
self.showRows(1,self.limit)
})
})
}});
var LiveTableHash=Class.create({initialize:function(table,enable){this.table=table;
this.enable=enable;
this.loadFromHash()
},loadFromHash:function(){this.params=this.getTableParams();
this.filters=new Object();
if(!this.enable){return
}var hashString=window.location.hash.substring(1);
if(!hashString.blank()){var tables=hashString.split("|");
for(var i=0;
i<tables.length;
i++){var params=tables[i].toQueryParams();
if(params.t==this.table.domNodeName){for(var param in params){if(param.length==1&&"tplsd".indexOf(param)!=-1){this.params[param]=params[param]
}else{this.filters[param]=params[param]
}}}}}},getTableParams:function(){var result=new Object();
result.t=this.table.domNodeName;
result.p=((this.table.lastOffset-1)/this.table.limit)+1;
result.l=this.table.limit;
if(this.table.getSortColumn()!=null){result.s=this.table.getSortColumn();
result.d=this.table.getSortDirection()
}return result
},getParam:function(name){return this.params[name]
},getIntParam:function(name){return parseInt(this.params[name])
},getLimit:function(){return this.getIntParam("l")
},getPage:function(){return this.getIntParam("p")
},getSortColumn:function(){return this.getParam("s")
},getSortDirection:function(){return this.getParam("d")
},getFilters:function(name){return this.filters
},serializeParams:function(newParams){var params=$H((newParams)?newParams:this.params);
params=params.inject({},function(params,pair){params[pair.key]=encodeURIComponent(pair.value);
return params
});
var result="t=#{t}&p=#{p}&l=#{l}".interpolate(params);
if(params.s){result+="&s=#{s}&d=#{d}".interpolate(params)
}return result
},update:function(){if(!this.enable){return
}var params=this.getTableParams();
var paramsString=this.serializeParams(params);
var filterString=this.table.filter?this.table.filter.serializeFilters():"";
var shouldUpdate=!filterString.blank()||(paramsString!=this.serializeParams());
if(shouldUpdate){var currentHash=window.location.hash.substring(1);
var tables=currentHash.split("|"),newHash="";
for(var i=0;
i<tables.length;
i++){if(tables[i].toQueryParams()["t"]!=params.t){newHash+=(tables[i]+"|")
}}newHash+=paramsString;
newHash+=filterString;
this.params=params;
this.filters=null;
window.location.hash="#"+newHash
}}});
var LiveTablePagination=Class.create({initialize:function(table,domNodes,max){this.table=table;
var self=this;
this.pagesNodes=[];
domNodes.each(function(elem){self.pagesNodes.push(elem.down(".xwiki-livetable-pagination-content"))
});
this.max=max;
$(this.table.domNodeName).select(".prevPagination").invoke("observe","click",this.gotoPrevPage.bind(this));
$(this.table.domNodeName).select(".nextPagination").invoke("observe","click",this.gotoNextPage.bind(this))
},refreshPagination:function(){var self=this;
this.pagesNodes.each(function(elem){elem.innerHTML=""
});
var pages=Math.ceil(this.table.totalRows/this.table.limit);
var currentMax=(!this.max)?pages:this.max;
var currentPage=Math.floor(this.table.lastOffset/this.table.limit)+1;
var startPage=Math.floor(currentPage/currentMax)*currentMax-1;
if(startPage>1){this.pagesNodes.each(function(elem){elem.insert(self.createPageLink(1,false))
});
if(startPage>2){this.pagesNodes.invoke("insert"," ... ")
}}for(var i=(startPage<=0)?1:startPage;
i<=Math.min(startPage+currentMax+1,pages);
i++){var selected=(currentPage==i);
this.pagesNodes.each(function(elem){elem.insert(self.createPageLink(i,selected))
});
this.pagesNodes.invoke("insert"," ")
}if(i<pages){if(i+1<pages){this.pagesNodes.invoke("insert"," ... ")
}this.pagesNodes.each(function(elem){elem.insert(self.createPageLink(pages,false))
})
}if(currentPage<=1){this.pagesNodes.each(function(item){if(!item.up().previous(".controlPagination")){return
}var prevPage=item.up().previous(".controlPagination").down(".prevPagination");
if(prevPage){prevPage.addClassName("noPrevPagination").removeClassName("prevPagination")
}})
}else{this.pagesNodes.each(function(item){if(!item.up().previous(".controlPagination")){return
}var prevPage=item.up().previous(".controlPagination").down(".noPrevPagination");
if(prevPage){prevPage.addClassName("prevPagination").removeClassName("noPrevPagination")
}})
}if(currentPage>=pages){this.pagesNodes.each(function(item){if(!item.up().previous(".controlPagination")){return
}var nextPage=item.up().previous(".controlPagination").down(".nextPagination");
if(nextPage){nextPage.addClassName("noNextPagination").removeClassName("nextPagination")
}})
}else{this.pagesNodes.each(function(item){if(!item.up().previous(".controlPagination")){return
}var nextPage=item.up().previous(".controlPagination").down(".noNextPagination");
if(nextPage){nextPage.addClassName("nextPagination").removeClassName("noNextPagination")
}})
}},createPageLink:function(page,selected){var pageSpan=new Element("a",{"class":"pagenumber",href:"#"}).update(page);
if(selected){pageSpan.addClassName("selected")
}var self=this;
pageSpan.observe("click",function(ev){ev.stop();
self.gotoPage(ev.element().innerHTML)
});
return pageSpan
},gotoPage:function(page){this.table.showRows(((parseInt(page)-1)*this.table.limit)+1,this.table.limit)
},gotoPrevPage:function(ev){ev.stop();
var currentPage=Math.floor(this.table.lastOffset/this.table.limit)+1;
var prevPage=currentPage-1;
if(prevPage>0){this.table.showRows(((parseInt(prevPage)-1)*this.table.limit)+1,this.table.limit)
}},gotoNextPage:function(ev){ev.stop();
var currentPage=Math.floor(this.table.lastOffset/this.table.limit)+1;
var pages=Math.ceil(this.table.totalRows/this.table.limit);
var nextPage=currentPage+1;
if(nextPage<=pages){this.table.showRows(((parseInt(nextPage)-1)*this.table.limit)+1,this.table.limit)
}}});
var LiveTablePageSizer=Class.create({initialize:function(table,domNodes,pageSizeBounds,currentPageSize){this.table=table;
this.currentValue=currentPageSize;
var bounds=pageSizeBounds||[];
this.startValue=bounds[0]||10;
this.step=bounds[2]||10;
this.maxValue=bounds[1]||100;
var self=this;
this.pageSizeNodes=[];
domNodes.each(function(elem){self.pageSizeNodes.push(elem.down(".xwiki-livetable-pagesize-content"))
});
this.pageSizeNodes.each(function(elem){elem.insert(self.createPageSizeSelectControl())
})
},createPageSizeSelectControl:function(){var select=new Element("select",{"class":"pagesizeselect"});
for(var i=this.startValue;
i<=this.maxValue;
i+=this.step){var attrs={value:i,text:i};
if(i==this.currentValue){attrs.selected=true
}else{var prevStep=i-this.step;
if(this.currentValue>prevStep&&this.currentValue<i){select.appendChild(new Element("option",{value:this.currentValue,text:this.currentValue,selected:true}).update(this.currentValue))
}}select.appendChild(new Element("option",attrs).update(i))
}select.observe("change",this.changePageSize.bind(this));
return select
},changePageSize:function(event){var newLimit=parseInt($F(Event.element(event)));
this.table.setPageSize(newLimit)
}});
var LiveTableFilter=Class.create({initialize:function(table,filterNodes,filters,options){this.table=table;
this.filterNodes=filterNodes;
this.filters=filters||new Object();
this.throttlingDelay=options.throttlingDelay||0;
this.inputs=this.filterNodes.invoke("select","input").flatten();
this.selects=this.filterNodes.invoke("select","select").flatten();
this.initializeFilters();
this.attachEventHandlers()
},initializeFilters:function(){for(var i=0;
i<this.inputs.length;
++i){var key=this.inputs[i].name;
if((this.inputs[i].type=="radio")||(this.inputs[i].type=="checkbox")){var filter=this.filters[key];
if(filter){if(Object.isArray(filter)){this.inputs[i].checked=(filter.indexOf(this.inputs[i].value.strip())!=-1)
}else{this.inputs[i].checked=(filter==this.inputs[i].value.strip())
}}}else{if(this.filters[key]){this.inputs[i].value=this.filters[key]
}this.applyActiveFilterStyle(this.inputs[i])
}}for(var i=0;
i<this.selects.length;
++i){var filter=this.filters[this.selects[i].name];
if(filter){for(var j=0;
j<this.selects[i].options.length;
++j){if(Object.isArray(filter)){this.selects[i].options[j].selected=(filter.indexOf(this.selects[i].options[j].value)!=-1)
}else{this.selects[i].options[j].selected=(this.selects[i].options[j].value==filter)
}}}this.applyActiveFilterStyle(this.selects[i])
}},serializeFilters:function(){var result="";
var filters=[this.inputs,this.selects].flatten();
for(var i=0;
i<filters.length;
i++){if(!filters[i].value.blank()||(this.filters[filters[i].name]&&!this.filters[filters[i].name].blank())){if((filters[i].type!="radio"&&filters[i].type!="checkbox")||filters[i].checked){result+=("&"+filters[i].serialize())
}}}return result
},attachEventHandlers:function(){for(var i=0;
i<this.inputs.length;
i++){if(this.inputs[i].type=="text"){Event.observe(this.inputs[i],"keyup",this.refreshHandler.bind(this));
Event.observe(this.inputs[i],"change",this.refreshHandler.bind(this))
}else{Event.observe(this.inputs[i],"click",this.refreshHandler.bind(this));
Event.observe(this.inputs[i],"change",this.refreshHandler.bind(this))
}}for(var i=0;
i<this.selects.length;
i++){Event.observe(this.selects[i],"change",this.refreshHandler.bind(this))
}document.observe("xwiki:livetable:"+this.table.domNodeName+":filtersChanged",this.refreshHandler.bind(this))
},refreshHandler:function(event){this.applyActiveFilterStyle(event.element());
this.refreshContent()
},refreshContent:function(){var newFilters=this.serializeFilters();
if(newFilters==this.table.filters){return
}this.table.totalRows=-1;
this.table.fetchedRows=new Array();
this.table.filters=newFilters;
this.table.showRows(1,this.table.limit,this.throttlingDelay)
},applyActiveFilterStyle:function(element){if(element&&element.tagName&&((element.tagName.toLowerCase()=="input"&&element.type=="text")||element.tagName.toLowerCase()=="select")){if($F(element)!=""){element.addClassName("xwiki-livetable-filter-active")
}else{element.removeClassName("xwiki-livetable-filter-active")
}}}});
var LiveTableTagCloud=Class.create({initialize:function(table,domNodeName,tags){this.table=table;
this.domNode=$(domNodeName);
this.cloudFilter=false;
if(typeof tags=="array"){this.tags=tags;
if(tags.length>0){this.updateTagCloud(tags)
}}},tags:[],matchingTags:[],selectedTags:{},popularityLevels:["notPopular","notVeryPopular","somewhatPopular","popular","veryPopular","ultraPopular"],updateTagCloud:function(tags,matchingTags){if(!this.hasTags&&tags.length>0){this.tags=tags;
this.map=this.buildPopularityMap(this.tags);
this.hasTags=true;
this.domNode.removeClassName("hidden")
}this.matchingTags=matchingTags;
this.displayTagCloud()
},displayTagCloud:function(){this.domNode.down(".xwiki-livetable-tagcloud").innerHTML="";
var cloud=new Element("ol",{"class":"tagCloud"});
var levels=this.map?this.map.keys().sortBy(function(k){return parseInt(k)
}).reverse():[];
var liClass;
for(var i=0;
i<this.tags.length;
i++){liClass="";
for(var j=0;
j<levels.length;
j++){if(this.tags[i].count>=levels[j]||(j==(levels.length-1))){liClass=this.map.get(levels[j]);
break
}}var tagLabel=this.tags[i].tag;
var tagSpan=new Element("span").update(tagLabel.escapeHTML());
var tag=new Element("li",{"class":liClass}).update(tagSpan);
if(typeof this.matchingTags[tagLabel]!="undefined"){tag.addClassName("selectable");
Event.observe(tagSpan,"click",function(event){var tag=event.element().up("li").down("span").innerHTML.unescapeHTML();
event.element().up("li").toggleClassName("selected");
if(event.element().up("li").hasClassName("selected")){self.selectedTags[tag]={}
}else{delete self.selectedTags[tag]
}self.table.tags=self.getSelectedTags();
self.table.totalRows=-1;
self.table.fetchedRows=new Array();
self.table.showRows(1,self.table.limit)
})
}if(typeof this.selectedTags[tagLabel]=="object"){tag.addClassName("selected")
}var self=this;
tag.appendChild(document.createTextNode(" "));
cloud.appendChild(tag)
}this.domNode.down(".xwiki-livetable-tagcloud").appendChild(cloud)
},getSelectedTags:function(){var result=new Array();
this.domNode.select("li.selected").each(function(tag){result.push(tag.down("span").innerHTML)
});
return result
},buildPopularityMap:function(tags){var totalCount=0;
var minCount=0;
var maxCount=-1;
tags.each(function(tag){totalCount+=tag.count;
if(tag.count<minCount||minCount===0){minCount=tag.count
}if(tag.count>maxCount||maxCount===-1){maxCount=tag.count
}});
var countAverage=totalCount/tags.length;
var levelsHalf=this.popularityLevels.length/2;
var firstHalfCountDelta=countAverage-minCount;
var secondHalfCountDelta=maxCount-countAverage;
var firstHalfIntervalSize=firstHalfCountDelta/levelsHalf;
var secondHalfIntervalSize=secondHalfCountDelta/levelsHalf;
var previousPopularityMax=minCount;
var intervalSize=firstHalfIntervalSize;
var halfPassed=false;
var count=0;
var currentPopularityMax;
var popularityMap=new Hash();
this.popularityLevels.each(function(level){count++;
if(count>levelsHalf&&!halfPassed){intervalSize=secondHalfIntervalSize;
halfPassed=true
}currentPopularityMax=previousPopularityMax+intervalSize;
popularityMap.set(currentPopularityMax,level);
previousPopularityMax=currentPopularityMax
});
return popularityMap
}});
if(browser.isIE6x){document.observe("xwiki:livetable:newrow",function(ev){Event.observe(ev.memo.row,"mouseover",function(event){event.element().up("tr").addClassName("rowHover")
});
Event.observe(ev.memo.row,"mouseout",function(event){event.element().up("tr").removeClassName("rowHover")
})
})
}function init(){document.fire("xwiki:livetable:loading")
}(XWiki.isInitialized&&init())||document.observe("xwiki:dom:loading",init);
return XWiki
}(XWiki||{}));