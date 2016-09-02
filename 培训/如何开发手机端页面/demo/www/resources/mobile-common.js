/* 如需修改此文件，请做好更新日志！ */

/* 2012.08.10 08:00 修改domQuickClickTS和domQuickClickTE方法，是quickClick支持触摸效果 */
/* 2012.05.31 16:50 扩展$.fn.dragable方法 */
/* 2012.05.31 16:37 自动初始化.page_content高度，添加createListRow及相关方法 */
/* 2012.05.30 16:37 去除create$li方法及相关方法、去除分页相关方法、去除Web SQL相关方法、去除createSelectMenu|getScore|getUniqueInteger|objectToURLString|objArrayToURLString方法 */
/* 2012.05.07 16:37 initScroll添加autoHideScrollBar参数，自动隐藏滚动条 */
/* 2012.05.07 16:37 添加scrollToTarget方法 */
/* 2012.05.06 14:15 去除initScroll中使用代码为wrapper和scroller添加样式 */
/* 2012.04.25 16:20 修改quickClick的Bug，e.stopPropagation->e.propagation */
/* 2012.04.24 16:20 修改initScroll的Bug，添加:first选择器 */
/* 2012.03.11 17:54 quickClick支持stopPropagation方法 */
/* 2012.03.08 14:15 initScroll中使用代码为wrapper和scroller添加样式，不需要再引入样式文件，以方便使用 */

/* 掌厅版修改内容 */
/* scrollYTS修改e.target.tagName */
/* $.fn.addEventListener修改,添加参数，用于支持点击效果 */
/* 添加domQuickClickTS、domQuickClickTE接口 */
/* $.fn.addEventListener修改，添加对quickClick事件的支持 */
/* 修改scrollYTM */
/* scrollYTM、scrollYTE中事件响应函数调用专递参数顺序的修改 */
/* scrollYTS中去除e.stopPropagation */
/* domQuickClickTS和domQuickClickTE中暂时去除e.preventDefault */
/* scrollYTS中添加browserclick检测 */
/* intiScroll添加scrollBar参数 */
/* intiScroll添加scrollExTopHandler scrollingExBottomHandler scrollingExTopHandler */

/* 2012.08.27 12:00 修改尺寸单位px->em */
/* 2012.08.01 12:00 修改滚动效果，使之更流畅 */
/* 2012.07.31 12:00 添加scrollToBottom接口 */
/* 2012.07.15 12:00 修改了initScroll接口 */
/* 2012.06.15 12:00 滚动事件处理函数较大改动 */
/* 2012.05.08 11:24 修改createEvent scrollYTE scrollXTE使得在click taphold事件响应函数中使用e.stopPropagation()可以阻止事件的传播 */
/* 2012.05.07 15:00 添加resetScrollBar接口 */
/* 2012.05.05 17:59 scrollYTS和scrollXTS中添加e.stopPropagation防止嵌套的滚动 */
/* 2012.05.02 12:00 添加scrollToTop接口 */
/* 2012.04.26 10:56 修改X轴滚动,使用initScroll初始化 */
/* 2012.04.25 09:31 修改Y轴滚动，使之更流畅，依赖jquery.easing.js */
/* 2012.04.24 09:31 修改Y轴滚动，添加滚动条，添加initScrol接口 */
/* 2012.04.16 15:34 修改scrollYTE接口，支持滚动分页 */
/* 2012.04.09 10:55 修改create$li接口，支持arrow-r,minus类型 */
/* 2012.02.04 14:15 修改create$li接口，添加isScroll参数 */

/* pageshow初始化页面，设置page_content的高度，定义切换登录事件 */
$("div[data-role=page]").live("pageshow",function(e){
    //页面计算高度使用window.localInnerHeight
    if(!window.localInnerHeight && window.innerHeight!=0)
        window.localInnerHeight=window.innerHeight;
    var page=$(e.currentTarget);
    if(page.attr("autoheight")!="false"){
        page.find(".page_content").height( (window.localInnerHeight||window.innerHeight)-page.find(".page_header").height()-page.find(".page_footer").height() );
    }
});

/*
 * 新建自定义的列表行
 */
