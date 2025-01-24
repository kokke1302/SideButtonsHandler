let nowTabInfo, tabsInfo;

export function newTabDo(data){
	let obj = {};
	if(data.url != null) obj.url = data.url;
	if(data.forcas==false) obj.active = false;
	switch(data.next){
		case "top": obj.index = 0;break;
		case "btm": obj.index = tabsInfo.length;break;
		case "up": obj.index = nowTabInfo.index;break;
		case "dwn": obj.index = nowTabInfo.index +1;break;
	}
	chrome.tabs.create(obj);
}

export function delTabDo(data){
	if(data.pinmo==true || nowTabInfo.pinned==false) chrome.tabs.remove(nowTabInfo.id);
	let obj = {};
	if(data.next == "up") obj.tabs = nowTabInfo.index -1;
	if(data.next == "dwn") obj.tabs = nowTabInfo.index +1;
	if(data.next != "last") chrome.tabs.highlight(obj);
}

export function upTabDo(data){
	if(data.cicle==false){
		if(nowTabInfo.index!=0) chrome.tabs.highlight({tabs: nowTabInfo.index-1});
	}else{
		if(nowTabInfo.index==0) chrome.tabs.highlight({tabs: tabsInfo.length-1});
		chrome.tabs.highlight({tabs: nowTabInfo.index-1});
	}
}

export function dwnTabDo(data){
	if(data.cicle==false){
		if(nowTabInfo.index != tabsInfo.length-1) chrome.tabs.highlight({tabs: nowTabInfo.index+1});
	}else{
		if(nowTabInfo.index == tabsInfo.length-1) chrome.tabs.highlight({tabs: 0});
		else chrome.tabs.highlight({tabs: nowTabInfo.index+1});
	}
}

async function nowTab(tab) {
	nowTabInfo = await chrome.tabs.get(tab.tabId);
	tabsInfo = await chrome.tabs.query({}, (tabs)=>{
		tabsInfo = tabs;
	})
}

chrome.tabs.onActivated.addListener(nowTab);