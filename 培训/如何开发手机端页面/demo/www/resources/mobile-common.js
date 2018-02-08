/* 如需修改此文件，请做好更新日志！ */

/* 2013.08.10 08:00 修改domQuickClickTS和domQuickClickTE方法，是quickClick支持触摸效果 */
/* 2013.05.31 16:50 扩展$.fn.dragable方法 */
/* 2013.05.31 16:37 自动初始化.page_content高度，添加createListRow及相关方法 */
/* 2013.05.30 16:37 去除create$li方法及相关方法、去除分页相关方法、去除Web SQL相关方法、去除createSelectMenu|getScore|getUniqueInteger|objectToURLString|objArrayToURLString方法 */
/* 2013.05.07 16:37 initScroll添加autoHideScrollBar参数，自动隐藏滚动条 */
/* 2013.05.07 16:37 添加scrollToTarget方法 */
/* 2013.05.06 14:15 去除initScroll中使用代码为wrapper和scroller添加样式 */
/* 2013.04.25 16:20 修改quickClick的Bug，e.stopPropagation->e.propagation */
/* 2013.04.24 16:20 修改initScroll的Bug，添加:first选择器 */
/* 2013.03.11 17:54 quickClick支持stopPropagation方法 */
/* 2013.03.08 14:15 initScroll中使用代码为wrapper和scroller添加样式，不需要再引入样式文件，以方便使用 */

/* 掌厅版修改内容 */
/* scrollYTS修改e.target.tagName */
/* $.fn.listen修改,添加参数，用于支持点击效果 */
/* 添加domQuickClickTS、domQuickClickTE接口 */
/* $.fn.listen修改，添加对quickClick事件的支持 */
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
/* 2012.04.24 09:31 修改Y轴滚动，添加滚动条，添加initScroll接口 */
/* 2012.04.16 15:34 修改scrollYTE接口，支持滚动分页 */
/* 2012.04.09 10:55 修改create$li接口，支持arrow-r,minus类型 */
/* 2012.02.04 14:15 修改create$li接口，添加isScroll参数 */


$.fn.live=function(event,handler){
	$(document).on(event,this.selector,handler);
}

$("div[data-role=page]").live("pageshow",function(e){
    //页面计算高度使用window.localInnerHeight
    if(!window.localInnerHeight && window.innerHeight!=0)
        window.localInnerHeight=window.innerHeight;
    var page=$(e.currentTarget);
    if(page.attr("autoheight")!="false"){
        page.find(".page_content").height( (window.localInnerHeight||window.innerHeight)-page.find(".page_header").height()-page.find(".page_footer").height() );
    }
});

/* 定义onquickclick属性  */
$("div[data-role=page]").live("pagecreate",function(e){
    $(e.currentTarget).find("*[onquickclick]").listen("quickClick",function(e){
        var handler=$(e.currentTarget).attr("onquickclick");
        eval(handler);
    });
});

/* 权限定义 */
$("div[data-role=page]").live("pageshow",function(e){
    $(e.currentTarget).find("*[user-role]").each(function(){
        var roles=$(this).attr("user-role");
        roles=roles.split(" ");
        var flag=false;
        for(var i=0;i<roles.length;i++){
            if(roles[i]==window.userRole){
                flag=true;
                break;
            }
        }
        if(flag)
            $(this).show();
        else
            $(this).hide();
    });
});

/* 定义$$方法 */
var $$=function(selector){
    return $(".ui-page-active").find(selector);
}

$("div[data-role=page]").live("pagecreate",function(e){
    $(e.currentTarget).find("*[type=partImg]").each(function(){
        partImg(this);
    });
});

function partImg(dom){
    var $dom=$(dom).empty();
    $dom.addClass("max-img-wrapper");
    
    var targetWidth=$dom.attr("width");
    var targetHeight=$dom.attr("height");
    $dom.width(targetWidth).height(targetHeight);
    
    var $img=$("<img src='"+$dom.attr("src")+"'>").appendTo($dom);
    
    var img=new Image();
    img.src=$dom.attr("src");
    img.onload=function(){
        if(targetWidth/targetHeight<img.width/img.height){
            $img.height(targetHeight);
            
            var align=$dom.attr("align")||"center";
            var imgWidth=targetHeight*img.width/img.height;
            if(align=="left" || align=="top")
                $img.css("left",0);
            else if(align=="center" || align=="middle")
                $img.css("left",(targetWidth-imgWidth)/2);
            else if(align=="right" || align=="bottom")
                $img.css("left",(targetWidth-imgWidth));
        }else{
            $img.width(targetWidth);
            
            var align=$dom.attr("align")||"center";
            var imgHeight=targetWidth*img.height/img.width;
            if(align=="left" || align=="top")
                $img.css("top",0);
            else if(align=="center" || align=="middle")
                $img.css("top",(targetHeight-imgHeight)/2);
            else if(align=="right" || align=="bottom")
                $img.css("top",(targetHeight-imgHeight));
        }
    }
}

/*
 * 新建自定义的列表行
 */
function createListRow(detail,type,defaultEvent){
    var html="";
    switch(type){   
        case "arrow-r":
        case "radio":
        case "checkbox":    
            html="<table width='100%'><tr><td>"+detail+"</td><td align='center' style='width:3em;'><span class='"+type+"'></span></td></tr></table>";
            break;
        case "none":
        case null:
        case undefined:
            html=detail;
            break;
    }
    var $row=$("<div class='list_row'></div>").html(html);
    
    if(defaultEvent==false){
        return $row;
    }
    
    if(type=="radio"){
        $row.find("div:first, .radio").listen("quickClick",function(e){
            var $list=$(e.currentTarget).closest(".list_row").parent();
            $list.find(".select_row").removeClass("select_row");
            $(e.currentTarget).closest(".list_row").addClass("select_row");
        });
    }
    if(type=="checkbox"){
        $row.find("duv:first, .checkbox").listen("quickClick",function(e){
            var $currentRow=$(e.currentTarget).closest(".list_row");
            $currentRow.toggleClass("select_row");
        });
    }
    
    return $row;
}
/* 扩展列表行checked方法 */
$.fn.checked=function(){
    return this.addClass("select_row");
};
/* 扩展列表行unchecked方法 */
$.fn.unchecked=function(){
    return this.removeClass("select_row");
};
/* 扩展列表行isChecked方法 */
$.fn.isChecked=function(){
    return this.hasClass("select_row");
};
$.fn.deletable=function(callback){
    var that=this;
    if(!that.hasClass("list_row"))
        return;
    that.css("left","0px");
    that.css("webkitTransition","left 0.1s ease-in");
    var $delete=$("<div class='delete'>删除</div>").appendTo(that);
    $delete.listen("quickClick",function(e){
        e.stopPropagation();
        callback(that);
    });
    that.swipeLeft(function(){
        that.css("left","-60px");
    });
    that.swipeRight(function(){
        that.css("left","0px");
    });
};


