$.fn.center = function(){};
$.fn.formSerializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

$.fn.onEnter = function(func) {
	var that = this;
	
	this.each(function(index) {
		that.keydown(function (key) {
			if(key.keyCode == 13) {	//키가 13이면 실행 (엔터는 13)
				func();
			}
		});
	});
};
/*
 * PKM`s 라이브러리 
 * @author PKM : pminmin@nate.com
 */
function commonAjax(url, params, callback, dataType, async) {
	params = params ? params : {};
	
	if(!(dataType == "text" || dataType == "json")) {
		alert("No dataType. Add temporary 'text'!");
		dataType = "text";
	}
	
	return $.ajax({
		  type		  : "POST"
		, url		  : url
		, dataType	  : dataType // text, html, script, json, jsonp, xml. (서버가 던져주는 데이터형.)
		, async		  : async
		, contentType : "application/json;charset=UTF-8"
		, data		  : JSON.stringify(params)
		, success	  : function(data, status) {
			try{
				if(data["loginStatus"] == "FAIL"){
					dialog.alert(data["loginStatusMsg"],goLoginPage);
				}
			}catch(e){}
			
			var resultCode = Number(data["RESULT_CODE"]);
			var resultMesg = data["RESULT_MESG"];
			if(resultCode < 0){
				switch (resultCode){
				case -100 :
					dialog.alert(message.get('notlogin'),goLoginPage);
					break;
				case -110 :
					goLoginPage();
					break;
				default : 
					dialog.alert(resultMesg);
					break;
				}
			}else{				
				if(!(callback === "" || callback === undefined || callback === null)) {
					callback(data);
				}
			}
		  }
		, error: function(request, status, statusText) {
			if(request.status == "401"){
				dialog.alert("로그인 정보가 없습니다. 다시 로그인하세요.");
			} else {
				if(request.status == '200'){
					callback();
				} else {
					dialog.alert("통신 중 에러 발생. 관리자에게 문의하세요." + "\n" + request.status + " : " + statusText);
				}
			}
		  }
		, beforeSend  : function() {
			loading(true);
		  }
		, complete	  : function() {
			loading(false);
		}
	});
}

//multiple ajax
function commonAjaxList(queue){
	var deferreds = [];
	$.each(queue, function(idx, item){
		var deferred = item.method(item.param);
		if(deferred.readyState === 1){
			deferreds.push(deferred);
		}
	});
	return $.when.apply($, deferreds);
}

function dataNullCheck(value){
	var temp = $.trim(value);
	return (temp === "" || temp === undefined || temp === null || temp == "null")
}

function nvl(value,rStr){
	return (dataNullCheck(value)?(""+(rStr?rStr:"")):($.trim(value)));
}

function setPageInfo(pageInfo){//브라우저 세션 스토리지에 페이지 정보 set
	sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo));
}

function getPageInfo(){//브라우저 세션 스토리지에 페이지 정보 get
	var pageInfo = JSON.parse(sessionStorage.getItem('pageInfo'));
	return pageInfo;
}

function checkMobile(){//모바일 접속 여부
	return !isEmptyArray(navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/));
}

function isEmptyArray(a){
	if(typeof a != "undefined" && a != null && a.length>0){
		return trimToNullStr(a)!=null?false:true;
	}
	return true;
}

function trimToNullStr(a){
	return(a != null && typeof a != "undefined" && $.trim(a).length > 0)?$.trim(a):null;
}

function toDate(dObj){
	if(dataNullCheck(dObj) || getOnlyNumber(dObj).length < 8) return nvl(dObj);
	var y = "";
	var m = "";
	var d = "";	
	if(getOnlyNumber(dObj).length == 8){	
		var dt = getOnlyNumber(dObj);
		y = dt.substring(0,4);
		m = dt.substring(4,6);
		d = dt.substring(6);
	}else{		
		var dt = new Date(dObj);
		y = dt.getFullYear();
		m = dt.getMonth()+1;
		d = dt.getDate();
	}
	
	return y.toString()+"-"+lpad(m.toString(),"0",2)+"-"+lpad(d.toString(),"0",2);
}

function lpad(valStr,appStr,cnt){
	valStr = nvl(valStr);
    while (valStr.length < cnt)
    	valStr = appStr + valStr;
    valStr = valStr.length >= cnt ? valStr.substring(0, cnt) : valStr;
    return valStr;
	
}

