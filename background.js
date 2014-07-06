/// <reference path="header.js" />


chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
	    if (request == REQ_OPEN_NEW_PAGE) {
	        var dictionaryCode = getDicCodeByURL(sender.tab.url);
	        // 새로 열린 페이지에 해당하는 dicCode 를 전송

            // ozdic 은 url 에서 검색어를 판별해야 한다.
	        if (dictionaryCode == DIC_OZDIC) {
	            var currentSearchWord = getSearchWordByOzdicURL(sender.tab.url);
	            sendResponse({ dicCode: dictionaryCode, search_word: currentSearchWord });
	        }
	        else
	            sendResponse({ dicCode: dictionaryCode });
	    }
		else if (request.code == DIC_NAVER_ENEN_NEW){
			chrome.tabs.create({url:"http://endic.naver.com/", active:false});
		}
		else if (request.code == DIC_OZDIC){
			chrome.tabs.create({url:"http://www.ozdic.com/", active:false});
		}
		else if (request.code == DIC_TEHSAURUS){
			chrome.tabs.create({url:"http://thesaurus.com/", active:false});
		}
		
		/* The chrome.runtime.onMessage listener must return true
		   if you want to send a response after the listener returns */
		return true;
	});


function getDicCodeByURL(url) {
    if (/endic\.naver\.com/.test(url))
        return DIC_NAVER_NEW;
    else if(/endic2009\.naver\.com/.test(url))
        return DIC_NAVER_KREN_OLD;
    else if (/eedic2009\.naver\.com/.test(url))
        return DIC_NAVER_ENEN_OLD;
    else if (/ozdic\.com/.test(url))
        return DIC_OZDIC;
    else if (/thesaurus\.com/.test(url))
        return DIC_TEHSAURUS;
}


function getSearchWordByOzdicURL(url) {
    var arr = url.split("\/");
    return arr[arr.length - 1];
}


var tabList = new function () {
    var windows = [];

    this.getTab = function (windowId) {

    }

    this.addWindow = function () {

    }
}
