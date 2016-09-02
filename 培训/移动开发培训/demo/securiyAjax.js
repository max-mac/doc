

//����rsa.js
//����jsaes.js
var jAjax=$.ajax;
$.ajax=function(options){
	window.aesKey=window.sessionStorage?window.sessionStorage.aesKey:window.aesKey;
	
	if(!window.aesKey){
		jAjax({
			url:"��ȡrsaPublicKey",
			success:function(rsaPublicKey){
				var aesKey=randomAESKey();
				var aesKeyByRSA=RSAEncrypt(aesKey,rsaPublicKey);
				
				jAjax({
					url:"�ϱ�aesKey",
					success:function(){
						if(window.sessionStorage) window.sessionStorage.aesKey=aesKey;
						window.aesKey=aesKey;

						aesRequest(options);
					}
				});
			}
		});
	}else{
		aesRequest(options);
	}
}
function aesRequest(options){
	for ( var name in options.data) { //�����ϱ�������key������value����ʵ����£�����ҵ����Ҫ��������Ҫ��ȱ���
		option.data[name] = AESEncrypt(options.data[name] + "", window.aesKey);
	}
	var success=options.success;
	options.success=function(data){ //�ȶ�response�еļ������ݽ��н��ܣ��ٽ���ҵ����ص�success��������
		if(success) success(AESDecrypt(data));
	}
	jAjax(options);
}



public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		String aesKey = getAESKey(); //��session�л�ȡaesKey
		
		Map<String,String[]> m = new HashMap<String,String[]>(request.getParameterMap());
		for(Map.Entry<String, String[]> entry: m.entrySet()){ //����request������parameter������AES���ܣ��ٽ���ҵ����봦��
			String key = entry.getKey();
			String[] values = entry.getValue();
			int i = 0;
			if(!key.equals("timer")){
				for(String value: values){
					value = aes.decrypt(value);
					values[i] = value;
				}
			}
			
			i++;
			m.put(key, values);
		}
        request = new ParameterRequestWrapper((HttpServletRequest)request, m); 
		chain.doFilter(request, response);
	}

