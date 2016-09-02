
function JSGrid(options){
	this.options=options;
	this.status="view";
	this.deletedData=[];
	
	this.$grid=$("#"+options.id).empty();
	
	for(var i=0;i<options.data.length;i++){
		var html,$div;
		html="<div class='grid-div' align='center'>"
			+   "<div class='grid-icon-holder'>"
			+       "<img class='grid-icon' src='"+options.data[i].icon+"'/>"
			+       "<img class='grid-delete' src='"+(options.deleteImg||"images/del.png")+"' style='display:none;'/>"
			+   "</div><br>"
			+   "<div class='grid-text'>"+options.data[i].name+"</div>"
			+"</div>";
		$div=$(html);
		$div.appendTo(this.$grid);
		$div.data("data",options.data[i]);
		
		$div.addEventListener("quickClick",$.proxy(function(e){
			var data=$(e.currentTarget).data("data");
			if(this.status=="view" && options.onclick)
				options.onclick.call(window,data);
		},this));
		
		$div.find(".grid-delete").addEventListener("quickClick",$.proxy(function(e){
			e.stopPropagation();
			this.deletedData.push($(e.currentTarget).closest(".grid-div").data("data"));
			$(e.currentTarget).closest(".grid-div").remove();
        },this));
		
		if(options.deletable || options.sortable)
			$div.bind("taphold",$.proxy(this.beginEdit,this));
	}
	var rowNumber=Math.round(window.innerWidth/this.$grid.find(".grid-div:first").width());
	var rows=Math.ceil(options.data.length/rowNumber);
	this.$grid.height(this.$grid.find(".grid-div:first").height()*rows);
}
JSGrid.prototype.beginEdit=function(){
	if(this.status=="edit")
		return;
	this.status="edit";
	if(this.options.deletable)
		this.$grid.find(".grid-delete").show();
	if(this.options.sortable){
		this.$grid.find(".grid-div").each(function(){
			this.addEventListener(START_EV,JSGrid._moveStart);
		});
	}
	this.$grid.find(".grid-div").unbind("taphold");
	if(this.options.shake){
		this._shake();
	}
}
JSGrid.prototype.endEdit=function(){
	this.status="view";
	if(this.options.deletable)
		this.$grid.find(".grid-delete").hide();
	if(this.options.sortable){
		this.$grid.find(".grid-div").each(function(){
			this.removeEventListener(START_EV,JSGrid._moveStart);
		});
	}
	if(this.options.deletable || this.options.sortable)
		this.$grid.find(".grid-div").bind("taphold",$.proxy(this.beginEdit,this));
	if(this.options.shake){
		this._endShake();
	}
}
JSGrid._moveStart=function(e){
	if($(e.target).hasClass("grid-delete")){
		return;
	}
	var point=window.supportTouch?e.touches[0]:e;
	
	$(e.currentTarget).data("startLeft",e.currentTarget.offsetLeft);
	$(e.currentTarget).data("startTop",e.currentTarget.offsetTop);
	$(e.currentTarget).data("tapholdStartLeft",point.clientX);
	$(e.currentTarget).data("tapholdStartTop",point.clientY);

	e.currentTarget.style.top=e.currentTarget.offsetTop+"px";
	e.currentTarget.style.left=e.currentTarget.offsetLeft+"px";
	e.currentTarget.style.position="absolute";
	
	var $currGridDiv=$(e.currentTarget);
	$("<div class='grid-div temp-div'></div>").insertAfter($currGridDiv);
	$currGridDiv.insertAfter($currGridDiv.parent().find("div.grid-div").last());
	
	e.currentTarget.addEventListener(MOVE_EV,JSGrid._moveOn);
	e.currentTarget.addEventListener(END_EV,JSGrid._moveEnd);
	
	e.preventDefault();
	e.stopPropagation();
}
JSGrid._moveOn=function(e){
	var point=window.supportTouch?e.touches[0]:e;
	var tapholdMoveLeft=point.clientX;
	var tapholdMoveTop=point.clientY;

	var startLeft=$(e.currentTarget).data("startLeft");
	var startTop=$(e.currentTarget).data("startTop");
	var tapholdStartLeft=$(e.currentTarget).data("tapholdStartLeft");
	var tapholdStartTop=$(e.currentTarget).data("tapholdStartTop");
	
	e.currentTarget.style.top=startTop+(tapholdMoveTop-tapholdStartTop)+"px";
	e.currentTarget.style.left=startLeft+(tapholdMoveLeft-tapholdStartLeft)+"px";
	
	e.preventDefault();
	e.stopPropagation();
}
JSGrid._moveEnd=function(e){
	function getBodyTop(target){
		var bodyTop=0;
		while(target){
			bodyTop=target.clientTop+target.offsetTop+bodyTop;
			target=target.offsetParent;
		}
		return bodyTop;
	}
	
	e.currentTarget.removeEventListener(MOVE_EV,JSGrid._moveOn);
	e.currentTarget.removeEventListener(END_EV,JSGrid._moveEnd);
	
	var point=window.supportTouch?e.changedTouches[0]:e;
	var endX=Math.ceil(point.clientX*Math.round(window.innerWidth/e.currentTarget.offsetWidth)/window.innerWidth);
	var endY=Math.ceil((point.clientY-getBodyTop(e.currentTarget.parentElement))/e.currentTarget.offsetHeight);
	
	var endIndex=(endY-1)*Math.round(window.innerWidth/e.currentTarget.offsetWidth)+endX-1;
	
	var $target=$(e.currentTarget);
	var $tempDiv=$target.parent().find("div.temp-div");
	var length=$target.parent().find("div.grid-div").length-1;
	
	e.currentTarget.style.position="relative";
	e.currentTarget.style.top="";
	e.currentTarget.style.left="";
	
	if(endIndex<0){
		$target.insertBefore($tempDiv);
		$tempDiv.remove();
	}else if(endIndex>=length-1){
		$tempDiv.remove();
	}else{
		$tempDiv.remove();
		$target.insertBefore($target.parent().find("div.grid-div:eq("+endIndex+")"));
	}
	
	e.preventDefault();
	e.stopPropagation();
}
JSGrid.prototype._shake=function(){
	this.$grid.find("div.grid-div").each(function(){
		var rx=Math.floor(Math.random()*4);
		switch(rx){
			case 0:
				this.style.WebkitTransform="rotate(3deg)";
				$(this).data("status",1);
				break;
			case 1:
				this.style.WebkitTransform="rotate(0deg)";
				$(this).data("status",2);
				break;
			case 2:
				this.style.WebkitTransform="rotate(-3deg)";
				$(this).data("status",3);
				break;
			case 3:
				this.style.WebkitTransform="rotate(0deg)";
				$(this).data("status",0);
				break;
		}
	});
	this._shakeInterval=setInterval($.proxy(function(){
		this.$grid.find("div.grid-div").each(function(){
			var status=$(this).data("status");
			switch(status){
				case 0:
					this.style.WebkitTransform="rotate(3deg)";
					$(this).data("status",1);
					break;
				case 1:
					this.style.WebkitTransform="rotate(0deg)";
					$(this).data("status",2);
					break;
				case 2:
					this.style.WebkitTransform="rotate(-3deg)";
					$(this).data("status",3);
					break;
				case 3:
					this.style.WebkitTransform="rotate(0deg)";
					$(this).data("status",0);
					break;
			}
		});
	},this),80);
}
JSGrid.prototype._endShake=function(){
	clearInterval(this._shakeInterval);
	this.$grid.find("div.grid-div").each(function(){
		this.style.WebkitTransform="rotate(0deg)";
	});
}
JSGrid.prototype.getSortedData=function(){
	var data=[];
	this.$grid.find(".grid-div").each(function(){
		data.push($(this).data("data"));
	});
	return data;
}
JSGrid.prototype.getDeletedData=function(){
	return this.deletedData;
}