/* 定义触摸事件全局变量 */
(function(){
    window.supportTouch="ontouchstart" in window;
    START_EV = window.supportTouch ? "touchstart" : "mousedown";
    MOVE_EV = window.supportTouch ? "touchmove" : "mousemove";
    END_EV = window.supportTouch ? "touchend" : "mouseup";
})();

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
	
	var $wrapper=$("#"+options["wrapper"]);
	var $scroller=$wrapper.find("div.jszx-scroller:first");
	
	if($scroller.data("scrollBar"))
		return;
	
	$scroller[0].addEventListener(START_EV,scrollTS);

	var $scrollBar;
	if(options["dir"]=="x"){
	    $scroller.css("min-width","100%");
	    
	    $scrollBar=$("<div class='scroll-bar-x'></div>")
	    var scrollerWidth=$scroller.width();
	    var wrapperWidth=$wrapper.width();
	    var scrollBarWidth=(scrollerWidth<=wrapperWidth?0:Math.floor(wrapperWidth*wrapperWidth/scrollerWidth));
	    $scrollBar.width(scrollBarWidth);
	}else{
	    $scroller.css("min-height","100%");
	    
	    $scrollBar=$("<div class='scroll-bar-y'></div>")
        var scrollerHeight=$scroller.height();
        var wrapperHeight=$wrapper.height();
        var scrollBarHeight=(scrollerHeight<=wrapperHeight?0:Math.floor(wrapperHeight*wrapperHeight/scrollerHeight));
        $scrollBar.height(scrollBarHeight);
	}
	$scrollBar.appendTo($wrapper);
	$scroller.data("scrollBar",$scrollBar);
	
	if(options["scrollBar"]==false)
	    $scrollBar.hide();
    if(options["autoHideScrollBar"]==true)
        $scrollBar[0].style.opacity=0;
		
	if(options["pullDownLoading"]){
		var html="<div class='pull-down' style='position:absolute;top:-50px;height:50px;width:100%;line-height:50px;text-align:center;border:0;padding:0;margin:0;'>"
				+	"<img style='position:relative;height:30px;top:10px;margin-right:10px;-webkit-transition:-webkit-transform 0.1s ease-out;-webkit-transform:rotate(0deg);' src='"+window.resUrl+"images/pull-down.png'>"
				+	"<span style='font-size:0.9em;color:#888;'>下拉进行刷新</span>"
				+"</div>";
		$(html).appendTo($wrapper);
		$scroller.data("pullDownLoading",options["pullDownLoading"]);
	}
	
	if(options["pullUpLoading"]){
		var html="<div class='pull-up' style='position:absolute;bottom:-50px;height:50px;width:100%;line-height:50px;text-align:center;border:0;padding:0;margin:0;'>"
				+	"<img style='position:relative;height:30px;top:10px;margin-right:10px;-webkit-transition:-webkit-transform 0.1s ease-out;-webkit-transform:rotate(0deg);' src='"+window.resUrl+"images/pull-up.png'>"
				+	"<span style='font-size:0.9em;color:#888;'>上拉加载更多</span>"
				+"</div>";
		$(html).appendTo($wrapper);
		$scroller.data("pullUpLoading",options["pullUpLoading"]);
	}
	
	$scroller.data("scrollExBottomHandler",options["scrollExBottomHandler"]);
	$scroller.data("scrollExTopHandler",options["scrollExTopHandler"]);
	
	//$scroller.data("scrollingExBottomHandler",options["scrollingExBottomHandler"]);
	//$scroller.data("scrollingExTopHandler",options["scrollingExTopHandler"]);
	
	$scroller.data("scrollDir",options["dir"]);
	$scroller.data("bounce",options["bounce"]);
	$scroller.data("autoHideScrollBar",options["autoHideScrollBar"]);
	$scroller.data("inertia",options["inertia"]);
	
	$scroller.data("touchStart",options["touchStart"]);
	$scroller.data("touchMove",options["touchMove"]);
	$scroller.data("touchEnd",options["touchEnd"]);
	
	$scroller.data("scrollEnd",options["scrollEnd"]);
}

/* 
 * 滚动到顶部
 * @param wrapper .jszx-wrapper的id
 * @author max
 */
function scrollToTop(wrapper){
	var $wrapper=$("#"+wrapper);
	var $scroller=$wrapper.find("div.jszx-scroller:first");
	
	$scroller[0].style.WebkitTransition="";
	$scroller.data("scrollBar")[0].style.WebkitTransition="";

	$scroller[0].style.webkitTransform="translateY(0px)";
	$scroller.data("scrollBar")[0].style.webkitTransform="translateY(0px)";
}
function scrollToLeft(wrapper){
    var $wrapper=$("#"+wrapper);
    var $scroller=$wrapper.find("div.jszx-scroller:first");
    
    $scroller[0].style.WebkitTransition="";
    $scroller.data("scrollBar")[0].style.WebkitTransition="";

    $scroller[0].style.webkitTransform="translateX(0px)";
    $scroller.data("scrollBar")[0].style.webkitTransform="translateX(0px)";
}
/* 
 * 滚动到底部
 * @param wrapper .jszx-wrapper的id
 * @author max
 */
function scrollToBottom(wrapper){
	var $wrapper=$("#"+wrapper);
	var $scroller=$wrapper.find("div.jszx-scroller:first");
    
	if($wrapper.height()-$scroller.height()>0){
		return;
	}
    
    $scroller[0].style.WebkitTransition="";
    $scroller.data("scrollBar")[0].style.WebkitTransition="";
    
    $scroller[0].style.webkitTransform="translateY("+($wrapper.height()-$scroller.height())+"px)";
    $scroller.data("scrollBar")[0].style.webkitTransform="translateY("+($wrapper.height()-$scroller.data("scrollBar").height())+"px)";
}

