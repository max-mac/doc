
var oriAjax=$.ajax;
$.ajax=function(options){
	if(options.url.match("checkUpdate.action")){
		options.success=function(data){
			var datas = eval("("+data+")");
			if(datas.result===true){
				
				if(device.platform=="Android"){
					showConfirm("<div>您有新版本了，需要下载更新吗？</div>","新版本","确定",sureUpdate,"取消",cancelUpdate);
				}else{
					showConfirm("<div>您有新版本了，需要更新吗？</div>","新版本","确定",function(){
						//新代码
					},"取消",function(){
						verifyLogin();
					});
				}
			}else{
				verifyLogin();
			}
		}
	}
	
	oriAjax(options);
}