function createListRow(detail,type,defaultEvent){
    var html="";
    switch(type){   
        case "arrow-r":
        case "radio":
        case "checkbox":    
            html="<div>"+detail+"</div><span class='"+type+"'></span>";
            break;
        case "none":
        case null:
        case undefined:
            html="<div style='padding-right:0;'>"+detail+"</div>";
            break;
    }
    var $row=$("<div class='list_row'></div>").html(html);
    
    if(defaultEvent==false){
        return $row;
    }
    
    if(type=="radio"){
        $row.find("div:first, .radio").addEventListener("quickClick",function(e){
            var $list=$(e.currentTarget).closest(".list_row").parent();
            $list.find(".select_row").removeClass("select_row");
            $(e.currentTarget).closest(".list_row").addClass("select_row");
        });
    }
    if(type=="checkbox"){
        $row.find("duv:first, .checkbox").addEventListener("quickClick",function(e){
            var $currentRow=$(e.currentTarget).closest(".list_row");
            $currentRow.toggleClass("select_row");
        });
    }
    
    return $row;
}
/* 扩展列表行checked方法 */
$.fn.checked=function(){
    return this.addClass("selectRow");
};
/* 扩展列表行unchecked方法 */
$.fn.unchecked=function(){
    return this.removeClass("selectRow");
};
/* 扩展列表行isChecked方法 */
$.fn.isChecked=function(){        
    return this.hasClass("selectRow");
};

/* 定义触摸事件全局变量 */
(function(){
    window.supportTouch="ontouchstart" in window;
    START_EV = window.supportTouch ? "touchstart" : "mousedown";
    MOVE_EV = window.supportTouch ? "touchmove" : "mousemove";
    END_EV = window.supportTouch ? "touchend" : "mouseup";
})();

/* 扩展addEventListener方法 */
$.fn.addEventListener=function(eventType,handler,args,tscallback,tecallback){
    if(eventType=="quickClick"){
        this.each(function(){
            this.addEventListener(START_EV,domQuickClickTS);
        });
    }
        
    this.each(function(){
        $(this).data(eventType,[handler,args,tscallback,tecallback]);
    });
}

/* 扩展removeEventListener方法 */
$.fn.removeEventListener=function(eventType){
    this.removeData(eventType);
}

function createEvent(e,type){
    var point=window.supportTouch?e.changedTouches[0]:e;
    var event={};
    event.type=type;
    event.target=e.target;
    event.clientX=point.clientX;
    event.clientY=point.clientY;
    event.propagation=true; 
    event.stopPropagation=function(){
        event.propagation=false;    
    }
    
    return event;
}

/* 
 * 初始化滚动
 * @param wrapper .jszx-wrapper的id
 * @param dir "x" or "y"
 * @param bounce true or false
 * @param scrollExBottomHandler function
 * @return Number
 * @author max
 */
function initScroll(options){
	
	var $wrapper=$("#"+options["wrapper"]+"");
	var $scroller=$wrapper.find("div.jszx-scroller:first");
	
	if($scroller.data("scrollBar"))
		return;
	
	if(options["dir"]=="x"){
		$scroller[0].addEventListener(START_EV,scrollXTS);
		return;
	}
	
	$scroller[0].addEventListener(START_EV,scrollYTS);

	var scrollBar=$("<div style='background:#555;opacity:0.8;width:4px;border-radius:2px;position:absolute;top:0px;right:2px;'></div>")
	var scrollerHeight=$scroller.height();
	var wrapperHeight=$wrapper.height();
	var scrollBarHeight=scrollerHeight<=wrapperHeight?0:Math.floor(wrapperHeight*wrapperHeight/scrollerHeight);
	scrollBar.height(scrollBarHeight);
	scrollBar.appendTo($wrapper);
	$scroller.data("scrollBar",scrollBar);
	
	if(options["scrollBar"]==false)
	    scrollBar.hide();
    if(options["autoHideScrollBar"]==true)
        scrollBar.css({"opacity":"0"});
	
	$scroller.data("scrollExBottomHandler",options["scrollExBottomHandler"]);
	$scroller.data("scrollExTopHandler",options["scrollExTopHandler"]);
	
	$scroller.data("scrollingExBottomHandler",options["scrollingExBottomHandler"]);
	$scroller.data("scrollingExTopHandler",options["scrollingExTopHandler"]);
	
	$scroller.data("bounce",options["bounce"]||false);
	$scroller.data("autoHideScrollBar",options["autoHideScrollBar"]||false);
}