/*
 * 滚动到某个DOM节点
 * @param wrapper .jszx-wrapper的id
 * @param target DOM对象
 * @author max
 */
function scrollToTarget(wrapper,target){
    var $wrapper=$("#"+wrapper);
    var $scroller=$wrapper.find("div.jszx-scroller:first");
    
    $scroller[0].style.WebkitTransition="";
    $scroller.data("scrollBar")[0].style.WebkitTransition="";
    
    if($scroller.data("scrollDir")=="x"){
        if($wrapper.width()-$scroller.width()>0)
            return;

        if(target.offsetLeft+$wrapper.width()>$scroller.width())
            $scroller[0].style.webkitTransform="translateX("+("-"+($scroller.width()-$wrapper.width()))+"px)";
        else
            $scroller[0].style.webkitTransform="translateX("+("-"+target.offsetLeft)+"px)";
    }else{
        if($scroller.height()-$wrapper.height()<0)
            return;
        
        if(target.offsetTop+$wrapper.height()>$scroller.height())
            $scroller[0].style.webkitTransform="translateY("+("-"+($scroller.height()-$wrapper.height()))+"px)";
        else
            $scroller[0].style.webkitTransform="translateY("+("-"+target.offsetTop)+"px)";
    }
} 
function scrollByDistance(wrapper,distance){
    var $wrapper=$("#"+wrapper);
    var $scroller=$wrapper.find("div.jszx-scroller:first");
    
    $scroller[0].style.WebkitTransition="";
    $scroller.data("scrollBar")[0].style.WebkitTransition="";
    
    if($scroller.data("scrollDir")=="x"){

    }else{
        if($scroller.height()-$wrapper.height()<0)
            return;
        console.log(distance)
        console.log(getTranslateOffset($scroller[0]))
        console.log("translateY("+(getTranslateOffset($scroller[0])+distance)+"px)")
        $scroller[0].style.webkitTransform="translateY("+(getTranslateOffset($scroller[0])+distance)+"px)";
    }
}
/* 
 * 重设滚动条
 * @param wrapper .jszx-wrapper的id
 * @param isTop 是否需要滑动到顶部
 * @author max
 */
function resetScrollBar(wrapper,isTop){
	var $wrapper=$("#"+wrapper);
	var $scroller=$wrapper.find("div.jszx-scroller:first");
	var $scrollerBar=$scroller.data("scrollBar");
	
	if($scroller.data("scrollDir")=="x"){
	    var wrapperWidth=$wrapper.width();
        var scrollerWidth=$scroller.width();
        var scrollBarWidth=scrollerWidth<=wrapperWidth?0:Math.floor(wrapperWidth*wrapperWidth/scrollerWidth);
        $scrollerBar.width(scrollBarWidth);
	}else{
    	var wrapperHeight=$wrapper.height();
    	var scrollerHeight=$scroller.height();
    	var scrollBarHeight=scrollerHeight<=wrapperHeight?0:Math.floor(wrapperHeight*wrapperHeight/scrollerHeight);
    	$scrollerBar.height(scrollBarHeight);
	}
	
	$scroller[0].style.WebkitTransition="";
	$scrollerBar[0].style.WebkitTransition="";
	
	var dir=$scroller.data("scrollDir");
	var translate="translate"+dir.toUpperCase();
	if(isTop){
	    $scroller[0].style.webkitTransform=translate+"(0px)";
	    $scrollerBar[0].style.webkitTransform=translate+"(0px)";
	}
	else
	    var offset=getTranslateOffset($scroller[0]);
	    $scrollerBar[0].style.webkitTransform=translate+"("+(offset*wrapperHeight/scrollerHeight)+"px)";
}

function getTranslateOffset(element){
	var transform=element.style.WebkitTransform||"";
	var translate=transform.match(/\-?[0-9]+\.?[0-9]*/g)||0;
	return Number(translate);
}