function getOnlyNumber(valStr){
    return nvl(valStr).replace(/[^0-9]/g,"");
}

/* ======================================================================
Function :  로그아웃처리
Param 	 :  없음
Return   :  없음
====================================================================== */
function logoutUser(){
	if('eng' == pageType){ logout(); return; }
	
	var f = $("#frmHeader")[0];
	var strCampFg = f.strCampFg.value;
	var strStdNo = f.strStdNo.value;
	var strStdNm = f.strStdNm.value;
	var strLtYy = f.strLtYy.value;
	var strLtShtmCd = f.strLtShtmCd.value;
	var strLtShtmNm = f.strLtShtmNm.value;

	var params = {
			strStdNo : strStdNo,
			strStdNm : strStdNm,
			strLtYy : strLtYy,
			strLtShtmCd : strLtShtmCd,
			strLtShtmNm : strLtShtmNm,
			strCampFg : strCampFg
	};
	
	openPopup({
		popId : "closeConfirmPopup",
		url : contextPath+"/aply/openTakingLessonInfo.action",
		params : params,
		returnPopup : logout
	});
}

function logout(){
	var f = $("#frmHeader")[0];  

	loading(true);
	
	f.action = contextPath+"/com/cmmn/user/logout.action";
	f.method = "post";
	f.submit();
}

function goLoginPage(){	
	location.href = contextPath+"/login.jsp?isMobile="+isMobile+"&pageType="+nvl(pageType);
}

function setEmptyList(tables){
	var msg = message.get("notfound");
	$.each(tables,function(idx,item){
		if("UL" == $(item)[0].tagName.toUpperCase()){
			$(item).html('<li><div class="notice-message" style="text-align:center">'+msg+'</div></li>');
		}else{
			var colspan = $(item).find('colgroup').children().length;
			$(item).find('tbody').html('<tr><td colspan="'+colspan+'" class="notice-message"><span>'+msg+'</span></td></tr>');
		}
	});
}

/* ======================================================================
Function :  로그인 이후 상단메뉴 사용가능처리
Param 	 :  없음
Return   :  없음
====================================================================== */
function notLogin(){
	dialog.alert("로그인 이후 사용가능합니다.");
	return;
}

/* ======================================================================
Function :  각각의 Page전환처리
Param 	 :  없음
Return   :  없음
====================================================================== */
function goPages(pageFg) {
	var f = $("#frmHeader")[0];  

	if(nvl(pageFg) == "") return;
	loading(true);
	
	return;
	
	f.method = "post";
	f.submit();
}

/* ======================================================================
Function :  텍스트 자르기
Param 	 :  없음
Return   :  없음
====================================================================== */
function stringCut(str, len){
	var l = 0;
	var rsltStr = "";
	
	if (str.length <= len){
		return str;
	}else{
		for (var i = 0; i < str.length; i++){
			if (i+1 > len){
				rsltStr = str.substring(0, i) + "..";
				return rsltStr;
				break;
			}
		}
	}
}

/* ======================================================================
Function :  SELECT 전체 삭제
Param 	 :  삭제대상
Return   :  없음
====================================================================== */
function deleteSelectList(target){
    var f = document.application;
	var index = eval("f."+target+".options.length")-1;
	for(selectInex=index; selectInex>=0; selectInex--){
		eval("f."+target+".options["+selectInex+"] = null;");
	}
}

/* ======================================================================
Function :  텍스트 자르기
Param 	 :  없음
Return   :  없음
====================================================================== */
function stopNetFunnel(ev,ret){
	preprocess(false);
	return;
    openLectureList.style.display = "block";
    initPreProcess(false, "", "", "", "", "");
    parent.applicationIframe.preTakingLectureList.style.display = "block";
	parent.applicationIframe.initPreProcess(false, "", "", "", "", "");
	parent.applicationIframe.takingLectureList.style.display = "block";
	parent.applicationIframe.initPreProcess(false, "", "", "", "", "");
}