/* 
 * 滚动到顶部
 * @param wrapper .jszx-wrapper的id
 * @author max
 */
function scrollToTop(wrapper){
	var $wrapper=$("#"+wrapper+"");
	var $scroller=$wrapper.find("div.jszx-scroller");
	
	$scroller[0].style.WebkitTransition="";
	$scroller.data("scrollBar")[0].style.WebkitTransition="";
		
	$scroller[0].style.top="0px";
	$scroller.data("scrollBar")[0].style.top="0px";
}

/* 
 * 滚动到底部
 * @param wrapper .jszx-wrapper的id
 * @author max
 */
function scrollToBottom(wrapper){
	var $wrapper=$("#"+wrapper+"");
	var $scroller=$wrapper.find("div.jszx-scroller");
	
	if($wrapper[0].clientHeight-$scroller[0].clientHeight>0){
		return;
	}else{
		$scroller[0].style.WebkitTransition="";
		$scroller.data("scrollBar")[0].style.WebkitTransition="";
		$scroller[0].style.top=$wrapper[0].clientHeight-$scroller[0].clientHeight+"px";
		$scroller.data("scrollBar")[0].style.top=$wrapper[0].clientHeight-$scroller.data("scrollBar")[0].clientHeight+"px"
	}
}

/*
 * 滚动到某个DOM节点
 * @param wrapper .jszx-wrapper的id
 * @param target DOM对象
 * @author max
 */
function scrollToTarget(wrapper,target){
    var $wrapper=$("#"+wrapper+"");
    var $scroller=$wrapper.find("div.jszx-scroller");
    
    $scroller[0].style.WebkitTransition="";
    $scroller.data("scrollBar")[0].style.WebkitTransition="";
    
    if($scroller.height()-$wrapper.height()<0)
        return;
    if(target.offsetTop+$wrapper.height()>$scroller.height()){
        $scroller[0].style.top="-"+($scroller.height()-$wrapper.height())+"px";
        return;
    }
    $scroller[0].style.top="-"+target.offsetTop+"px";
} 

/* 
 * 重设滚动条
 * @param wrapper .jszx-wrapper的id
 * @param isTop 是否需要滑动到顶部
 * @author max
 */
function resetScrollBar(wrapper,isTop){
	var $wrapper=$("#"+wrapper);
	var $scroller=$wrapper.find("div.jszx-scroller");
	var $scrollerBar=$scroller.data("scrollBar");
	
	var scrollerHeight=$scroller.height();
	var wrapperHeight=$wrapper.height();
	var scrollBarHeight=scrollerHeight<=wrapperHeight?0:Math.floor(wrapperHeight*wrapperHeight/scrollerHeight);
	$scrollerBar.height(scrollBarHeight);
	
	$scroller[0].style.WebkitTransition="";
	$scrollerBar[0].style.WebkitTransition="";
	if(isTop){
		$scrollerBar[0].style.top="0px";
		$scroller[0].style.top="0px";
	}
	else
		$scrollerBar[0].style.top=-Math.floor($scroller.offsetTop*(wrapperHeight-scrollBarHeight)/(scrollerHeight-wrapperHeight))+"px";
}

