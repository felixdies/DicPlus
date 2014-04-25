var curUrl;	// 현재 페이지의 주소

function lg(object){
	console.log(object);
}

/** original shortcur keys(Alt) of Chrome
  * Alt + D, E, F
  * Alt + Shift + T
  */

chrome.extension.sendMessage('get_curUrl',function(response) {
		curUrl = response;
		
		if(/endic\.naver\.com/.test(curUrl))
			set_Naver_endic_listener();
		
		else if(/ozdic\.com/.test(curUrl))
			set_Ozdic_listener();
		
		else if(/thesaurus\.com/.test(curUrl))
			set_Thesaurus_listener();
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
				
				// alt + t : 테스트
				case 84:  
					test();
					break; 
			}
		}
	});
}

function set_Ozdic_listener(){
	tab = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	
	// seperate lines
	$("i").each(function(){
		var $html = $(this).html();
		$html = $html.replace(/\.\s+(\w)/g, ".<br/>" + tab + "$1");
		$(this).html($html);
	});
	
	$("p:not(.word)").each(function(){
		var $html = $(this).html();
		
		$html = $html.replace(/<sup>(\s[^1])/g, "<br/><sup>$1");
		$html = $html.replace(/<b>/g, "<br/><b>");
		$html = $html.replace(/\|/g, "");
		$html = $html.replace(/<i>/g, "<br/><i>" + tab);

		$(this).html($html);
		
		$(this).width(700);
	});
	
	$(document).keydown(function(event){
		
		if (event.shiftKey && event.altKey){
		}
		
		else if (event.shiftKey){
			switch(event.keyCode)
			{
				// shift + 1,2,3,4,5	: n 번째 단어 선택
				case 49: case 50: case 51: case 52: case 53: 
					var num = event.keyCode - 49;	// charcode(49)="1"
					var $list = $(document).find('dl.list_e2').first();
					var $words = $list.find('dt').children('.fnt_e30');
					
					$words.eq(num).children().children().trigger('click');
					event.preventDefault();
					
					break;
			}
		}
		
		else if (event.altKey){
			switch(event.keyCode)
			{
				// alt + t : 테스트
				case 84:  
					test();
					break; 
			}
		}
		
		else if (event.ctrlKey) {
		}
		
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
	$(document).find('div.banner').each(function(){
			$(this).hide();
		});
	$(document).find('section.promo-top').css("min-height", "1px");
	
	$(document).keydown(function(event){
		if (event.shiftKey){
			switch(event.keyCode)
			{
				// shift + 1,2,3,4,5	: n 번째 단어 선택
				case 49: case 50: case 51: case 52: case 53: 
					var num = event.keyCode - 49;	// charcode(49)="1"
					var $list = $(document).find('dl.list_e2').first();
					var $words = $list.find('dt').children('.fnt_e30');
					
					$words.eq(num).children().children().trigger('click');
					event.preventDefault();
					
					break;
			}
		}
		
		else if (event.altKey){
			switch(event.keyCode)
			{
				// alt + t : 테스트
				case 84:  
					test();
					break; 
			}
		}
		
		else if (event.ctrlKey) {
		}
		
		else {	// alt, ctrl, or shift key is not pressed.
		
			// arrow, page up/down, home, end keys
			if (!(event.keyCode > 32 && event.keyCode < 41))	
				// move to the input textfield
				$(document).find('input#q').focus();
		}
	});
}

function test() {
	lg("test");
}