function printDiv(printHtml,opts){
	var title = "";
	title += '<div>';
	title += '    <span>'+opts["title"]+'</span>';
	title += '</div>'; 
	
	$("#div_print_body").html(printHtml);
	var footer = "";
	footer += '<div class="help-block">';
	footer += '    <span>출력일시 : '+findCurDttm()+'</span>';
	footer += '</div>';    
	$("#div_print_footer").html(footer);
	
    w = window.open();
    w.document.write('<html>');
    w.document.write('<head>');
    w.document.write('<title>'+opts["title"]+'</title>');
    w.document.write('<link rel="stylesheet" href="/css/layout.css">');
    w.document.write('<style><!-- table th {font-size: 10px;}');
    w.document.write('table td > span {font-size: 9px;color: #000;display: inline-block;padding: 0;} --></style>');
    w.document.write('</head>');
    w.document.write(title);
    w.document.write($("#div_print").html());
    w.document.write('<scr' + 'ipt type="text/javascript">' + 'window.onload = function() { window.print(); window.close(); };' + '</sc' + 'ript>');
    w.document.close(); // necessary for IE >= 10
    w.focus(); // necessary for IE >= 10

    return true;
}

/* ======================================================================
Function : Client의 현재 일시 조회
Param 	 : 
Return   : 없음
====================================================================== */
function findCurDttm(){
	var today = new Date();
	var strCurDttm = "";
	var strCurYear = today.getFullYear();
	var strCurMonth = today.getMonth() + 1;
	var strCurDate = today.getDate();
	var strCurHour = today.getHours();
	var strCurMin = today.getMinutes();
	
	strCurDttm = strCurYear+"년 " + strCurMonth + "월 " + strCurDate + "일 " + strCurHour + "시 " + strCurMin + "분";
	return strCurDttm;
}

function openPopup(opts){
	var url 	= opts["url"];
	var size 	= opts["size"]||"sm";

	if(opts["popId"] != "report" && !dataNullCheck(url)){
		var params = opts["params"]||{};
		var html = '<div id="bg_'+opts["popId"]+'" class="sp-modal-backdrop" style="display:none;"></div>';
		html += '<div id="'+opts["popId"]+'" class="sp-modal-wrap ng-scope in" style="display:none;">';
		html += '<div id="modalContents" class="sp-modal '+(isMobile?"":" sp-biz-modal")+' sp-modal-'+size+'"></div>';
		html += '</div>';
		$("#contents").append(html);
		$(document.body).css('overflow','hidden');

		loading(true);
		$("#"+opts["popId"]+" #modalContents").load(url, params, function(){
			var popup = eval(opts["popId"]);
			$("#bg_"+opts["popId"]).show();
			popup.load(opts);	
			loading(false);  
			
			//$("#"+opts["popId"]).find(".nb-btn-close > button").focus();  
		});
	}else{
		var html = "";
		var body = opts["html"]||{};
		if(opts["popId"] == "report"){
			var title = opts["title"]||"AIMS2 Report";
			body = '<div class="sp-modal-header">';
			body += '    <section class="nb-title page">';
			body += '        <h2><em>'+title+'</em></h2>';
			body += '    </section>';
			body += '    <span class="sp-modal-close" id="btnClosePopup"></span>';
			body += '</div>';
			body += '<div class="sp-modal-body">';
			body += '<div id="crownix-viewer"></div>';
			body += '</div>';
			body += '<div class="sp-modal-footer">';
			body += '    <div class="nb-buttons nb-block center">';
			body += '        <div class="nb-btn-close nb-theme"><button type="button" id="btnCancelPopup">'+message.get("close")+'</button></div>';
			body += '    </div>';
			body += '</div>';
			
			size = "fl";
		}else{
			html += '<div id="bg_'+opts["popId"]+'" class="sp-modal-backdrop"></div>';
		}
		html += '<div id="'+opts["popId"]+'" class="sp-modal-wrap ng-scope in" style="display:none;">';
		html += '<div id="modalContents" class="sp-modal '+(isMobile?"":" sp-biz-modal")+' sp-modal-'+size+'">';
		html += body;
		html += '</div>';
		html += '</div>';
		$("#contents").append(html);
		$(document.body).css('overflow','hidden');
		$("#"+opts["popId"]).show();
		$("#"+opts["popId"]).find("#btnClosePopup, #btnCancelPopup").on("click",function(){
			$(document.body).css('overflow','auto');
			$("#bg_"+opts["popId"]).remove();
			$("#"+opts["popId"]).remove();
		});

		if(opts["popId"] == "report"){
			var viewServer 	= "https://rdc.ajou.ac.kr:8082";
			var mrdServer 	= "https://aims.ajou.ac.kr/report";
			var viewer = new m2soft.crownix.Viewer(viewServer+'/ReportingServer/service', 'crownix-viewer');
			var rFileUrl = nvl(opts["url"]);
			var rParam = " /rp";
			
			var params = opts["params"]||{};
			var keys = Object.keys(params);
			$.each(keys,function(idx){
				rParam += " ["+nvl(params[keys[idx]])+"]";
			});
			viewer.setParameterEncrypt("10");
			var eParam = {
	        		"mrdpath":mrdServer+rFileUrl,
	        		"strParam":'/rf ['+viewServer+'/DataServer/rdagent.jsp] /rsn [rd_uni]'+rParam
	        }
			commonAjax(contextPath+"/encryptReportParam.ajax", eParam, function(data){        	
	            viewer.openFile(data["mrdpath"], data["strParam"]);  
	    	}, "json", true);

			$(".crownix-container").css("top","150px");
		}
		
		//if(!isMobile) $("#"+opts["popId"]).find(".nb-btn-close > button").focus();
	}
}

