
var oriAjax=$.ajax;
$.ajax=function(options){
	if(options.url.match("checkUpdate.action")){
		options.success=function(data){
			var datas = eval("("+data+")");
			if(datas.result===true){
				
				if(device.platform=="Android"){
					showConfirm("<div>�����°汾�ˣ���Ҫ���ظ�����</div>","�°汾","ȷ��",sureUpdate,"ȡ��",cancelUpdate);
				}else{
					showConfirm("<div>�����°汾�ˣ���Ҫ������</div>","�°汾","ȷ��",function(){
						//�´���
					},"ȡ��",function(){
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