function scrollTS(e){

	var target=e.target;
	var currentTarget=e.currentTarget;
	var $currentTarget=$(currentTarget);
	
	/*
	if(target.tagName.toLocaleLowerCase()=="input" 
	|| target.tagName.toLocaleLowerCase()=="select" 
	|| target.tagName.toLocaleLowerCase()=="textarea")
		return;
	*/
		
	while(target!==currentTarget){
	    if($(target).attr("browserclick"))
	        return;
	    target=target.parentElement;
	}

	currentTarget.addEventListener(MOVE_EV,scrollTM);
	currentTarget.addEventListener(END_EV,scrollTE);
	
	var point=window.supportTouch?e.touches[0]:e;
	$currentTarget.data("startX",point.clientX);
	$currentTarget.data("startY",point.clientY);
	$currentTarget.data("startOffset",getTranslateOffset($currentTarget[0]));
	$currentTarget.data("startTime",new Date());
	$currentTarget.data("direction",null);
}
function scrollTE(e){
	
	var currentTarget=e.currentTarget;
	var $currentTarget=$(currentTarget);
	
	currentTarget.removeEventListener(MOVE_EV,scrollTM);
	currentTarget.removeEventListener(END_EV,scrollTE);
	
	var point=window.supportTouch?e.changedTouches[0]:e;
	var touchStartX=$currentTarget.data("startX");
	var touchStartY=$currentTarget.data("startY");
	var touchStartTime=$currentTarget.data("startTime");
	
	var touchEndOffset=getTranslateOffset(currentTarget);
	var touchEndTime=new Date();
	
	var $scrollBar=$currentTarget.data("scrollBar");
	var scrollDir=$currentTarget.data("scrollDir");
	var dir=$currentTarget.data("direction");
	
	var pullDownLoading=$currentTarget.data("pullDownLoading");
	var pullUpLoading=$currentTarget.data("pullUpLoading");
	var $pullDown=$currentTarget.parent().find(".pull-down");
	var $pullUp=$currentTarget.parent().find(".pull-up");
	
	var touchEndCallback=$currentTarget.data("touchEnd");
	var scrollEndCallback=$currentTarget.data("scrollEnd");
	
	currentTarget.style.WebkitTransition="-webkit-transform 0.2s ease-out";
    $scrollBar[0].style.WebkitTransition="-webkit-transform 0.2s ease-out";
    
    var touchMove,domMoveAvl,barMoveAvl;
    if(scrollDir=="x"){
        touchMove=point.clientX-touchStartX;
        domMoveAvl=$currentTarget.parent().width()-$currentTarget.width();
        barMoveAvl=$currentTarget.parent().width()-$scrollBar.width();
    }else{
        touchMove=point.clientY-touchStartY;
        domMoveAvl=$currentTarget.parent().height()-$currentTarget.height();
        barMoveAvl=$currentTarget.parent().height()-$scrollBar.height();
    }
    
	//click or taphold
	if(dir==null){
		/*
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
		*/
		return;
	}
	
	//x swipe
	/*
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
	*/

    if( (dir=="x" && scrollDir=="x") || (dir=="y" && scrollDir=="y") ){
	
		if(touchEndCallback)
			touchEndCallback(touchEndOffset);
        
        var translate="translate"+dir.toUpperCase();
        
        //弹回
        if(touchEndOffset>0){
            
            if($currentTarget.data("autoHideScrollBar")==true)
                $scrollBar.animate({"opacity":"0"},500);
            
			$scrollBar[0].style.webkitTransform=translate+"(0px)";
			if(pullDownLoading && touchEndOffset>50){
				currentTarget.style.webkitTransform=translate+"(50px)";
				
				$pullDown[0].style.top="0px";
				$pullDown.find("span").text("正在刷新，请稍候...");
				$pullDown.find("img")[0].style.webkitTransform="rotate(0deg)";
				$pullDown.find("img").attr("src",window.resUrl+"images/loading.gif");
				
				pullDownLoading.call(window,function(listReset){
					if(listReset)
						currentTarget.style.webkitTransform=translate+"(0px)";
					
					$pullDown[0].style.top="-50px";
					$pullDown.find("span").text("下拉进行刷新");
					$pullDown.find("img")[0].style.webkitTransform="rotate(0deg)";
					$pullDown.find("img").attr("src",window.resUrl+"images/pull-down.png");
				})
			}else{
				currentTarget.style.webkitTransform=translate+"(0px)";
				
				if(pullDownLoading){
					$pullDown[0].style.top="-50px";
					$pullDown.find("span").text("下拉进行刷新");
					$pullDown.find("img")[0].style.webkitTransform="rotate(0deg)";
				}
			}
			
            return;
        }
    
        //弹回
        if(domMoveAvl>0){
        
            if($currentTarget.data("autoHideScrollBar")==true)
                $scrollBar.animate({"opacity":"0"},500);
				
			if(pullUpLoading && touchEndOffset<-50){
				if(domMoveAvl>50)
					currentTarget.style.webkitTransform=translate+"(0px)";
				else
					currentTarget.style.webkitTransform=translate+"("+(domMoveAvl-50)+"px)";
				
				$pullUp[0].style.bottom="0px";
				$pullUp.find("span").text("正在加载，请稍候...");
				$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
				$pullUp.find("img").attr("src",window.resUrl+"images/loading.gif");
				
				pullUpLoading.call(window,function(listReset){
					if(listReset)
						currentTarget.style.webkitTransform=translate+"(0px)";
					
					$pullUp[0].style.bottom="-50px";
					$pullUp.find("span").text("上拉加载更多");
					$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
					$pullUp.find("img").attr("src",window.resUrl+"images/pull-up.png");
				})
			}else{
				currentTarget.style.webkitTransform=translate+"(0px)";
				$scrollBar[0].style.webkitTransform=translate+"(0px)";
				
				if(pullUpLoading){
					$pullUp[0].style.bottom="-50px";
					$pullUp.find("span").text("上拉加载更多");
					$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
				}
			}
			
            return;
        }
        
        //弹回
        if(touchEndOffset<domMoveAvl){
        
            if($currentTarget.data("autoHideScrollBar")==true)
                $scrollBar.animate({"opacity":"0"},500);
                
			$scrollBar[0].style.webkitTransform=translate+"("+barMoveAvl+"px)";
			if(pullUpLoading && touchEndOffset<domMoveAvl-50){
				currentTarget.style.webkitTransform=translate+"("+(domMoveAvl-50)+"px)";
				
				$pullUp[0].style.bottom="0px";
				$pullUp.find("span").text("正在加载，请稍候...");
				$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
				$pullUp.find("img").attr("src",window.resUrl+"images/loading.gif");
				
				pullUpLoading.call(window,function(listReset){
					if(listReset)
						currentTarget.style.webkitTransform=translate+"("+domMoveAvl+"px)";
					
					$pullUp[0].style.bottom="-50px";
					$pullUp.find("span").text("上拉加载更多");
					$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
					$pullUp.find("img").attr("src",window.resUrl+"images/pull-up.png");
				})
			}else{
				currentTarget.style.webkitTransform=translate+"("+domMoveAvl+"px)";
				
				if(pullUpLoading){
					$pullUp[0].style.bottom="-50px";
					$pullUp.find("span").text("上拉加载更多");
					$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
				}
			}

            return;
        }
        
		if($currentTarget.data("inertia")==false){
		    if(scrollEndCallback)
		        scrollEndCallback(touchEndOffset,$currentTarget);
            return;
        }
		
        var touchInterval=touchEndTime.getTime()-touchStartTime.getTime();
        if(touchInterval<=500){
            var scrollDistance=Math.abs((dir=="x"?800:500)*touchMove*touchMove/touchInterval/touchInterval);
            var endOffset;
            if(touchMove>0){
                if(touchEndOffset+scrollDistance>0)
                    endOffset=0;
                else
                    endOffset=touchEndOffset+scrollDistance;
            }else{
                if(touchEndOffset-scrollDistance<domMoveAvl)
                    endOffset=domMoveAvl;
                else
                    endOffset=touchEndOffset-scrollDistance;
            }
            
            var scrollInterval=Math.abs((endOffset-touchEndOffset)*touchInterval/touchMove)/1000;
            
            currentTarget.style.WebkitTransition="-webkit-transform "+scrollInterval+"s ease-out";
            $scrollBar[0].style.WebkitTransition="-webkit-transform "+scrollInterval+"s ease-out";
            
            var scrollBarEndOffset;
            if(dir=="x")
                scrollBarEndOffset=-endOffset*$currentTarget.parent().width()/$currentTarget.width();
            else
                scrollBarEndOffset=-endOffset*$currentTarget.parent().height()/$currentTarget.height();
            
            currentTarget.style.webkitTransform=translate+"("+endOffset+"px)";
            $scrollBar[0].style.webkitTransform=translate+"("+scrollBarEndOffset+"px)";
            
            if(scrollEndCallback)
                scrollEndCallback(endOffset,$currentTarget);
            
            if($currentTarget.data("autoHideScrollBar")==true){
                setTimeout(function(){
                    $scrollBar.animate({"opacity":"0"},500);
                },scrollInterval)
            }
               
        }else{
            if(scrollEndCallback)
                scrollEndCallback(touchEndOffset,$currentTarget);
            
            if($currentTarget.data("autoHideScrollBar")==true){
                $scrollBar.animate({"opacity":"0"},500);
            }
        }
	    
	}
	
}
function scrollTM(e){
	e.preventDefault();
	
	var currentTarget=e.currentTarget;
	var $currentTarget=$(currentTarget);
	
	var point=window.supportTouch?e.touches[0]:e;
	var touchStartX=$currentTarget.data("startX");
	var touchStartY=$currentTarget.data("startY");
	var touchStartOffset=$currentTarget.data("startOffset");
	var touchStartTime=$currentTarget.data("startTime");
	
	var $scrollBar=$currentTarget.data("scrollBar");
	var scrollDir=$currentTarget.data("scrollDir");
    var bounce=$currentTarget.data("bounce");
	
	var pullDownLoading=$currentTarget.data("pullDownLoading");
	var pullUpLoading=$currentTarget.data("pullUpLoading");
	var $pullDown=$currentTarget.parent().find(".pull-down");
	var $pullUp=$currentTarget.parent().find(".pull-up");
	
	var touchMoveCallback=$currentTarget.data("touchMove");
	
    currentTarget.style.WebkitTransition="";
    $scrollBar[0].style.WebkitTransition="";
	
	var touchMoveX=point.clientX-touchStartX;
	var touchMoveY=point.clientY-touchStartY;
	
	var domMove,barMove,domMoveAvl,barMoveAvl;
	if(scrollDir=="x"){
	    domMove=touchStartOffset+touchMoveX;
        barMove=-domMove*$currentTarget.parent().width()/$currentTarget.width();
        domMoveAvl=$currentTarget.parent().width()-$currentTarget.width();
        barMoveAvl=$currentTarget.parent().width()-$scrollBar.width();
	}else{
	    domMove=touchStartOffset+touchMoveY;
	    barMove=-domMove*$currentTarget.parent().height()/$currentTarget.height();
	    domMoveAvl=$currentTarget.parent().height()-$currentTarget.height();
        barMoveAvl=$currentTarget.parent().height()-$scrollBar.height()-$currentTarget.find(".pull-down").height()-$currentTarget.find(".pull-up").height();
	}

	var dir;
	if(!$currentTarget.data("direction")){
		if(Math.abs(touchMoveX)<5 && Math.abs(touchMoveY)<5)
			return;
		dir=Math.abs(touchMoveX)-Math.abs(touchMoveY);
		if(dir>0)
			$currentTarget.data("direction","x");
		else
			$currentTarget.data("direction","y");
	}
	dir=$currentTarget.data("direction");
	
	if( (dir=="x" && scrollDir=="x") || (dir=="y" && scrollDir=="y") ){
	    
	    var translate="translate"+dir.toUpperCase();
	    
        if($currentTarget.data("autoHideScrollBar")==true)
            $scrollBar[0].style.opacity=0.8;
        
        if(domMove>0 || domMoveAvl>=0){
            domMove=bounce?0:domMove/3;
            barMove=bounce?0:barMove/3;
			
			if(domMove>0 && pullDownLoading){
				$pullDown[0].style.top=(-50+domMove)+"px";
				
				if(domMove>50){
					$pullDown.find("span").text("松开开始刷新");
					$pullDown.find("img")[0].style.webkitTransform="rotate(180deg)";
				}else{
					$pullDown.find("span").text("下拉进行刷新");
					$pullDown.find("img")[0].style.webkitTransform="rotate(0deg)";
				}
			}else if(domMove<0 && pullUpLoading){
				$pullUp[0].style.bottom=(-50-domMove)+"px";
				
				if(-domMove>50){
					$pullUp.find("span").text("松开开始加载");
					$pullUp.find("img")[0].style.webkitTransform="rotate(180deg)";
				}else{
					$pullUp.find("span").text("上拉加载更多");
					$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
				}
			}
        }else if(domMove<domMoveAvl){
            domMove=bounce?domMoveAvl:(domMoveAvl+(domMove-domMoveAvl)/3);
            barMove=bounce?barMoveAvl:(barMoveAvl+(barMove-barMoveAvl)/3);
			
			if(domMove<domMoveAvl && pullUpLoading){
				$pullUp[0].style.bottom=(-50+domMoveAvl-domMove)+"px";
				
				if(domMoveAvl-domMove>50){
					$pullUp.find("span").text("松开开始加载");
					$pullUp.find("img")[0].style.webkitTransform="rotate(180deg)";
				}else{
					$pullUp.find("span").text("上拉加载更多");
					$pullUp.find("img")[0].style.webkitTransform="rotate(0deg)";
				}
			}
        }
        
        currentTarget.style.webkitTransform=translate+"("+domMove+"px)";
        $scrollBar[0].style.webkitTransform=translate+"("+barMove+"px)";
        
        if(touchMoveCallback)
            touchMoveCallback(domMove);
    }
	
	/*
    if(touchStartOffsetY==0){
        var scrollingExTopHandler=$currentTarget.data("scrollingExTopHandler");
        if(scrollingExTopHandler){
            scrollingExTopHandler.call(window,touchMoveY);
        }
    }
    */
	/*
    if(touchStartOffsetY==$currentTarget.parent().height()-$currentTarget.height()){
        var scrollingExBottomHandler=$currentTarget.data("scrollingExBottomHandler");
        if(scrollingExBottomHandler){
            scrollingExBottomHandler.call(window,touchMoveY);
        }
    }
    */
	
	/*
	else{
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
	*/
}

