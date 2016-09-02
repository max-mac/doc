

//依赖rsa.js
//依赖jsaes.js
var jAjax=$.ajax;
$.ajax=function(options){
	window.aesKey=window.sessionStorage?window.sessionStorage.aesKey:window.aesKey;
	
	if(!window.aesKey){
		jAjax({
			url:"获取rsaPublicKey",
			success:function(rsaPublicKey){
				var aesKey=randomAESKey();
				var aesKeyByRSA=RSAEncrypt(aesKey,rsaPublicKey);
				
				jAjax({
					url:"上报aesKey",
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
	for ( var name in options.data) { //遍历上报的数据key，加密value。真实情况下，根据业务需要，可能需要深度遍历
		option.data[name] = AESEncrypt(options.data[name] + "", window.aesKey);
	}
	var success=options.success;
	options.success=function(data){ //先对response中的加密数据进行解密，再交给业务相关的success方法处理
		if(success) success(AESDecrypt(data));
	}
	jAjax(options);
}



public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		String aesKey = getAESKey(); //从session中获取aesKey
		
		Map<String,String[]> m = new HashMap<String,String[]>(request.getParameterMap());
		for(Map.Entry<String, String[]> entry: m.entrySet()){ //遍历request中所有parameter，进行AES解密，再交给业务代码处理
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

