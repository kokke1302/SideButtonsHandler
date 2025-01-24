import {newTabDo, delTabDo, upTabDo, dwnTabDo} from "/back/comand.js";

let setting;

async function clicked(re){
	let action = "";
	if(re.one==0 && re.two==2) action = "newTab";
	if(re.one==2 && re.two==0) action = "delTab";
	if(re.one==2 && re.two==-2) action = "upTab";
	if(re.one==2 && re.two==-3) action = "dwnTab";
	let eve = new CustomEvent(action, {detail: setting});
	dispatchEvent(eve);
}

// イベントリスナー
chrome.runtime.onMessage.addListener(clicked);

addEventListener("newTab", (e)=>{newTabDo(e.detail.newTab)});
addEventListener("delTab", (e)=>{delTabDo(e.detail.delTab)});
addEventListener("upTab", (e)=>{upTabDo(e.detail.upTab)});
addEventListener("dwnTab", (e)=>{dwnTabDo(e.detail.dwnTab)});

// 拡張機能をインストールした時に１度だけ実行
chrome.runtime.onInstalled.addListener((e)=>{
	chrome.storage.local.clear();
	// 初期設定をjsに読み込ませる
	fetch(chrome.runtime.getURL("default.json"))
	.then(async (re)=>{
		setting = await re.json();
		chrome.storage.local.set(setting);
		// chrome.tabs.query({}, (tabs)=>{
		// 	for (const tab of tabs) chrome.tabs.reload(tab.id);
		// })
	})
	.catch((err)=>{
		console.error("fetch err");
	})
})