function loading(flag){
	if(flag){
		var html = '<div class="white_content LOADING"> <div class="page-loading"></div></div> <div id="fade" class="black_overlay LOADING"></div>';
		$("body").append(html);
		$(document.body).css('overflow','hidden');
	}else{
		$(".LOADING").remove();
		$(document.body).css('overflow','auto');
	}	
}

var sugangAccepting = false;
function preprocess(flag){
	sugangAccepting = flag;
	return;
	
	if(flag){
		var html = '<div class="white_content PROCESS"> <div style="font-size:13px;width:300px;">현재 수강신청 처리가 진행중입니다.<br><br>잠시만 기다려주십시오...</div></div>';
		$("body").append(html);
		$(document.body).css('overflow','hidden');
	}else{
		$(".PROCESS").remove();
		$(document.body).css('overflow','auto');
	}	
}

function closePopup(popId,callbackFc,callbackRs){
	if(typeof callbackFc == "function") callbackFc(callbackRs);
	
	$(document.body).css('overflow','auto');
	$("#bg_"+popId).remove();
	$("#"+popId).remove();
}

function gfnContainsSpecialChars(inputValue,chars){
    for (var idx = 0; idx < inputValue.length; idx++) {
       if (chars.indexOf(inputValue.charAt(idx)) != -1)
           return true;
    }
    return false;
}  

/* ======================================================================
Function :  특수키 입력 차단 
Param    :  없음
Return   :  없음
====================================================================== */
function KeyEventHandle(){
	if((event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82))||(event.keyCode >= 112 && event.keyCode <= 123)){
		event.keyCode = 0;
		event.cancelBubble = true;
		event.returnValue = false; 
	}

	if(event.altKey == true){
		dialog.alert(message.get("message4"));
		event.returnValue = false;
	}
}

document.onkeydown=KeyEventHandle;
document.onkeyup=KeyEventHandle;

//보안이미지 새로고침
function getCaptchaImg(){ 
	$("#securityNumber").val(''); //입력값 초기화
	var rand = Math.random(); 
	var url = contextPath+'/captchaImg?rand='+rand;
	$("#captchaImg").attr("src", url); //보안이미지 초기화
}
//보안이미지 오디오로 불러오기
function getCaptchaAudio(objUrl){ 
	$("#captchaAudio").html('<bgsound src="' +objUrl +'">'); 
}

