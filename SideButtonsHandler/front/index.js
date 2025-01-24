class Hold{
	mae = -1;
	ima = -1;

	actionFg(now){
		this.ima = now;
		if(this.mae != -1){ //同時押し 前がホイールではない
			this.actionJudg();
		}else{ // 初回押し込
			this.mae = this.ima;
		}
	}

	actionJudg(){
		console.log("%d, %d", this.mae, this.ima);
		if(this.mae == this.ima && (this.mae == -2 || this.mae == -3)) this.mae = 2;// 連続スクロール
		chrome.runtime.sendMessage({one: this.mae, two: this.ima});
		this.mae = -1;
		this.ima = -1;
	}

	mount(){
		// イベントリスナー 発火待機
		document.addEventListener("mousedown", (e)=>{
			this.actionFg(e.button);
		});
		document.addEventListener("wheel", (e)=>{
			if(e.deltaY < 0) this.actionFg(-2);
			else this.actionFg(-3);
		});
		document.addEventListener("mouseup", (e)=>{
			this.mae = -1;
			this.ima = -1;
		});
	}
}

class DbRight{
	constructor(term){
		this.term = term;
	}
	fg = 0;
	time = 0;

	timer(){
		try{ // 初回起動 タイムアウト時
			if(this.time==1) throw true; // ダブルクリック判定
			this.time = 1;
			this.fg = 0;
			setTimeout(()=>{
				this.time = 0;
				this.downLisner();
			}, this.term);
		} catch { // ダブルクリック時
			this.time = 0;
			this.fg = 1;
			this.downLisner();
		}
	}

	downLisner(){
		if(this.fg==0){ // トリガーロック 実行不可 通常時
			document.addEventListener("contextmenu", this.canceler);
			this.fg = 0;
		}else{ // トリガー解除 実行可能
			document.removeEventListener("contextmenu", this.canceler); // 外れない
			this.fg = 0;
		}
	}

	// 通常右クリックを無効化
	canceler(e){
		e.preventDefault();
	}

	mount(){
		// イベントリスナー 発火待機
		document.addEventListener("contextmenu", (e)=>{
			if(e.button == 2) this.timer();
		});
		// 初期動作
		this.downLisner();
	}
}

// 初回実行関数
chrome.storage.local.get((setting)=>{
	if (setting.dbRight.onoff){
		const dbright = new DbRight(setting.dbRight.term);
		dbright.mount();
	}
	const hold = new Hold;
	hold.mount();
})

