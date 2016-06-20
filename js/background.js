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

// 用户历史行为记录ID
var my_product_id='';
var my_plan_id='';
var my_groups_id='';

// 监听事件
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
  
	// console.log(request.require_list);
	// console.log(request.page_url);
	// console.log(request.groups);

	try{
		if(typeof request.require_list != 'undefined' ){
			require_list = request.require_list;
		}

		if(typeof request.page_url != 'undefined' ){
			page_url = request.page_url;
		}

		if(typeof request.require_info_list != 'undefined' ){
			require_info_list = request.require_info_list;
		}

		if(typeof request.groups != 'undefined' ){
			chrome.storage.local.set({"groups": request.groups});
		}

		if(typeof request.my_product_id != 'undefined' ){
			chrome.storage.local.set({"my_product_id": request.my_product_id});
		}

		if(typeof request.my_plan_id != 'undefined' ){
			chrome.storage.local.set({"my_plan_id": request.my_plan_id});
		}

		if(typeof request.my_groups_id != 'undefined' ){
			chrome.storage.local.set({"my_groups_id": request.my_groups_id});
		}
	} 
	catch (e){ 
		console.log(e.message);
		console.log(e.description);
		console.log(e.number);
		console.log(e.name);
		// 异常全部置为空
		// require_list = [];
		// require_info_list = [];
		// page_url = '';
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

	chrome.storage.local.get('my_product_id', function(obj){
		my_product_id = obj.my_product_id;
	})

	chrome.storage.local.get('my_plan_id', function(obj){
		my_plan_id = obj.my_plan_id;
	})

	chrome.storage.local.get('my_groups_id', function(obj){
		my_groups_id = obj.my_groups_id;
	})

});