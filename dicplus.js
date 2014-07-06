/// <reference path="header.js" />

/** original shortcur keys(Alt) of Chrome
  * Alt + D, E, F
  * Alt + Shift + T
  */

var curDicCode; // 현재 사전
var curSearchWord; // 현재 검색 단어
var $searchField; // 검색란


chrome.runtime.sendMessage(REQ_OPEN_NEW_PAGE, function (response) {
    switch (response.dicCode) {
        case DIC_NAVER_NEW:
            set_Naver_new_listener();
            break;

        case DIC_NAVER_KREN_OLD:
            break;

        case DIC_NAVER_ENEN_OLD:
            break;

        case DIC_OZDIC:
            $searchField = $(document).find('form#search').children('[type=text]');

            // ozdic 은 검색란에 검색 단어를 입력 해 준다.
            curSearchWord = response.search_word;
            $searchField.val(curSearchWord);
            $searchField.select();

            set_Ozdic_listener();
            break;

        case DIC_TEHSAURUS:
            $searchField = $(document).find('input#q');

            set_Thesaurus_listener();
            break;
    }

    set_common_listener();

    create_shadow();
    create_search_dialog();
});


function set_Naver_new_listener(){
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
			$(this).html($html);
		});
	});
	
	$(document).keydown(function(event){
	    if (event.shiftKey);
	    else if (event.altKey);
	    else if (event.ctrlKey);

	    else {	// alt, ctrl, or shift key is not pressed.
		    // arrow, page up/down, home, end keys
		    if (!(event.keyCode > 32 && event.keyCode < 41))
		        // move to the input textfield
		        $searchField.focus();
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
	    if (event.shiftKey);
	    else if (event.altKey);
	    else if (event.ctrlKey);

	    else {	// alt, ctrl, or shift key is not pressed.
			// arrow, page up/down, home, end keys
			if (!(event.keyCode > 32 && event.keyCode < 41))	
				// move to the input textfield
				$searchField.focus();
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
    $dialog = $("<div id='dpSearchDialog' style='position: absolute; width: 300px; height: 200px; z-index: 0; border: 1px solid lightgray; font-size: 13px; padding: 6px; background-color: white; z-index: 100000'> <div style='text-align:center; font-size: 17px; font-weight: bold; text-shadow: 1px 1px silver'>사전 검색</div> <hr style='display:block; margin:5px;'> <div style='text-align:left; margin-bottom: 10px'><span><b>검색할 단어</b></span> <input type='text' id='dpInputSearch'> </div> <div style='text-align:left; margin-bottom: 10px;'>shift + 1 : 네이버 한영사전(new) 검색<br> shift + 2 : 네이버 영영사전(new) 검색<br> shift + 3 : 네이버 한영사전(old) 검색<br> shift + 4 : 네이버 영영사전(old) 검색<br> shift + 5 : ozdic.com(연어) 검색<br> shift + 6 : thesaurus.com(동의어/유의어) 검색<br> </div> <div style='text-align:right;'> <button type='button' id='dpBtnCancleSearch' style=''> 취소(Esc) </button> </div> </div> ");
    $('body').append($dialog);
    $dialog.hide();

    /* 취소 버튼 */
    $('#dpBtnCancleSearch').click(function (event) {
        hide_search_dialog();
    });

    /* 입력란 */
    $('#dpInputSearch').keydown(function (event) {
        if (event.shiftKey) {
            var dicCode=0;
            event.stopPropagation();
            
            switch (event.keyCode) {
                // shift + 1 : 네이버 한영사전(new)
                case 49:
                    dicCode = DIC_NAVER_KREN_NEW;
                    break;
                // shift + 2 : 네이버 영영사전(new)
                case 50:
                    dicCode = DIC_NAVER_ENEN_NEW;
                    break;
                // shift + 3 : 네이버 한영사전(old)
                case 51:
                    dicCode = DIC_NAVER_KREN_OLD;
                    break;
                // shift + 4 : 네이버 영영사전(old)
                case 52:
                    dicCode = DIC_NAVER_ENEN_OLD
                    break;
                // shift + 5 : ozdic
                case 53:
                    dicCode = DIC_OZDIC;
                    break;
                // shift + 6 : thesaurus
                case 54:
                    dicCode = DIC_TEHSAURUS;
                    break;
            }

            if (dicCode) {
                search_word($('#dpInputSearch').val(), dicCode);
                hide_search_dialog();
            }
        }
        else {
            if (event.keyCode == 27) { // esc
                hide_search_dialog();
            }
            event.stopPropagation();
        }
    });
}

function search_word(word, dicCode) {
    lg("word : " + word + "  dicCode : " + dicCode);
}


function show_search_dialog() {
    var $shadow = $('#dpShadow');
    var $dialog = $('#dpSearchDialog');
    
    $shadow.css({
        'height': '100%',
        'width': '100%'
    });
    $shadow.show();

    $dialog.css({
        'top': '40%',
        'left': '40%'
    });
    $dialog.show();

    $('#dpInputSearch').focus();
}


function hide_search_dialog() {
    $('#dpShadow').hide();
    $('#dpSearchDialog').hide();
}


function create_shadow() {
    var $shadow;
    var imgURL = chrome.extension.getURL("semi_transparent.png");

    $shadow = $("<img id='dpShadow' src="+imgURL+"></img>");
    $shadow.css({
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'z-index': 99999
    });
    $('body').append($shadow);
    $shadow.hide();

    // 이미지(다이얼로그 밖)를 클릭할 때의 이벤트
    $shadow.click(function (event) {
        hide_search_dialog();
    });
}