/* 扩展listen方法 */
$.fn.listen=$.fn.addEventListener=function(eventType,handler,args,tscallback,tecallback){
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
$.fn.unListen=$.fn.removeEventListener=function(eventType){
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
	var startTime=$(e.currentTarget).data("startTime");
	var endTime=new Date();
	var point=window.supportTouch?e.changedTouches[0]:e;
	
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

function initSwipe(seletor,callback){
    $(seletor)[0].addEventListener(START_EV,swipeTS);
    $(seletor).data("callback",callback);
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
$.fn.swipeLeft=function(callback){
    var that=this;
    that[0].addEventListener(START_EV,swipeTS);
    that.data("swipeleft",callback);
    that.data("callback",function(sx,sy,x,y,st,et){
        if(x-sx<-20 && Math.abs(x-sx)>Math.abs(y-sy))
            callback();
        if(that.data("swiperight")){
            if(x-sx>20 && Math.abs(x-sx)>Math.abs(y-sy))
                that.data("swiperight").call();
        }
    });
}
$.fn.swipeRight=function(callback){
    var that=this;
    that[0].addEventListener(START_EV,swipeTS);
    that.data("swiperight",callback);
    that.data("callback",function(sx,sy,x,y,st,et){
        if(x-sx>20 && Math.abs(x-sx)>Math.abs(y-sy))
            callback();
        if(that.data("swipeleft")){
            if(x-sx<-20 && Math.abs(x-sx)>Math.abs(y-sy))
                that.data("swipeleft").call();
        }
    });
}

/*
 * 扩展dragable方法 使DOM可拖动
 * @param options.bounce 是否可以将元素拖出边界
 */
$.fn.dragable=function(options){
	var dragStart=function(e){
		//e.preventDefault();
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
		
		var left=startOffsetLeft+point.clientX-startX;
		var top=startOffsetTop+point.clientY-startY;
		if(options && options.bounce){
			if(left<0)
				left=0;
			if(top<0)
				top=0;
			if(left>e.currentTarget.parentElement.clientWidth-e.currentTarget.clientWidth)
				left=e.currentTarget.parentElement.clientWidth-e.currentTarget.clientWidth;
			if(top>e.currentTarget.parentElement.clientHeight-e.currentTarget.clientHeight)
			    top=e.currentTarget.parentElement.clientHeight-e.currentTarget.clientHeight;
		}
		
		$thisDom.css({"left":left});
		$thisDom.css({"top":top})
		
		if(options && options.onDragMove){
			options.onDragMove(e.currentTarget.offsetLeft,e.currentTarget.offsetTop);
		}
	};
	var dragEnd=function(e){
		//e.preventDefault();
		e.currentTarget.removeEventListener(MOVE_EV,dragMove);
		e.currentTarget.removeEventListener(END_EV,dragEnd);
		
		if(options && options.onDragEnd){
			options.onDragEnd(e.currentTarget.offsetLeft,e.currentTarget.offsetTop);
		}
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

function initDataBase(dbName,schemaObjects,version,description,size){
    var db=openDatabase(dbName||"mydb",version||"1.0",description||"",size||2*1024*1024);
    
    db.execSQL=function(sql,params,success,error){
        this.transaction(function(tx){
            tx.executeSql(sql,params,function(tx,results){
                var objects=[];
                for(var i=0;i<results.rows.length;i++){
                    objects.push(results.rows.item(i));
                }
                if(success) success.call(window,objects);
            },function(tx,err){
                if(error) error.call();
            });
        });
    }
    
    for(var name in schemaObjects){
        var schemaObj=schemaObjects[name];
        
		if(window.localStorage[name+"@"+dbName]){
			var sql;
			for(var property in schemaObj){
				if(!window.localStorage[name+"@"+dbName].match(property)){
					sql="alter table "+name+" add column "+property;
					db.execSQL(sql);
					window.localStorage[name+"@"+dbName]+=","+property;
				}
			}
		}else{
			var sql,temp="localID";
			for(var property in schemaObj){
				temp=temp+","+property;
			}
			sql="create table "+name+"("+temp+")";
			db.execSQL(sql);
			window.localStorage[name+"@"+dbName]=temp;
		}
    }
    
    db.match=function(obj){
        for(var name in schemaObjects){
            var schemaObj=schemaObjects[name];
            
            var isMatch=true;
            for(var property in schemaObj){
                if(obj[property]===undefined){
                    isMatch=false;
                    break;
                }
            }
            
            if(isMatch)
                return name;
        }
    }
    db.insert=function(obj,success,error){
        var tableName=this.match(obj);
        var temp="localID";
        var tempSymbol="?";
        var tempValues=[getUniqueInteger()];
        for(var name in schemaObjects[tableName]){
            temp+=","+name;
            tempSymbol+=",?";
            tempValues.push(obj[name]);
        }
        var sql="insert into "+tableName+" ("+temp+") values ("+tempSymbol+")";
        db.execSQL(sql,tempValues,success,error);
    }
    db.update=function(obj,success,error){
        var tableName=this.match(obj);
        var temp="";
        var tempValues=[];
        for(var name in schemaObjects[tableName]){
            if(name==="localID")
                continue;
            temp+=", "+name+"=?";
            tempValues.push(obj[name]);
        }
        var sql="update "+tableName+" set "+temp.substring(2)+" where localID="+obj.localID;
        db.execSQL(sql,tempValues,success,error);
    }
    db.remove=function(obj,success,error){
        var tableName=this.match(obj);
        var sql="delete from "+tableName+" where localID="+obj.localID;
        db.execSQL(sql,null,success,error);
    }
    db.query=function(objName,success,error){
        var sql="select * from "+objName;
        db.execSQL(sql,null,success,error);
    }

    return db;
}

function getUniqueInteger(){
    var dt=new Date();
    return dt.getTime()+Math.floor(Math.random()*1000);
}

(function(){
	window.showAlert=function(content,title,btn,btnFunction){
			
		var html="<div class='max-dialog max-alert'>"
				+	"<div class='max-dialog-masker'></div>"
				+	"<div class='max-dialog-frame'>"
				+		"<div class='max-dialog-title'>"+(title||"提示")+"</div>"
				+		"<div class='max-dialog-content'>"
				+			"<div class='max-dialog-text'>"+(content||"")+"</div>"
				+			"<div class='max-dialog-btn-group'>"
				+				"<span class='max-dialog-btn max-confirm-button'>"+(btn||"确认")+"</span>"
				+			"</div>"
				+		"</div>"
				+	"</div>"
				+"</div>";
		var $alert=$(html).appendTo(".ui-page-active");

		$alert.find(".max-confirm-button").bind("click",function(){
			if(btnFunction) {
				var result=btnFunction();
				if(result===false)
					return;
			}
			$(".max-alert").remove();
		});
	}
	window.hideAlert=function(){
	    $(".max-alert").remove();
	}
	
	window.showConfirm=function(content,title,btn1,btnFunction1,btn2,btnFunction2){
		var html="<div class='max-dialog max-confirm'>"
				+	"<div class='max-dialog-masker'></div>"
				+	"<div class='max-dialog-frame'>"
				+		"<div class='max-dialog-title'>"+(title||"确认")+"</div>"
				+		"<div class='max-dialog-content'>"
				+			"<div class='max-dialog-text'>"+(content||"")+"</div>"
				+			"<div class='max-dialog-btn-group'>"
				+				"<span class='max-dialog-btn max-confirm-button'>"+(btn1||"确认")+"</span>"
				+				"<span class='max-dialog-btn max-cancel-button'>"+(btn2||"取消")+"</span>"
				+			"</div>"
				+		"</div>"
				+	"</div>"
				+"</div>";
		var $confirm=$(html).appendTo(".ui-page-active");

		$confirm.find(".max-confirm-button").bind("click",function(){
			if(btnFunction1) {
				var result=btnFunction1();
				if(result===false)
					return;
			}
			$(".max-confirm").remove();
		});
		$confirm.find(".max-cancel-button").bind("click",function(){
			if(btnFunction2) {
				var result=btnFunction2();
				if(result===false)
					return;
			}
			$(".max-confirm").remove();
		});
	}
	window.hideConfirm=function(){
	    $(".max-confirm").remove();
	}
	
	window.showConfirm2=function(content,btn1,btnFunction1,btn2,btnFunction2){
        var html="<div class='max-dialog max-confirm2'>"
                +   "<div class='max-dialog-masker'></div>"
                +   "<div class='max-dialog-frame'>"
                +       "<div class='max-dialog-content'>"
                +           "<div class='max-dialog-text'>"+(content||"")+"</div>"
                +           "<div class='max-confirm-button2'>"+(btn1||"确认")+"</div>"
                +       "</div>"
                +       "<div class='max-dialog-content'>"
                +           "<div class='max-cancel-button2'>"+(btn2||"取消")+"</div>"
                +       "</div>"
                +   "</div>"
                +"</div>";
        var $confirm=$(html).appendTo(".ui-page-active");

        $confirm.find(".max-confirm-button2").bind("click",function(){
			if(btnFunction1) {
				var result=btnFunction1();
				if(result===false)
					return;
			}
			$(".max-confirm2").remove();
        });
        $confirm.find(".max-cancel-button2").bind("click",function(){
			if(btnFunction2) {
				var result=btnFunction2();
				if(result===false)
					return;
			}
			$(".max-confirm2").remove();
        });
    }
    window.hideConfirm2=function(){
        $(".max-confirm2").remove();
    }
	
	window.showLoading=function(text,timer,callback,img){
	    var src;
	    if(img && typeof img=="string")
	        src=img;
	    else
	        src=window.resUrl+"images/loading.gif";

        var html="<div class='max-dialog max-loading'>"
                +   "<div class='max-dialog-masker'></div>"
                +   "<div class='max-dialog-frame'>"
                +       "<img src='"+src+"'>"
                +       "<span>"+(text||"正在加载...")+"</span>"
                +   "</div>"
                +"</div>";
        var $loading=$(html).appendTo(".ui-page-active");
        
        if(timer){
            setTimeout(function(){
                hideLoading();
                if(callback) callback();
            },timer);
        }
        
        if(img && typeof img=="boolean"){
            $loading.find("img").hide();
            $loading.find("span").css({"top":0,"line-height":"38px"});
        }
    }
	window.hideLoading=function(){
	    $(".max-loading").remove();
    }
	
	window.toast=function(title,timer,callback){
	    window.showLoading(title,timer||2000,callback,true);
	}
})();

function Slider(option){
    var $wrapper=$("#"+option.id).addClass("jszx-wrapper");
    var $scroller=$("<div class='jszx-scroller'></div>").appendTo($wrapper);
    var $slides=$wrapper.find(".slide").appendTo($scroller);
    
    $slides.width(window.innerWidth);
    $scroller.width(window.innerWidth*$slides.length);
    
    var offset=0;
    var index=0;
    initScroll({
        "wrapper": option.id,
        "dir": "x",
        "bounce": true,
        "scrollBar": false,
        "inertia": false,
        "touchEnd": function(x){

            if(x-offset<=-50){
                offset=offset-window.innerWidth;
                index++;
            }else if(x-offset>=50){
                offset=offset+window.innerWidth;
                index--;
            }

            $scroller[0].style.webkitTransform="translateX("+offset+"px)";
            
            option.onSlide(index);
        }
    });
    
    this.length=$slides.length;
    this.$scroller=$scroller;
}
Slider.prototype.slideTo=function(index){
    if(index<0 || index>this.length-1)
        return;
    this.$scroller[0].style.webkitTransform="translateX("+(-window.innerWidth*index)+"px)";
}

/* 压缩图片 */
function compressImage(filePath,type,pixel,success){
    var pre="";
    if(type=="png")
        pre="data:image/png;base64,";
    if(type=="jpg" || type=="jpeg")
        pre="data:image/jpeg;base64,";
    
    if(typeof pixel=="function"){
        success=pixel;
        pixel=1280;
    }
    
    var image=new Image();
    image.src=pre+filePath;
    image.onload=function(){
        
        var oriPicWidth=image.width;
        var oriPicHeight=image.height;
        
        var newPicWidth,newPicHeight;
        if(oriPicWidth<=pixel && oriPicHeight<=pixel){
            success(pre+filePath);
            return;
            newPicWidth=oriPicWidth;
            newPicHeight=oriPicHeight;
        }else{
            if(oriPicWidth>oriPicHeight){
                newPicWidth=pixel;
                newPicHeight=Math.floor(newPicWidth*oriPicHeight/oriPicWidth);
            }else{
                newPicHeight=pixel;
                newPicWidth=Math.floor(newPicHeight*oriPicWidth/oriPicHeight);
            }
        }
        
        var $canvas=$("<canvas width='"+newPicWidth+"' height='"+newPicHeight+"' style='position:absolute;z-index:-10;opacity:0;top:0;left:0;'></canvas>").appendTo("body");
        var canvas=$canvas[0];
        var ctx=canvas.getContext("2d");
        ctx.drawImage(image,0,0,newPicWidth,newPicHeight);
        
        var base64Str=canvas.toDataURL("image/jpeg");
        $canvas.remove();
        success(base64Str);
    }
}
/* 裁剪图片 */
function cutImage(filePath,type,coordinate,success){
    var pre="";
    if(type=="png")
        pre="data:image/png;base64,";
    if(type=="jpg" || type=="jpeg")
        pre="data:image/jpeg;base64,";
    
    var image=new Image();
    image.src=pre+filePath;
    image.onload=function(){
        
        var oriPicWidth=image.width;
        var oriPicHeight=image.height;
        
        var $canvas=$("<canvas width='"+oriPicWidth+"' height='"+oriPicHeight+"' style='position:absolute;z-index:-10;opacity:0;top:0;left:0;'></canvas>").appendTo("body");
        var canvas=$canvas[0];
        var ctx=canvas.getContext("2d");
        ctx.drawImage(image,0,0,oriPicWidth,oriPicHeight);
        var data=ctx.getImageData(coordinate.x,coordinate.y,coordinate.w,coordinate.h);
        
        var $canvas2=$("<canvas width='"+coordinate.w+"' height='"+coordinate.h+"' style='position:absolute;z-index:-10;opacity:0;top:0;left:0;'></canvas>").appendTo("body");
        var canvas2=$canvas2[0];
        var ctx2=canvas2.getContext("2d");
        ctx2.putImageData(data,0,0);
        
        var base64Str=canvas2.toDataURL("image/jpeg");
        $canvas.remove();
        $canvas2.remove();
        success(base64Str);
    } 
}

/* 扩展String对象 */
String.prototype.trimLeft=function(){
    return this.replace(/^\s*/,"");
}
String.prototype.trimRight=function(){
    return this.replace(/\s*$/,"");
}
String.prototype.trim=function(){
    return this.trimLeft().trimRight();
}
String.prototype.simple=function(num){
    num=num||15;
    if(this.length<=num)
        return this;
    else
        return this.substring(0,num)+"...";
}

/* webservice */
function webservice(success,error,options){

	var paramsXML=convertObjectToXML(options.params);
	
	if(options.version=="110" || options.version=="1.1"){
		var soapContent='<?xml version="1.0" encoding="utf-8"?>'
					   +'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
					   +	'<soap:Body>'
					   +		'<'+options.methodName+' xmlns="'+options.namespace+'">'
					   +			paramsXML
					   +		'</'+options.methodName+'>'
					   +	'</soap:Body>'
					   +'</soap:Envelope>';
		var contentType="text/xml; charset=utf-8";
	}
	else if(options.version=="120" || options.version=="1.2"){
		var soapContent='<?xml version="1.0" encoding="utf-8"?>'
					   +'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'
					   +	'<soap12:Body>'
					   +		'<'+options.methodName+' xmlns="'+options.namespace+'">'
					   +			paramsXML
					   +		'</'+options.methodName+'>'
					   +	'</soap12:Body>'
					   +'</soap12:Envelope>';
		var contentType="application/soap+xml; charset=utf-8";
	}
	
	$.ajax({
		url: options.serviceUrl,
		type: "POST",
		dataType: "text",
		contentType: contentType,
		data: soapContent,
		success: success,
		error: error
	});
	
	return false;
}
function convertObjectToXML(obj,ns){
	var str="";
	ns=ns||"";
	for(var name in obj){
		if(typeof obj[name]=="string")
			str+="<"+ns+":"+name+">"+handleXMLString(obj[name])+"</"+ns+":"+name+">";
			
		else if(typeof obj[name]=="number" || typeof obj[name]=="boolean")
			str+="<"+ns+":"+name+">"+obj[name]+"</"+ns+":"+name+">";
			
		else if(typeof obj[name]=="undefined")
			str+="<"+ns+":"+name+"></"+ns+":"+name+">";
			
		else if(typeof obj[name]=="object" && obj[name].constructor==Array)
			str+=convertArrayToXML(name,obj[name]);
			
		else if(typeof obj[name]=="object")
			str+=convertObjectToXML(obj);
	}
	
	return str;
}
function convertArrayToXML(name,array,ns){
	var str="";
	ns=ns||"";
	for(var i=0;i<array.length;i++){
		if(typeof array[i]=="string")
			str+="<"+ns+":"+name+">"+handleXMLString(array[i])+"</"+ns+":"+name+">";
			
		else if(typeof array[i]=="number" || typeof array[i]=="boolean")
			str+="<"+ns+":"+name+">"+array[i]+"</"+ns+":"+name+">";
			
		else if(typeof array[i]=="object" && array[i].constructor!=Array)
			str+="<"+ns+":"+name+">"+convertObjectToXML(array[i])+"</"+ns+":"+name+">";
	}
	
	return str;
}
function handleXMLString(str){
	return str.replace(/&/g,"&amp;")
			  .replace(/</g,"&lt;")
			  .replace(/>/g,"&gt;")
			  .replace(/"/g,"&quot;")
			  .replace(/'/g,"&apos;");
}
document.addEventListener("deviceready",function(){
	if(jsict.ws){
		jsict.ws.call=function(success,error,option){
			if(option.nameSpace)
				option.namespace=option.nameSpace;
			if(option.ver)
				option.version=option.ver;
			
			webservice(success,error,option);
		}
	}
},false);

(function(){
	var attrs=["src","name","href"];
	for(var i=0;i<attrs.length;i++){
		$.fn[attrs[i]]=function(attr){
			return function(value){
				this.attr(attr,value);
			}
		}(attrs[i]);
	}
})();