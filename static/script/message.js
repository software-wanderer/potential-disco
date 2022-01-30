var message = {
		data : {
			dialog_title_notice : ["알림","Notice"],
			dialog_title_security : ["인증","authentication"],
			dialog_security_number : ["인증번호","authentication number"],
			dialog_message_security : ["인증번호에 다음 숫자[ <span style='font-size:17px;color:red;'>xxxx</span> ]를 입력하세요.","Enter the following number [ <span style='font-size:17px;color:red;'>xxxx</span> ] in your verification number."],
			dialog_message_security_error : ["인증번호를 정확히 입력하세요.","Please enter your verification number correctly"],
			dialog_message_security_preprocess : ["현재 수강신청 처리가 진행중입니다.<br><br>잠시만 기다려주십시오...","Current registration is in progress. <br> <br> Please wait ..."],
			title : ["아주대 수강신청","COURSE REGISTRATION"],
			message1 : ["사용자 ID를 입력하십시오.","ID is empty."],
			message2 : ["사용자 PASSWORD를 입력하십시오.","Password is empty."],
			message3 : ["특수 문자를 사용할 수 없습니다.","Special characters are not allowed."],
			message4 : ["ALT 키는 사용할 수 없습니다!","You can not use the ALT key!"],
			message5 : ["등록되었습니다.","Registered."],
			notfound : ["조회된 데이터가 없습니다.","No data found."],
			confirm : ["확인","Confirm"],
			close : ["닫기","Close"],
			cancel : ["취소","Cancel"],
			notlogin : ["로그인 이후 사용가능합니다.","로그인 이후 사용가능합니다."],
			logout : ["로그아웃","Logout"],
			linkApplication : ["수강신청","Course Registration"]
		},
		get : function(code,trans){
			var idx = (pageType == "eng"?1:0);
			try{
				var result = this.data[code][idx];
				if(typeof trans != "object") return result;
				var keys = Object.keys(trans);
				$.each(keys,function(idx){
					var test = eval("/"+nvl(keys[idx])+"/gi");
					result = result.replace(test, nvl(trans[keys[idx]]));
				});
				return result;
			}catch(e){ return code; }			
		}
};