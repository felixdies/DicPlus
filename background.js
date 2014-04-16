chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request == 'get_curUrl'){
			// 현재 tab 의 아이디를 얻기 위해 query 문 사용
			chrome.tabs.query({active:true, currentWindow:true},function(tab){
				// 현재 tab의 url 을 send
				sendResponse(tab[0].url);	// send a response after the listener returns
			});
		}
		
		/* The chrome.runtime.onMessage listener must return true
		   if you want to send a response after the listener returns */
		return true;
	});