var dialog = (function(dialog){
	var opts = {};
	var seq = 0;
	
	var setDialog = function(_opts){
		$.extend(opts,_opts);
		$(".DIALOG").remove();
		opts["dialogId"] = opts["type"]+"_"+(++seq);

		dialog.beforeClose = function(){ return true; };
	};
	
	var makeLayout = function(){
		var dTitle = message.get("dialog_title_notice");
		var header = '<div class="sp-modal-header">';
		if(opts["type"] == "S"){
			dTitle = message.get("dialog_title_security");
		}
		header += '<section class="nb-title page"><h2><em>'+dTitle+'</em></h2></section>';
		header += '<span class="sp-modal-close" id="btnClosePopup" onclick="dialog.close(\''+opts["dialogId"]+'\')"></span>';
		header += '</div>';
		
		var body = '<div class="sp-modal-body" style="padding-top:5px;padding-bottom:5px;">';
		if(opts["type"] == "S"){
			body += '	 <div class="help-block blue">'+message.get("dialog_message_security",{"xxxx":opts.msg})+'</div>';
			body += '    <div class="da-row-form">';
			body += '        <div class="da-row">';
			body += '            <div class="cell">';
			body += '                <dl class="w5-5p">';
			body += '                    <dt><span>'+message.get("dialog_security_number")+'</span></dt>';
			body += '                    <dd>';
			body += '                        <div class="nb-inputText">';
			body += '                            <div>';
			body += '                                <input name="securityNumber" type="text" maxlength=4>';
			body += '                                <i></i>';
			body += '                            </div>';
			body += '                        </div>';
			body += '                    </dd>';
			body += '                </dl>';
			body += '            </div>';
			body += '        </div>';
			body += '    </div>';
			body += '	 <div class="help-block red" style="display:none;" id="dialog_message_security_error">'+message.get("dialog_message_security_error")+'</div>';
		}else{
			body += opts.msg;
		}
		body += '</div>';
		
		var footer = '<div class="sp-modal-footer">';
		footer += '<div class="nb-buttons nb-block center">';
		if(opts["type"] == "A"){
			footer += '<div class="nb-btn-close nb-theme"><button type="button" onclick="dialog.close(\''+opts["dialogId"]+'\')">'+message.get("close")+'</button></div>';
		}else if(opts["type"] == "C" || opts["type"] == "S"){
			footer += '<div class="nb-btn-save nb-theme"><button type="button" onclick="dialog.close(\''+opts["dialogId"]+'\',true)">'+message.get("confirm")+'</button></div>';
			footer += '<div class="nb-btn-close"><button type="button" onclick="dialog.close(\''+opts["dialogId"]+'\',false)">'+message.get("cancel")+'</button></div>';
		}
		footer += '</div>';
		footer += '</div>';
		var html = '<div id="bg_'+opts["dialogId"]+'" class="sp-modal-backdrop DIALOG" style="z-index:'+(Number(nvl($(".sp-modal-backdrop").css("z-index"),"1040"))+10)+'"></div>';
		html += '<div id="'+opts["dialogId"]+'" class="sp-modal-wrap ng-scope in DIALOG" style="z-index:'+(Number(nvl($(".sp-modal-backdrop").css("z-index"),"1050"))+20)+'">';
		html += '<div id="modalContents" class="sp-modal sp-modal-xs '+(isMobile?"":" sp-biz-modal")+'">';
		html += header;
		html += body;
		html += footer;
		html += '</div></div>';
		$("#contents").append(html);
		$(document.body).css('overflow','hidden');
		$("#"+opts["dialogId"]).find(".nb-btn-close > button").focus();
	};
	
	//보안이미지 화면 레이아웃
	var makeImgLayout = function(){
		var rand = Math.random(); 
		var url = '/captchaAnswer?rand=' + rand;
		var header = '<div class="sp-modal-header">';
		header += '<section class="nb-title page"><h2><em>'+message.get("dialog_title_security")+'</em></h2></section>';
		header += '<span class="sp-modal-close" id="btnClosePopup" onclick="dialog.close(\''+opts["dialogId"]+'\')"></span>';
		header += '</div>';		
		var body = '<div class="sp-modal-body" style="padding-top:5px;padding-bottom:5px;">';
			body += '	 <div class="help-block blue">';
			body += '	 <img id="captchaImg" title="'+message.get("dialog_security_number")+'" src="'+ url +'" alt="'+message.get("dialog_security_number")+'"/>';
			body += '	 <img id="captchaRefresh" src="/static/images/refresh_icon.png" alt="refresh" onclick="dialog.refresh(\''+opts["dialogId"]+'\')" style="width:50px;height:35px;cursor:pointer">';
			body += '	 <div id="captchaAudio" style="display:none"></div>';
			body += '	 </div>';
			body += '    <div class="da-row-form">';
			body += '        <div class="da-row">';
			body += '            <div class="cell">';
			body += '                <dl class="w5-5p">';
			body += '                    <dt><span>'+message.get("dialog_security_number")+'</span></dt>';
			body += '                    <dd>';
			body += '                        <div class="nb-inputText">';
			body += '                            <div>';
			body += '                                <input name="securityNumber" id="securityNumber" type="text" maxlength=6>';
			body += '                                <i></i>';
			body += '                            </div>';
			body += '                        </div>';
			body += '                    </dd>';
			body += '                </dl>';
			body += '            </div>';
			body += '        </div>';
			body += '    </div>';
			body += '	 <div class="help-block red" style="display:none;" id="dialog_message_security_error">'+message.get("dialog_message_security_error")+'</div>';
			body += '</div>';		
		var footer = '<div class="sp-modal-footer">';
		footer += '<div class="nb-buttons nb-block center">';
		footer += '<div class="nb-btn-save nb-theme"><button type="button" onclick="dialog.close(\''+opts["dialogId"]+'\',true)">'+message.get("confirm")+'</button></div>';
		footer += '<div class="nb-btn-close"><button type="button" onclick="dialog.close(\''+opts["dialogId"]+'\',false)">'+message.get("cancel")+'</button></div>';
		footer += '</div>';
		footer += '</div>';
		var html = '<div id="bg_'+opts["dialogId"]+'" class="sp-modal-backdrop DIALOG" style="z-index:'+(Number(nvl($(".sp-modal-backdrop").css("z-index"),"1040"))+10)+'"></div>';
		html += '<div id="'+opts["dialogId"]+'" class="sp-modal-wrap ng-scope in DIALOG" style="z-index:'+(Number(nvl($(".sp-modal-backdrop").css("z-index"),"1050"))+20)+'">';
		html += '<div id="modalContents" class="sp-modal sp-modal-xs '+(isMobile?"":" sp-biz-modal")+'">';
		html += header;
		html += body;
		html += footer;
		html += '</div></div>';
		$("#contents").append(html);
		$(document.body).css('overflow','hidden');
		$("#"+opts["dialogId"]).find(".nb-btn-close > button").focus();
	};
	
	dialog.alert = function(msg,callback,opts){
		setDialog($.extend({
			type : 'A',
			msg : msg,
			callback : callback
		},opts));
		
		makeLayout();
	};
	
	dialog.confirm = function(msg,callback,opts){
		setDialog($.extend({
			type : 'C',
			msg : msg,
			callback : callback
		},opts));
		
		makeLayout();
	};
	
	dialog.security = function(msg,callback,opts){	
		commonAjax(contextPath+"/uni/tlsn/aply/getSecurityNumber.ajax", {}, function(data){
			var _securityNumber = data["number"];
			
			setDialog($.extend({
				type : 'S',
				msg : data["number"],
				callback : function(flag){ 
					if(flag && _securityNumber == nvl($("input[name=securityNumber]").val(),"")){
						callback({securityNumber:$("input[name=securityNumber]").val()});
					}
				}
			},opts));

			dialog.beforeClose = function(){
				if(_securityNumber != nvl($("input[name=securityNumber]").val(),"")){
					$("#dialog_message_security_error").show();
					return false;
				}
				return true;
			};
			
			makeLayout();
		}, "json", true);
	};

	//보안이미지 팝업
	dialog.security2 = function(msg,callback,opts){	
		setDialog($.extend({
			type : 'S',
			msg : '',
			callback : function(flag){ 
				if(flag){
					callback({securityNumber:$("input[name=securityNumber]").val()});
				}
			}
		},opts));	
		
		dialog.beforeClose = function(){
			var resultFlag = true;
			$.ajax({
	            url:contextPath+'/captchaAnswer',
	            type:'post',
	            data:{answer:$("#securityNumber").val()},
	            async: false,
	            success:function(data){
	            	if(data == 200){ 
	            		//alert('입력값이 일치합니다.'); // 성공 코드 
	            	}else{ 
	        			getCaptchaImg(); //이미지 초기화
	    				$("#dialog_message_security_error").show();
	            		resultFlag = false;
	            	}
	            }
	        });
	        return resultFlag; 
		};
		makeImgLayout();
	};
	
	dialog.refresh = function(dialogId){
		getCaptchaImg();
	};		
	
	dialog.close = function(dialogId,flag){
		if(flag && !this.beforeClose()) return;
		
		if(typeof opts["callback"] === "function") opts["callback"](flag);
		$(document.body).css('overflow','auto');
		$("#bg_"+dialogId).remove();
		$("#"+dialogId).remove();
	};
    return dialog;
})(dialog || {});