function scrollYTS(e){
	if(e.target.tagName.toLocaleLowerCase()=="input" || e.target.tagName.toLocaleLowerCase()=="select" || e.target.tagName.toLocaleLowerCase()=="textarea")
		return;
	var target=e.target;
	while(target!==e.currentTarget){
	    if($(target).attr("browserclick"))
	        return;
	    target=target.parentElement;
	}
	e.preventDefault();
	e.currentTarget.addEventListener(MOVE_EV,scrollYTM);
	e.currentTarget.addEventListener(END_EV,scrollYTE);
	
	var point=window.supportTouch?e.touches[0]:e;
	$(e.currentTarget).data("startY",point.clientY);
	$(e.currentTarget).data("startX",point.clientX);
	$(e.currentTarget).data("startOffsetTop",e.currentTarget.offsetTop);
	$(e.currentTarget).data("startTime",new Date());
	$(e.currentTarget).data("direction",null);
	
	//e.stopPropagation();
}
function scrollYTE(e){
	e.preventDefault();
	var point=window.supportTouch?e.changedTouches[0]:e;
	
	e.currentTarget.removeEventListener(MOVE_EV,scrollYTM);
	e.currentTarget.removeEventListener(END_EV,scrollYTE);
	
	var touchStartY=$(e.currentTarget).data("startY");
	var touchStartX=$(e.currentTarget).data("startX");
	var touchStartTime=$(e.currentTarget).data("startTime");
	
	var touchEndOffsetTop=e.currentTarget.offsetTop;
	var touchEndTime=new Date();
	
	var scrollBar=$(e.currentTarget).data("scrollBar");
	
	var dir=$(e.currentTarget).data("direction");
	//click or taphold
	if(dir==null){
		if(touchEndTime.getTime()-touchStartTime.getTime()>750){
		    var eventTarget=e.target;
		    var event=createEvent(e,"taphold");
	        while(eventTarget!==e.currentTarget){
	        	event.currentTarget=eventTarget;
	        	if(!event.propagation)
					break;
	            if($(eventTarget).data("taphold")){
	            	var args=$(eventTarget).data("taphold")[1];
	            	if(args){
	            		$(eventTarget).data("taphold")[0].apply(window,[event].concat(args));
	            	}else{
	            		$(eventTarget).data("taphold")[0].call(window,event);
	            	}	
	            }
	            eventTarget=eventTarget.parentElement;
	        }
			return;
		}
		var eventTarget=e.target;
		var event=createEvent(e,"click");
		while(eventTarget!==e.currentTarget){
			event.currentTarget=eventTarget;
			if(!event.propagation)
				break;
		    if($(eventTarget).data("click")){
		        var args=$(eventTarget).data("click")[1];
            	if(args){
            		$(eventTarget).data("click")[0].apply(window,[event].concat(args));
            	}else{
            		$(eventTarget).data("click")[0].call(window,event);
            	}	
		    }
		    eventTarget=eventTarget.parentElement;
		}
		return;
	}
	//x swipe
	if(dir=="x"){
		var eventTarget=e.target;
	    var event=createEvent(e,"swipeend");
        while(eventTarget!==e.currentTarget){
        	event.currentTarget=eventTarget;
        	if(!event.propagation)
				break;
            if($(eventTarget).data("swipeend")){
            	var args=$(eventTarget).data("swipeend")[1];
            	if(args){
            		$(eventTarget).data("swipeend")[0].apply(window,[event,point.clientX-touchStartX].concat(args));
            	}else{
            		$(eventTarget).data("swipeend")[0].call(window,event,point.clientX-touchStartX);
            	}	
            }
            eventTarget=eventTarget.parentElement;
        }
		return;
	}
	//y scroll
	if(e.currentTarget.offsetTop>0){
	    if($(e.currentTarget).data("autoHideScrollBar")==true)
            $(e.currentTarget).data("scrollBar").animate({"opacity":"0"},500);
	    var scrollExTopHandler=$(e.currentTarget).data("scrollExTopHandler");
	    if(scrollExTopHandler){
	        scrollExTopHandler.call(this,function(){
	            $(e.currentTarget).animate({top:"0px"}, "fast");
	            scrollBar.animate({top:"0px"}, "fast");
            });
            return;
        }
		$(e.currentTarget).animate({top:"0px"}, "fast");
		scrollBar.animate({top:"0px"}, "fast");
		return;
	}

	if($(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight>0){
	    if($(e.currentTarget).data("autoHideScrollBar")==true)
            $(e.currentTarget).data("scrollBar").animate({"opacity":"0"},500);
		$(e.currentTarget).animate({top:"0px"}, "fast");
		return;
	}
	
	if(e.currentTarget.offsetTop<$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight){
	    if($(e.currentTarget).data("autoHideScrollBar")==true)
            $(e.currentTarget).data("scrollBar").animate({"opacity":"0"},500);
		var scrollExBottomHandler=$(e.currentTarget).data("scrollExBottomHandler");
		if(scrollExBottomHandler){
			scrollExBottomHandler.call(this,function(){
				$(e.currentTarget).animate({top:$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight+"px"}, "fast");
				scrollBar.animate({top:$(e.currentTarget).parent()[0].clientHeight-scrollBar[0].clientHeight+"px"}, "fast");
			});
			return;
	    }
		$(e.currentTarget).animate({top:$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight+"px"}, "fast");
		scrollBar.animate({top:$(e.currentTarget).parent()[0].clientHeight-scrollBar[0].clientHeight+"px"}, "fast");
		return;
	}
	
	var touchInterval=touchEndTime.getTime()-touchStartTime.getTime();
	var touchDistance=point.clientY-touchStartY;
	if(touchInterval<=500){
		var scrollDistance=Math.abs(Math.floor(350*touchDistance*touchDistance/touchInterval/touchInterval));
		//var scrollInterval=Math.abs(Math.floor(scrollDistance*touchInterval/touchDistance));
		var endTop;
		if(touchDistance>0){
			if(touchEndOffsetTop+scrollDistance>0)
				endTop=0;
			else
				endTop=touchEndOffsetTop+scrollDistance;
		}else{
			if(touchEndOffsetTop-scrollDistance<$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight)
				endTop=$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight;
			else
				endTop=touchEndOffsetTop-scrollDistance;
		}
		
		var scrollInterval=Math.abs(Math.floor((endTop-touchEndOffsetTop)*touchInterval/touchDistance));
		
		$(e.currentTarget)[0].style.WebkitTransition="top "+scrollInterval/1000+"s ease-out";
		$(e.currentTarget)[0].style.top=endTop+"px";
		scrollBar[0].style.WebkitTransition="top "+scrollInterval/1000+"s ease-out";
		scrollBar[0].style.top=-Math.floor(endTop*($(e.currentTarget).parent().height()-scrollBar.height())/($(e.currentTarget).height()-$(e.currentTarget).parent().height()))+"px"
		
		if($(e.currentTarget).data("autoHideScrollBar")==true){
            var $scroller=$(e.currentTarget);
		    setTimeout(function(){
		        $scroller.data("scrollBar").animate({"opacity":"0"},500);
		    },scrollInterval)
		}
           
		//$(e.currentTarget).animate({top:endTop+"px"},scrollInterval,"easeOutCubic");
		//scrollBar.animate({top:-Math.floor(endTop*($(e.currentTarget).parent().height()-scrollBar.height())/($(e.currentTarget).height()-$(e.currentTarget).parent().height()))+"px"},scrollInterval,"easeOutCubic");
	}else{
        if($(e.currentTarget).data("autoHideScrollBar")==true){
            $(e.currentTarget).data("scrollBar").animate({"opacity":"0"},500);
	}
    }
	
}
function scrollYTM(e){
	e.preventDefault();
	var point=window.supportTouch?e.touches[0]:e;
	
	var touchStartY=$(e.currentTarget).data("startY");
	var touchStartX=$(e.currentTarget).data("startX");
	var touchStartOffsetTop=$(e.currentTarget).data("startOffsetTop");
	var touchStartTime=$(e.currentTarget).data("startTime");
	var scrollBar=$(e.currentTarget).data("scrollBar");
	var bounce=$(e.currentTarget).data("bounce");
	
	var dir;
	if(!$(e.currentTarget).data("direction")){
		if(Math.abs(point.clientX-touchStartX)<5 && Math.abs(point.clientY-touchStartY)<5)
			return;
		dir=Math.abs(point.clientX-touchStartX)-Math.abs(point.clientY-touchStartY);
		if(dir>0){
			$(e.currentTarget).data("direction","x");
		}
		else{
			$(e.currentTarget).data("direction","y");
		}
	}
	dir=$(e.currentTarget).data("direction");
	if(dir=="y"){
        if($(e.currentTarget).data("autoHideScrollBar")==true)
            $(e.currentTarget).data("scrollBar").css({"opacity":"0.8"});
        
		$(e.currentTarget)[0].style.WebkitTransition="";
		scrollBar[0].style.WebkitTransition="";
		
		//禁止越过边界
		if(bounce){
			if($(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight>0){
				return;
			}
			if(touchStartOffsetTop+point.clientY-touchStartY>0){
			    if(touchStartOffsetTop==0){
    			    var scrollingExTopHandler=$(e.currentTarget).data("scrollingExTopHandler");
    			    if(scrollingExTopHandler){
    			        scrollingExTopHandler.call(window,point.clientY-touchStartY);
    			    }
    			}
				e.currentTarget.style.top="0px";
				scrollBar[0].style.top="0px";
				return;
			}
			if(touchStartOffsetTop+point.clientY-touchStartY<$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight){
			    if(touchStartOffsetTop==$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight){
    			    var scrollingExBottomHandler=$(e.currentTarget).data("scrollingExBottomHandler");
                    if(scrollingExBottomHandler){
                        scrollingExBottomHandler.call(window,point.clientY-touchStartY);
                    }
			    }
				$(e.currentTarget).css({top:$(e.currentTarget).parent()[0].clientHeight-e.currentTarget.clientHeight+"px"});
				scrollBar.css({top:$(e.currentTarget).parent()[0].clientHeight-scrollBar[0].clientHeight+"px"});
				return;
			}
		}
		
		e.currentTarget.style.top=touchStartOffsetTop+point.clientY-touchStartY+"px";
		scrollBar[0].style.top=-Math.floor((touchStartOffsetTop+point.clientY-touchStartY)*($(e.currentTarget).parent().height()-scrollBar.height())/($(e.currentTarget).height()-$(e.currentTarget).parent().height()))+"px";
	}else{
		var eventTarget=e.target;
	    var event=createEvent(e,"swiping");
        while(eventTarget!==e.currentTarget){
        	event.currentTarget=eventTarget;
        	if(!event.propagation)
				break;
            if($(eventTarget).data("swiping")){
            	var args=$(eventTarget).data("swiping")[1];
            	if(args){
            		$(eventTarget).data("swiping")[0].apply(window,[event,point.clientX-touchStartX].concat(args));
            	}else{
            		$(eventTarget).data("swiping")[0].call(window,event,point.clientX-touchStartX);
            	}	
            }
            eventTarget=eventTarget.parentElement;
        }
	}
}
function scrollXTS(e){
    if(e.target.tagName.toLocaleLowerCase()=="input" || e.target.tagName.toLocaleLowerCase()=="select" || e.target.tagName.toLocaleLowerCase()=="textarea")
        return;
	e.preventDefault();
	e.currentTarget.addEventListener(MOVE_EV,scrollXTM);
    e.currentTarget.addEventListener(END_EV,scrollXTE);
	
	var point=window.supportTouch?e.touches[0]:e;
	$(e.currentTarget).data("startY",point.clientY);
	$(e.currentTarget).data("startX",point.clientX);
	$(e.currentTarget).data("startOffsetLeft",e.currentTarget.offsetLeft);
	$(e.currentTarget).data("startTime",new Date());
	$(e.currentTarget).data("direction",null);
	
	e.stopPropagation();
}
function scrollXTE(e){
    var point=window.supportTouch?e.changedTouches[0]:e;
    e.preventDefault();
    e.currentTarget.removeEventListener(MOVE_EV,scrollXTM);
    e.currentTarget.removeEventListener(END_EV,scrollXTE);
    
    var touchStartX=$(e.currentTarget).data("startX");
	var touchStartTime=$(e.currentTarget).data("startTime");
	
	var touchEndOffsetLeft=e.currentTarget.offsetLeft;
	var touchEndTime=new Date();
    
    if(point.clientX-touchStartX<10 && point.clientX-touchStartX>-10){
        if(touchEndTime.getTime()-touchStartTime.getTime()>750){
            var eventTarget=e.target;
            var event=createEvent(e,"taphold");
            while(eventTarget!==e.currentTarget){
            	event.currentTarget=eventTarget;
            	if(!event.propagation)
					break;
	            if($(eventTarget).data("taphold")){
	            	var args=$(eventTarget).data("taphold")[1];
	            	if(args){
	            		args.push(event);
	            		$(eventTarget).data("taphold")[0].apply(window,args);
	            	}else{
	            		$(eventTarget).data("taphold")[0].call(window,event);
	            	}	
	            }
	            eventTarget=eventTarget.parentElement;
            }
            return;
        }
        var eventTarget=e.target;
        var event=createEvent(e,"click");
		while(eventTarget!==e.currentTarget){
			event.currentTarget=eventTarget;
			if(!event.propagation)
				break;
		    if($(eventTarget).data("click")){
		        var args=$(eventTarget).data("click")[1];
            	if(args){
            		args.push(event);
            		$(eventTarget).data("click")[0].apply(window,args);
            	}else{
            		$(eventTarget).data("click")[0].call(window,event);
            	}	
		    }
		    eventTarget=eventTarget.parentElement;
		}
        return;
    }
    
    if(e.currentTarget.offsetLeft>0){
        $(e.currentTarget).animate({left:"0px"}, "fast");
        return;
    }

    if($(e.currentTarget).parent()[0].clientWidth-e.currentTarget.clientWidth>0){
        $(e.currentTarget).animate({left:"0px"}, "fast");
        return;
    }
    
    if(e.currentTarget.offsetLeft<$(e.currentTarget).parent()[0].clientWidth-e.currentTarget.clientWidth){
        $(e.currentTarget).animate({left:$(e.currentTarget).parent()[0].clientWidth-e.currentTarget.clientWidth+"px"}, "fast");
        return;
    }
    
}
function scrollXTM(e){
	e.preventDefault();
	var touchStartX=$(e.currentTarget).data("startX");
	var touchStartOffsetLeft=$(e.currentTarget).data("startOffsetLeft");
	var point=window.supportTouch?e.touches[0]:e;
    if(point.clientX-touchStartX>=10 || point.clientX-touchStartX<=-10){
    	//禁止越界
    	if($(e.currentTarget).parent()[0].clientWidth-e.currentTarget.clientWidth>0){
			return;
		}
		if(touchStartOffsetLeft+point.clientX-touchStartX>0){
			e.currentTarget.style.left="0px";
			return;
		}
		if(touchStartOffsetLeft+point.clientX-touchStartX<$(e.currentTarget).parent()[0].clientWidth-e.currentTarget.clientWidth){
			$(e.currentTarget).css({left:$(e.currentTarget).parent()[0].clientWidth-e.currentTarget.clientWidth+"px"});
			return;
		}
        e.currentTarget.style.left=touchStartOffsetLeft+point.clientX-touchStartX+"px";
    }
}

function domQuickClickTS(e){
    var target=e.currentTarget;
    
	var tscallback=$(target).data("quickClick")[2];
	if(tscallback)
		tscallback.call(window,target);
	
	if(target.tagName.toLocaleLowerCase()=="img" && $(target).attr("altsrc")){
	    if(!$(target).attr("orisrc"))
	        $(target).attr("orisrc",target.src);

	    target.src=$(target).attr("altsrc");
	    
	    setTimeout(function(){
	        target.src=$(target).attr("orisrc");
	    },2000)
	}
	
	$(target).addClass("pressed");
	setTimeout(function(){
	    $(target).removeClass("pressed");
    },2000)
	
	target.addEventListener(END_EV,domQuickClickTE);
	
	var point=window.supportTouch?e.touches[0]:e;
	$(target).data("startY",point.clientY);
	$(target).data("startX",point.clientX);
	$(target).data("startTime",new Date());
	
	//e.preventDefault();
	return;
}
function domQuickClickTE(e){
	var tecallback=$(e.currentTarget).data("quickClick")[3];
	if(tecallback)
		tecallback.call(window,e.currentTarget);
	
	if(e.currentTarget.tagName.toLocaleLowerCase()=="img" && $(e.currentTarget).attr("altsrc")){
	    if($(e.currentTarget).attr("orisrc"))
	        e.currentTarget.src=$(e.currentTarget).attr("orisrc");
    }
	
	$(e.currentTarget).removeClass("pressed");
	
	e.currentTarget.removeEventListener(END_EV,domQuickClickTE);

	var touchStartY=$(e.currentTarget).data("startY");
	var touchStartX=$(e.currentTarget).data("startX");
	var point=window.supportTouch?e.changedTouches[0]:e;
	var startTime=$(e.currentTarget).data("startTime");
	var endTime=new Date();
	
	if(Math.abs(point.clientX-touchStartX)<10 && Math.abs(point.clientY-touchStartY)<10){
		if(endTime.getTime()-startTime.getTime()>500)
			return;
		var eventTarget=e.currentTarget;
	    if($(eventTarget).data("quickClick")){
			var event=createEvent(e,"quickClick");
			event.currentTarget=eventTarget;
	        var args=$(eventTarget).data("quickClick")[1];
        	if(args){
        		$(eventTarget).data("quickClick")[0].apply(window,[event].concat(args));
        	}else{
        		$(eventTarget).data("quickClick")[0].call(window,event);
        	}
			if(!event.propagation)
				e.stopPropagation();
	    }
	}
	
	//e.preventDefault();
	return;
}

function initSwipe(id,callback){
    $("#"+id)[0].addEventListener(START_EV,swipeTS);
    $("#"+id).data("callback",callback);
}
function swipeTS(e){
    e.currentTarget.addEventListener(END_EV,swipeTE);
    
    var point=window.supportTouch?e.touches[0]:e;
    $(e.currentTarget).data("startY",point.clientY);
    $(e.currentTarget).data("startX",point.clientX);
    $(e.currentTarget).data("startTime",new Date());
}
function swipeTE(e){
    e.currentTarget.removeEventListener(END_EV,swipeTE);
    
    var point=window.supportTouch?e.changedTouches[0]:e;
    
    var touchStartX=$(e.currentTarget).data("startX");
    var touchStartY=$(e.currentTarget).data("startY");
    var touchStartTime=$(e.currentTarget).data("startTime");
    
    var touchEndTime=new Date();
    
    $(e.currentTarget).data("callback").call(window,touchStartX,touchStartY,point.clientX,point.clientY,touchStartTime,touchEndTime);
}

/*
 * 扩展dragable方法 使DOM可拖动
 * @param options.bounce 是否可以将元素拖出边界
 */
$.fn.dragable=function(options){
	var dragStart=function(e){
		e.preventDefault();
		e.currentTarget.addEventListener(MOVE_EV,dragMove);
		e.currentTarget.addEventListener(END_EV,dragEnd);
		
		var point=window.supportTouch?e.touches[0]:e;
		var $thisDom=$(e.currentTarget);
		$thisDom.data("startX",point.clientX);
		$thisDom.data("startY",point.clientY);
		$thisDom.data("startOffsetLeft",$thisDom[0].offsetLeft);
		$thisDom.data("startOffsetTop",$thisDom[0].offsetTop);
	};
	var dragMove=function(e){
		e.preventDefault();
		
		var point=window.supportTouch?e.touches[0]:e;
		var $thisDom=$(e.currentTarget);
		var startX=$thisDom.data("startX");
		var startY=$thisDom.data("startY");
		var startOffsetLeft=$thisDom.data("startOffsetLeft");
		var startOffsetTop=$thisDom.data("startOffsetTop");
		
		if(options && options.bounce){
			if(startOffsetLeft+point.clientX-startX<0)
				return;
			if(startOffsetTop+point.clientY-startY<0)
				return;
			if(startOffsetLeft+point.clientX-startX>e.currentTarget.parentElement.clientWidth-e.currentTarget.clientWidth)
				return;
			if(startOffsetTop+point.clientY-startY>e.currentTarget.parentElement.clientHeight-e.currentTarget.clientHeight)
				return;
		}
		$thisDom.css({"left":startOffsetLeft+point.clientX-startX});
		$thisDom.css({"top":startOffsetTop+point.clientY-startY})
	};
	var dragEnd=function(e){
		e.preventDefault();
		e.currentTarget.removeEventListener(MOVE_EV,dragMove);
		e.currentTarget.removeEventListener(END_EV,dragEnd);
	};
	
	this.css({"position":"absolute"});
	this[0].addEventListener(START_EV,dragStart);
}

/*
 * 判断页面元素是否可见
 * @param obj dom对象或者jQuery对象
 */
function isVisible(obj){
    if(obj.tagName)
        return obj.style.display!="none";
    else
        return obj[0].style.display!="none";
    
}

/* 
 * 将Form中的表单项根据其name和value属性封装成对象
 * @param $form 封装Form的JQuery对象
 * @return Object
 * 备注：Form中的表单项须设置name属性，否则不会被封装
 * @author max
 */
function formToObject($form){
    var obj=new Object();
    $form.find("input,textarea,button,select").each(function(){
        if(this.name)
            obj[this.name]=this.value;
    });
    return obj;
}

/* 
 * 根据Object的属性名和值设置Form中的表单项的value
 * @param obj Object
 * @param $form 封装了被设置的Form的JQuery对象
 * 备注：Form中的表单项须设置name属性，否则不会被设置
 * @author max
 */
function objectToForm(obj,$form){
    $form[0].reset();
    $form.find("input,textarea,button").each(function(){
        if(this.name)
            this.value=obj[this.name];
    });
    $form.find("select").each(function(){
        for(var i=0;i<this.options.length;i++){
            if(!this.name && this.options[i].value==obj[this.name]){
                this.options[i].selected=true;
            }
        }
    });
}