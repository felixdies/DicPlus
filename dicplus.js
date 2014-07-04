/// <reference path="header.js" />


var curUrl;	// 현재 페이지의 주소

function lg(object){
	console.log(object);
}

/** original shortcur keys(Alt) of Chrome
  * Alt + D, E, F
  * Alt + Shift + T
  */

chrome.extension.sendMessage(REQ_GET_URL,function(response) {
	curUrl = response;
		
	if(/endic\.naver\.com/.test(curUrl))
		set_Naver_endic_listener();
		
	else if(/ozdic\.com/.test(curUrl))
		set_Ozdic_listener();
		
	else if(/thesaurus\.com/.test(curUrl))
		set_Thesaurus_listener();

	set_common_listener();

	create_shadow();
	create_search_dialog();
});

function set_Naver_endic_listener(){
	$(document).keydown(function(event){

		if (event.shiftKey && event.altKey){
		}
		else if (event.shiftKey){
			switch(event.keyCode)
			{
				// shift + 1,2,3,4,5	: n 번째 단어 선택
				case 49: case 50: case 51: case 52: case 53: 
					var num = event.keyCode - 49;
					var $list = $(document).find('dl.list_e2').first();
					var $words = $list.find('dt').children('.fnt_e30');
					var href = $words.eq(num).children().attr('href');
					
					window.location.href = href;
					event.preventDefault();
					
					break;
			}
		}
		else if (event.altKey){
			switch(event.keyCode)
			{
				// alt + 1,2,3,4,5 : 전체,단어/숙어,본문,예문,유의어/반의어
				case 49: case 50: case 51: case 52: case 53: 
					var num = event.keyCode - 48;
					var href = $(document).find('li.tx_depth' + num).find('a').attr('href');
					
					window.location.href = href;
					event.preventDefault();
					break;
				
				// alt + m : 영영사전 / 한영, 영한사전 모드 변경
				case 77:
					var cbEndic = $(document).find('#dts_area').children('input');
					cbEndic.trigger('click');
					break;
					
				// alt + o : open other sites
				case 79:
					chrome.runtime.sendMessage({code:"open_ozdic"});
					chrome.runtime.sendMessage({code:"open_thesaurus"});
					break;
			}
		}
	});
}

function set_Ozdic_listener(){
//	var tab = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	var dash = "- ";
	
	$(document).ready(function(){
		// seperate example sentence lines
		$("i").each(function(){
			var $html = $(this).html();
			$html = $html.replace(/\.\s+(\w)/g, ".<br/>" + dash + "$1");
			$(this).html($html);
		});
	
		
		$("p:not(.word)").each(function(){
			var $html = $(this).html();
			
			// 맨 앞의 | 삭제
			$html = $html.replace(/<b[^>]+>\| /g, "<b>");
			//$html = $html.replace(/<sup>(\s[^1])/g, "<br/><sup>$1");
			//$html = $html.replace(/\|/g, "");
			//$html = $html.replace(/<i>/g, "<br/><i>" + tab);

			$(this).html($html);
			
			//$(this).width(700);
		});
		
		
	});
	
	$(document).keydown(function(event){
		
		if (event.shiftKey && event.altKey){}
		
		else if (event.shiftKey){}
		
		else if (event.altKey){
			switch(event.keyCode)
			{
			// alt + o : open other sites
			case 79:
				chrome.runtime.sendMessage({code:"open_naver"});
				chrome.runtime.sendMessage({code:"open_thesaurus"});
				break;
			}
		}
		
		else if (event.ctrlKey) {}
		
		else {	// alt, ctrl, or shift key is not pressed.
		
			// arrow, page up/down, home, end keys
			if (!(event.keyCode > 32 && event.keyCode < 41))	
				// move to the input textfield
				$(document).find('form#search').children('[type=text]').focus();
		}
	});
}

function set_Thesaurus_listener() {
	
	// hide ads
	$(document).ready(function(){
		$(document).find('div.banner').each(function(){
				$(this).hide();
			});
		$(document).find('section.promo-top').css("min-height", "1px");
	});
	
	$(document).keydown(function(event){
		if (event.shiftKey){}
		
		else if (event.altKey){
			switch(event.keyCode)
			{
			// alt + o : open other sites
			case 79:
				chrome.runtime.sendMessage({code:"open_naver"});
				chrome.runtime.sendMessage({code:"open_ozdic"});
				break;
			}
		}
		
		else if (event.ctrlKey) {}
		
		else {	// alt, ctrl, or shift key is not pressed.
		
			// arrow, page up/down, home, end keys
			if (!(event.keyCode > 32 && event.keyCode < 41))	
				// move to the input textfield
				$(document).find('input#q').focus();
		}
	});
}


function set_common_listener() {

    $(document).keydown(function (event) {
        switch (event.keyCode) {
            // "/" : 사전 검색 다이얼로그
            case 191:
                event.preventDefault();
                show_search_dialog();
                break;
        }
    });
}


function create_search_dialog() {
    var $dialog;
    
    

    /* 사전 검색 다이얼로그 div */
    $dialog = $("<div id='dpSearchDialog' style='position: absolute; top: 100px; left: 100px; z-index: 0; border:1px solid lightgray; font-size:13px; padding:6px'> <div align='center' style='font-size:17px; font-weight:bold; text-shadow:1px 1px silver'>사전 검색</div> <hr> <div style='margin-bottom:10px'> <span><b>검색할 단어</b></span> <input type='text' id='dpInputSearch'> </div> <div style='margin-bottom:10px'> shift + 1 : 네이버 한영사전(new) 검색<br> shift + 2 : 네이버 한영사전(old) 검색<br> shift + 3 : 네이버 영영사전(new) 검색<br> shift + 4 : 네이버 영영사전(old) 검색<br> shift + 5 : ozdic(연어) 검색<br> shift + 6 : thesaurus(동의어/유의어) 검색<br> </div> <div align='right'> <button type='button' id='dpBtnSearchDialogCancle'>취소(Esc)</button> </div> </div>");
    $dialog.css({
        'position': 'absolute',
        'height': 1000,
        'width': 1000,
        'top': 0,
        'left': 0,
        'z-index': 0
    });
    $('body').append($dialog);
    $dialog.hide();

    /* 취소 버튼 */

    /* 입력란 */

    /* 검색 버튼 */

    /* 사전 코드 표기란 */
}

function search_word(word, dicCode) {

}


function show_search_dialog() {
    $('#dpShadow').show();
}


function hide_search_dialog() {
    $('#dpShadow').hide();
}


function create_shadow() {
    var $shadow;
    var imgURL = chrome.extension.getURL("semi_transparent.png");

    $shadow = $("<img id='dpShadow' src="+imgURL+"></img>");
    $shadow.css({
        'position': 'absolute',
        'height': 1000,
        'width': 1000,
        'top': 0,
        'left': 0,
        'z-index': 0
    });
    $('body').append($shadow);
    $shadow.hide();

    // 이미지(다이얼로그 밖)를 클릭할 때의 이벤트
    $shadow.click(function (event) {
        hide_search_dialog();
    });
}

