/**
 * @param options 参数选项
 * @param options.id 图册容器id，必须
 * @param options.pics 图片URL的数组，必须
 * @param options.markers 标识URL的数组，元素0为非当前图片标识，元素1为当前图片标识
 * @param options.text 图片对应文字数组
 * @param options.width 图册的宽度，默认为window.innerWidth
 * @param options.height 图册的高度，默认为window.innerWidth*9/16
 * @param options.stretch 是否拉伸图片以适应宽和高，默认拉伸图片，设置成false可以阻止拉伸
 * @param options.timer 图片自动切换的时间间隔，默认为5000毫秒
 * @param options.onClick 图片的点击事件响应函数
 * @param options.onChange 图片切换时响应函数
 * @param options.autoSlide 是否自动切换图片,默认自动切换，设置成false可以阻止自动切换
 * @param options.thumbnail 是否有缩略图，默认无缩略图
 * @param options.thumbnailCount 缩略图数量
 * @param options.thumbnailControl 缩略图控制器图片URL的数组，元素0为激活状态图片，元素1为非激活状态图片
 * @param options.loop 是否循环播放
 */
function DynamicPic(options){
	var that=this;
	this.options=options;
	
	this.dpWrapper=$("#"+options.id);
	this.dpWrapper.css({"position":"relative"});
	this.dpWrapper.empty();
	this.dpWrapper.append("<div class='jszx-dp'></div>").append("<div class='jszx-dp-markers'></div>");
	
	var dpWidth=options.width||widnow.innerWidth;
	var dpHeight=options.height||(widnow.innerWidth*9/16);

	this.dpWrapper.find(".jszx-dp").width(dpWidth).height(dpHeight);
	
	if(options.text){
		this.dpWrapper.append("<div class='jszx-dp-text'></div>");
		this.dpWrapper.find(".jszx-dp-markers").width(dpWidth-this.dpWrapper.find(".jszx-dp-text").width());
	}
	
	if(options.thumbnail){
		this.dpWrapper.find(".jszx-dp-markers").hide();
		
		var thumbnailCount=options.thumbnailCount||4;
		
		var html="<div class='jszx-dp-thumbnail' rightThumb='"+((options.pics.length>thumbnailCount)?(options.pics.length-thumbnailCount):"0")+"'>"
				+	"<img src='"+options.thumbnailControl[1]+"' class='thumbControl left' style='-webkit-transform:rotate(180deg);'>"
				+	"<div style='display:inline-block;'><div id='"+options.id+"Wrapper' class='jszx-wrapper'><div id='"+options.id+"Scroller' class='jszx-scroller'>"
				+	"</div></div></div>"
				+	"<img src='"+options.thumbnailControl[((options.pics.length>thumbnailCount)?"0":"1")]+"' class='thumbControl right'>"
				+"</div>";
		this.dpWrapper.append(html);
		
		var thumbnailWrapperWidth=dpWidth-this.dpWrapper.find(".jszx-dp-thumbnail img.thumbControl").width()*2;
		var thumbnailWidth=thumbnailWrapperWidth/thumbnailCount-8;
		var thumbnailHeight=thumbnailWidth*(dpHeight/dpWidth);
		
		this.dpWrapper.find(".jszx-dp-thumbnail").width(dpWidth).height(thumbnailHeight);
		
		this.dpWrapper.find(".jszx-wrapper").width(thumbnailWrapperWidth);
		this.dpWrapper.find(".jszx-scroller").width(thumbnailWrapperWidth/thumbnailCount*options.pics.length);
		//initScroll({"wrapper": options.id+"Wrapper","dir": "x"});
		
		var leftControl=this.dpWrapper.find(".jszx-dp-thumbnail img.thumbControl.left");
		var rightControl=this.dpWrapper.find(".jszx-dp-thumbnail img.thumbControl.right");
		leftControl.addEventListener("quickClick",function(){
			var rightThumb=Number(that.dpWrapper.find(".jszx-dp-thumbnail").attr("rightThumb"));
			
			if(rightThumb>=options.pics.length-thumbnailCount)
				return;
			
			var dpThumbScroller=that.dpWrapper.find(".jszx-scroller");
			dpThumbScroller.css("left",dpThumbScroller[0].offsetLeft+thumbnailWrapperWidth/thumbnailCount+"px");
			
			that.dpWrapper.find(".jszx-dp-thumbnail").attr("rightThumb",rightThumb+1);
			
			if(rightThumb==0)
				rightControl.attr("src",options.thumbnailControl[0]);
			if(rightThumb+1==options.pics.length-thumbnailCount)
				leftControl.attr("src",options.thumbnailControl[1]);
			
		});
		rightControl.addEventListener("quickClick",function(){
			var rightThumb=Number(that.dpWrapper.find(".jszx-dp-thumbnail").attr("rightThumb"));
			
			if(rightThumb==0)
				return;
			
			var dpThumbScroller=that.dpWrapper.find(".jszx-scroller");
			dpThumbScroller.css("left",dpThumbScroller[0].offsetLeft-thumbnailWrapperWidth/thumbnailCount+"px");
			
			that.dpWrapper.find(".jszx-dp-thumbnail").attr("rightThumb",rightThumb-1);
			
			if(rightThumb-1==0)
				rightControl.attr("src",options.thumbnailControl[1]);
			if(rightThumb==options.pics.length-thumbnailCount)
				leftControl.attr("src",options.thumbnailControl[0]);
			
		});
	}
    
    this.jszxDpImgLeft={
        left:"-100%"
    }
    this.jszxDpImgMiddle={
        left:"0%"
    }
    this.jszxDpImgRight={
        left:"100%"
    }
    
    this.dp=this.dpWrapper.find(".jszx-dp");
    this.dpMarkers=this.dpWrapper.find(".jszx-dp-markers");
	this.dpText=this.dpWrapper.find(".jszx-dp-text");
	this.dpThumbnail=this.dpWrapper.find(".jszx-dp-thumbnail");
	this.dpThumbnailWrapper=this.dpWrapper.find(".jszx-wrapper");
	this.dpThumbnailScroller=this.dpWrapper.find(".jszx-scroller");
    
    this.dp[0].addEventListener(START_EV,function(e){
        e.stopPropagation();
    });
    
    if(options.pics.length==0){
        console.error("图片数量不能为0");
        return;
    }
    if(options.pics.length==1){
		if(options.stretch==false){
			var $img=$("<div class='jszx-dp-img' style='text-align:center;'><img src='"+options.pics[0]+"' style='height:100%;'></div>").css(this.jszxDpImgMiddle).appendTo(this.dp);
		}else{
			var $img=$("<img src='"+options.pics[0]+"' class='jszx-dp-img'>").css(this.jszxDpImgMiddle).appendTo(this.dp);
		}
		$img.addEventListener("quickClick",function(){
			options.onClick(0);
		});
        return;
    }
    
    this.dpImgMark=0;
    this.dpImgs=[];
    this.dpMarkerImgs=[];
    
    this.showMarker=options.markers?options.markers[1]:"";
    this.hideMarker=options.markers?options.markers[0]:"";
    
    for(var i=0;i<options.pics.length;i++){
        var $img, $thumbnail;
        if(i==this.dpImgMark){
			if(options.stretch==false){
				$img=$("<div class='jszx-dp-img' style='text-align:center;'><img src='"+options.pics[i]+"' style='height:100%;'></div>").css(this.jszxDpImgMiddle).appendTo(this.dp);
			}else{
				$img=$("<img src='"+options.pics[i]+"' class='jszx-dp-img'>").css(this.jszxDpImgMiddle).appendTo(this.dp);
			}
            this.dpImgs.push($img);
            this.dpMarkerImgs.push($("<img src='"+this.showMarker+"'>").appendTo(this.dpMarkers));
			
			if(options.text)
				this.dpText.html(options.text[i])
				
			if(options.thumbnail)
				$thumbnail=$("<img src='"+options.pics[i]+"' class='thumbnail active'>").appendTo(this.dpThumbnailScroller);
        }else{
			if(options.stretch==false){
				$img=$("<div class='jszx-dp-img' style='text-align:center;'><img src='"+options.pics[i]+"' style='height:100%;'></div>").css(this.jszxDpImgRight).appendTo(this.dp);
			}else{
				$img=$("<img src='"+options.pics[i]+"' class='jszx-dp-img'>").css(this.jszxDpImgRight).appendTo(this.dp);
			}
            this.dpImgs.push($img);
            this.dpMarkerImgs.push($("<img src='"+this.hideMarker+"'>").appendTo(this.dpMarkers));
			
			if(options.thumbnail)
				$thumbnail=$("<img src='"+options.pics[i]+"' class='thumbnail'>").appendTo(this.dpThumbnailScroller);
        }

        $img.addEventListener("quickClick",function(index){
			return function(){
				if(options.onClick)
					options.onClick.call(window,index);
			}
		}(i));
		
		if(options.thumbnail){
			$thumbnail.width(thumbnailWidth).height(thumbnailHeight);
			
			$thumbnail.addEventListener("quickClick",function(index){
				return function(){
					if(index==that.dpImgMark)
						return;
					if(index>that.dpImgMark){
						that.forward(index-that.dpImgMark);
					}
					if(index<that.dpImgMark){
						that.back(that.dpImgMark-index);
					}
				}
			}(i));
		}
    }
	
	if(options.autoSlide!=false)
		this.dpTimer=setInterval($.proxy(this._playPic,this),options.timer||5000);
	
	if(options.onChange)
		options.onChange(this.dpImgMark);
    
    this.dp.bind("swipeleft",{direction:"forward"},$.proxy(this._playPic,this));
    this.dp.bind("swiperight",{direction:"back"},$.proxy(this._playPic,this));
}
DynamicPic.prototype.forward=function(step){
	var event={};
	event.data={};
	event.data.direction="forward";
	event.data.step=step;
	this._playPic(event);
}
DynamicPic.prototype.back=function(step){
	var event={};
	event.data={};
	event.data.direction="back";
	event.data.step=step;
	this._playPic(event);
}
DynamicPic.prototype._playPic=function(event){

    if(event && event.data && event.data.direction){
		if(this.options.autoSlide!=false)
			clearInterval(this.dpTimer);
        
        if(event.data.direction=="back"){
			if(this.options.loop==false && this.dpImgMark==0)
				return;
				
			var preImg;
			if(event.data.step){
				var actualSetp=event.data.step%this.dpImgs.length;
				preImg=(this.dpImgMark-actualSetp)<0?this.dpImgs.length-(actualSetp-this.dpImgMark):this.dpImgMark-actualSetp;
			}else
				preImg=(this.dpImgMark-1)<0?this.dpImgs.length-1:this.dpImgMark-1;
            
            this.dpImgs[preImg].css(this.jszxDpImgLeft);
            this.dpImgs[this.dpImgMark].animate(this.jszxDpImgRight,500);
            this.dpImgs[preImg].animate(this.jszxDpImgMiddle,500);
            
            this.dpMarkerImgs[this.dpImgMark][0].src=this.hideMarker;
            this.dpMarkerImgs[preImg][0].src=this.showMarker;
            
            this.dpImgMark=preImg;
        }else{
			if(this.options.loop==false && this.dpImgMark==this.dpImgs.length-1)
				return;
		
			var nextImg;
			if(event.data.step){
				nextImg=(this.dpImgMark+event.data.step)%this.dpImgs.length;
			}else
				nextImg=(this.dpImgMark+1)%this.dpImgs.length;
			
            this.dpImgs[this.dpImgMark].animate(this.jszxDpImgLeft,500,$.proxy(function(mark){
                return function(){
                    this.dpImgs[mark].css(this.jszxDpImgRight);
                }
            }(this.dpImgMark),this));
            this.dpImgs[nextImg].animate(this.jszxDpImgMiddle,500);
            
            this.dpMarkerImgs[this.dpImgMark][0].src=this.hideMarker;
            this.dpMarkerImgs[nextImg][0].src=this.showMarker;
            
            this.dpImgMark=nextImg;
        }
		
		if(this.options.text)
			this.dpText.html(this.options.text[this.dpImgMark])
				
		if(this.options.onChange)
			this.options.onChange(this.dpImgMark);
        
		if(this.options.autoSlide!=false)
			this.dpTimer=setInterval($.proxy(this._playPic,this),this.options.timer||5000);
			
		if(this.options.thumbnail){
			this.dpThumbnailScroller.find("img.active").removeClass("active");
			this.dpThumbnailScroller.find("img:eq("+this.dpImgMark+")").addClass("active");
		}
        return;
    }
	
    if(!this.dp.closest("div[data-role=page]").hasClass("ui-page-active"))
        return;
    
	if(this.options.loop==false && this.dpImgMark==this.dpImgs.length-1)
		return;
		
	var nextImg=(this.dpImgMark+1)%this.dpImgs.length;
    this.dpImgs[this.dpImgMark].animate(this.jszxDpImgLeft,500,$.proxy(function(mark){
        return function(){
            this.dpImgs[mark].css(this.jszxDpImgRight);
        }
    }(this.dpImgMark),this));
    this.dpImgs[nextImg].animate(this.jszxDpImgMiddle,500);
    
    this.dpMarkerImgs[this.dpImgMark][0].src=this.hideMarker;
    this.dpMarkerImgs[nextImg][0].src=this.showMarker;
    
    this.dpImgMark=nextImg;
	
	if(this.options.text)
		this.dpText.html(this.options.text[this.dpImgMark])
			
	if(this.options.onChange)
		this.options.onChange(this.dpImgMark);
	
	if(this.options.thumbnail){
		this.dpThumbnailScroller.find("img.active").removeClass("active");
		this.dpThumbnailScroller.find("img:eq("+this.dpImgMark+")").addClass("active");
	}
}