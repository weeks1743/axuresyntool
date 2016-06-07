// 需求清单
var require_list = [];
// 需求描述
var require_info_list = [];
// axure地址
var page_url = '';

// 群组ID、名称
var yzj_group_gid=[];
var yzj_group_gname=[];

// 群组内的人员、昵称
var yzj_group_uid=[];
var yzj_group_uname=[];

// 云之家群组local.storage对象
var gggg = null;

// 禅道同步地址
var zentaoSynUrl='';
// 禅道地址
var zentaoUrl='';
// 禅道账号
var zentaoAccount='';

// 监听事件
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
  
	// console.log(request.require_list);
	// console.log(request.page_url);
	// console.log(request.groups);

	try{ 
		require_list = request.require_list;
		page_url = request.page_url;
		require_info_list = request.require_info_list;
		chrome.storage.local.set({"groups": request.groups});
	} 
	catch (e){ 
		console.log(e.message);
		console.log(e.description);
		console.log(e.number);
		console.log(e.name);
	}

	console.log("接收消息完毕.......");
  
	chrome.storage.local.get('groups', function(obj){
		gggg = obj.groups;
	})

	chrome.storage.local.get('zentaoSynUrl', function(obj){
		zentaoSynUrl = obj.zentaoSynUrl;
	})

	chrome.storage.local.get('zentaoUrl', function(obj){
		zentaoUrl = obj.zentaoUrl;
	})

	chrome.storage.local.get('zentaoAccount', function(obj){
		zentaoAccount = obj.zentaoAccount;
	})

});