/* 修改日志
 * 2013.5.13 添加onChange参数
 * 2013.5.13 添加text参数
 */
 
/**
 * @param options 参数选项
 * @param options.id 图册容器id，必须
 * @param options.pics 图片URL的数组，必须
 * @param options.markers 标识URL的数组，元素0为非当前图片标识，元素1为当前图片标识，默认URL为"images/d_gray.png"和"images/d_green.png"
 * @param options.text 图片对应文字数组
 * @param options.width 图册的宽度，默认为window.innerWidth
 * @param options.height 图册的高度，默认为window.innerWidth*9/16
 * @param options.timer 图片自动切换的时间间隔，默认为5000毫秒
 * @param options.onClick 图片的点击事件响应函数
 * @param options.onChange 图片切换时响应函数
 */
function DynamicPic(options){
	this.options=options;
	
	this.dpWrapper=$("#"+options.id);
    this.dpWrapper.css({"position":"relative"});
    this.dpWrapper.width(options.width||widnow.innerWidth).height(options.height||(widnow.innerWidth*9/16));
	this.dpWrapper.append("<div class='jszx-dp'></div>").append("<div class='jszx-dp-markers'></div>");
	if(options.text){
		this.dpWrapper.append("<div class='jszx-dp-text'></div>");
		this.dpWrapper.find(".jszx-dp-markers").width(this.dpWrapper.width()-this.dpWrapper.find(".jszx-dp-text").width());
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
    
    this.dp=this.dpWrapper.find(".jszx-dp").empty();
    this.dpMarkers=this.dpWrapper.find(".jszx-dp-markers").empty();
	this.dpText=this.dpWrapper.find(".jszx-dp-text").empty();
    
    this.dp[0].removeEventListener(START_EV);
    this.dp[0].addEventListener(START_EV,function(e){
        e.stopPropagation();
    });
    
    if(options.pics.length==0){
        console.error("图片数量不能为0");
        return;
    }
    if(options.pics.length==1){
    	var $img=$("<img src='"+options.pics[0]+"' class='jszx-dp-img'>").css(this.jszxDpImgMiddle).appendTo(this.dp);
		$img.addEventListener("quickClick",function(){
			options.onClick.call(window,0);
		});
        return;
    }
    
    this.dpImgMark=0;
    this.dpImgs=[];
    this.dpMarkerImgs=[];
    
    this.showMarker=options.markers?options.markers[1]:"images/d_green.png";
    this.hideMarker=options.markers?options.markers[0]:"images/d_gray.png";
    
    for(var i=0;i<options.pics.length;i++){
        var $img;
        if(i==this.dpImgMark){
        	$img=$("<img src='"+options.pics[i]+"' class='jszx-dp-img'>").css(this.jszxDpImgMiddle).appendTo(this.dp);
            this.dpImgs.push($img);
            this.dpMarkerImgs.push($("<img src='"+this.showMarker+"'>").appendTo(this.dpMarkers));
			
			if(options.text)
				this.dpText.text(options.text[i])
        }else{
        	$img=$("<img src='"+options.pics[i]+"' class='jszx-dp-img'>").css(this.jszxDpImgRight).appendTo(this.dp);
            this.dpImgs.push($img);
            this.dpMarkerImgs.push($("<img src='"+this.hideMarker+"'>").appendTo(this.dpMarkers));
        }
			
        $img.addEventListener("quickClick",function(index){
			return function(){
				if(options.onClick)
					options.onClick.call(window,index);
			}
		}(i));
    }
	
    if(this.dpTimer)
        clearInterval(this.dpTimer);
    this.dpTimer=setInterval($.proxy(this.playPic,this),options.timer||5000);
	
	if(this.options.onChange)
		this.options.onChange.call(window,this.dpImgMark);
    
    this.dp.bind("swipeleft",{direction:"forward"},$.proxy(this.playPic,this));
    this.dp.bind("swiperight",{direction:"back"},$.proxy(this.playPic,this));
}
DynamicPic.prototype.playPic=function(event){
	
	
    if(event && event.data && event.data.direction){
        clearInterval(this.dpTimer);
        
        if(event.data.direction=="back"){
            var preImg=(this.dpImgMark-1)<0?this.dpImgs.length-1:this.dpImgMark-1;
            
            this.dpImgs[preImg].css(this.jszxDpImgLeft);
            this.dpImgs[this.dpImgMark].animate(this.jszxDpImgRight,500);
            this.dpImgs[preImg].animate(this.jszxDpImgMiddle,500);
            
            this.dpMarkerImgs[this.dpImgMark][0].src=this.hideMarker;
            this.dpMarkerImgs[preImg][0].src=this.showMarker;
            
            this.dpImgMark=preImg;
        }else{
            this.dpImgs[this.dpImgMark].animate(this.jszxDpImgLeft,500,$.proxy(function(mark){
                return function(){
                    this.dpImgs[mark].css(this.jszxDpImgRight);
                }
            }(this.dpImgMark),this));
            this.dpImgs[(this.dpImgMark+1)%this.dpImgs.length].animate(this.jszxDpImgMiddle,500);
            
            this.dpMarkerImgs[this.dpImgMark][0].src=this.hideMarker;
            this.dpMarkerImgs[(this.dpImgMark+1)%this.dpImgs.length][0].src=this.showMarker;
            
            this.dpImgMark=(this.dpImgMark+1)%this.dpImgs.length;
        }
		
		if(this.options.text)
			this.dpText.text(this.options.text[this.dpImgMark])
				
		if(this.options.onChange)
			this.options.onChange.call(window,this.dpImgMark);
        
        this.dpTimer=setInterval($.proxy(this.playPic,this),this.options.timmer||5000);
        return;
    }
	
    if(!this.dp.closest("div[data-role=page]").hasClass("ui-page-active"))
        return;
    
    this.dpImgs[this.dpImgMark].animate(this.jszxDpImgLeft,500,$.proxy(function(mark){
        return function(){
            this.dpImgs[mark].css(this.jszxDpImgRight);
        }
    }(this.dpImgMark),this));
    this.dpImgs[(this.dpImgMark+1)%this.dpImgs.length].animate(this.jszxDpImgMiddle,500);
    
    this.dpMarkerImgs[this.dpImgMark][0].src=this.hideMarker;
    this.dpMarkerImgs[(this.dpImgMark+1)%this.dpImgs.length][0].src=this.showMarker;
    
    this.dpImgMark=(this.dpImgMark+1)%this.dpImgs.length;
	
	if(this.options.text)
		this.dpText.text(this.options.text[this.dpImgMark])
			
	if(this.options.onChange)
		this.options.onChange.call(window,this.dpImgMark);
}