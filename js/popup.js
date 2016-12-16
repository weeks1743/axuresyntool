// 群组ID、名称
yzj_group_gid=[];
yzj_group_gname=[];

// 群组内的人员、昵称
yzj_group_uid=[];
yzj_group_uname=[];

// 产品ID、名称
cd_product_id=[];
cd_product_name=[];

// 计划ID、计划名称
cd_product_plan_id=[];
cd_product_plan_name=[];

// 需求描述
require_info_list = [];

// 禅道同步地址
zentaoSynUrl='';
// 禅道地址
zentaoUrl='';
// 禅道账号
zentaoAccount='';
// 禅道版本
zentaoVersion='';
// axure网页内的url字段
page_url = '';
//换行TAG
brTAG = "UNKWEEKSTUBASHUX";

// 全局异常标示
tagError = false;

// 消息框提示语
var messageContentStr = "....输入消息可以同步到云之家讨论组";

// 用户历史行为记录ID
var my_product_id = "";
var my_plan_id = "";
var my_groups_id = "";

//得到产品信息
function getProduct(callback) {
    $.ajax({
        type: 'GET',
        url: zentaoSynUrl+'getProductPlan',
        success: function(data) {
        	//console.log('data'+data)
        	data = JSON.parse(data);
            cd_product_id = data.var_cd_product_id;
            cd_product_name = data.var_cd_product_name;
            cd_product_plan_id = data.var_cd_product_plan_id;
            cd_product_plan_name = data.var_cd_product_plan_name;

            if(cd_product_id.length == 0){
            	toastr.error('获取禅道产品信息异常，请检查地址！',"错误");
            	tagError=true;
            }

            callback();
        },
        error: function(err) {
            console.log(err.message);
            toastr.error('调用禅道同步服务异常，请重试!',"错误");
            tagError=true;
        }
    })
}

//-----------------------------------------

// 页面装载完毕
document.addEventListener('DOMContentLoaded', function () {
	//取background.js内的相关参数
	var require_list = chrome.extension.getBackgroundPage().require_list;
	page_url = chrome.extension.getBackgroundPage().page_url;
	require_info_list = chrome.extension.getBackgroundPage().require_info_list;
	gggg = chrome.extension.getBackgroundPage().gggg;

	zentaoSynUrl=chrome.extension.getBackgroundPage().zentaoSynUrl;
	zentaoUrl=chrome.extension.getBackgroundPage().zentaoUrl;
	zentaoAccount=chrome.extension.getBackgroundPage().zentaoAccount;
	zentaoVersion=chrome.extension.getBackgroundPage().zentaoVersion;

	my_product_id = chrome.extension.getBackgroundPage().my_product_id;
	my_plan_id = chrome.extension.getBackgroundPage().my_plan_id;
	my_groups_id = chrome.extension.getBackgroundPage().my_groups_id;

	//error、info、warning、success
	toastr.options.positionClass = 'toast-top-full-width';
	toastr.options.extendedTimeOut = 0; //1000;
	toastr.options.timeOut = 6000;
	toastr.options.fadeOut = 250;
	toastr.options.fadeIn = 250;

	if(typeof zentaoSynUrl == 'undefined' || typeof zentaoUrl == 'undefined' || typeof zentaoAccount == 'undefined' || typeof zentaoVersion == 'undefined'){
		toastr.error('未配置禅道服务参数，请点击选项按钮进行设置!',"错误")
		tagError = true;
		return;
	}

	if(!(zentaoVersion=='6.x' || zentaoVersion=='8.x')){
		toastr.error('禅道版本不合法，支持6.x或8.x!',"错误")
		tagError = true;
		return;
	}

	if(typeof zentaoAccount == 'undefined' || zentaoAccount.length == 0){
		toastr.error('未读取到禅道账号参数，请点击选项按钮进行设置',"错误");
		tagError = true;
		return;
	}

	if(typeof gggg == 'undefined' || gggg.length == 0){
		toastr.error('未读取到云之家参数，请登陆到云之家并点击记住我',"错误");
		tagError = true;
		return;
	}

	if(typeof page_url == 'undefined' || page_url ==''){
		toastr.error('Axure未配置当前页面配置地址，请检查',"错误");
		tagError = true;
		return;
	}

	if(typeof require_list == 'undefined' || require_list.length ==0){
		toastr.error('未抓取到需求列表，请检查Axure内是否使用需求卡片|或刷新页面进行',"错误");
		tagError = true;
		return;	
	}

	var groupArr = JSON.parse(gggg);
    groupArr.forEach(function(item, idx){
        yzj_group_gid.push(item.groupId);
        yzj_group_gname.push(item.groupName);
        yzj_group_uid.push(item.participant[0]);
        yzj_group_uname.push(item.participant[1]);
    });

	//console.log(require_list);
	//console.log(page_url);

	// 需求列表拼接,改为默认不拼接
	for(var i=0;i<require_list.length;i++) {
		$("#requireList_ul").append('<li><input type="checkbox" value="'+require_list[i]+'" name="require_check_name">'+require_list[i]+'</li>')
	}

	initB();

	initC();
});

window.onload=function(){
    getProduct(initA);
};

function initC(){
	$("#messageContent").focus(function(){
		$(this).text("");
	});
	$("#messageContent").blur(function(){
		var val = $(this).text();
		if(val=="" || val == null) $(this).text(messageContentStr);
	});
}

//联动产品、计划
function initA(){
	var product=document.form1.productList;
	var plan=document.form1.planList;

	var selectd_product = 0;
	var selectd_plan= 0;

	for(var i=0;i<cd_product_id.length;i++){
		product.options[i]=new Option(cd_product_name[i],cd_product_id[i]);
	}

	if(typeof my_product_id != 'undefined'){
		if(my_product_id<=cd_product_name.length){
			selectd_product = my_product_id;
			$("#productList").get(0).selectedIndex = selectd_product;
		}
	}

	for(var i=0;i<cd_product_plan_id[selectd_product].length;i++){
		plan.options[i]=new Option(cd_product_plan_name[selectd_product][i],cd_product_plan_id[selectd_product][i]);
	}

	if(typeof my_plan_id != 'undefined'){
		if(my_plan_id<=cd_product_plan_name[selectd_product].length){
			selectd_plan = my_plan_id;
			$("#planList").get(0).selectedIndex = selectd_plan;
		}
	}
	
	// 绑定计划
	product.onchange=function(){
		plan.length=0;
		for(var i=0;i<cd_product_plan_id[this.selectedIndex].length;i++){
			plan.options[i]=new Option(cd_product_plan_name[this.selectedIndex][i],cd_product_plan_id[this.selectedIndex][i]);
		}
	};
}

// 联动群组、人
function initB(){
	var group=document.form1.groupList;
	var who=document.form1.whoList_ul;

	var selectd_groups = 0;

	// 初始所有群组
	for(var i=0;i<yzj_group_gid.length;i++){
		group.options[i]=new Option(yzj_group_gname[i],yzj_group_gid[i]);
	}

	if(typeof my_groups_id != 'undefined'){
		if(my_groups_id<yzj_group_uid.length){
			selectd_groups = my_groups_id;
			$("#groupList").get(0).selectedIndex = selectd_groups;
		}
	}

	// 初始组内成员
	for(var j=0;j<yzj_group_uid[selectd_groups].length;j++){
		$("#whoList_ul").append('<li><input type="checkbox" name="who_check_name" value="' + yzj_group_uid[selectd_groups][j] + '">'+yzj_group_uname[selectd_groups][j]+'</li>')
	}
	
	group.onchange=function(){
		$("#whoList_ul").children('li').remove();
		// 获得选中的index（GROUP）
		for(var i=0;i<yzj_group_uid[this.selectedIndex].length;i++){
			$("#whoList_ul").append('<li><input type="checkbox" name="who_check_name" value="'+yzj_group_uid[this.selectedIndex][i]+'">'+yzj_group_uname[this.selectedIndex][i]+'</li>');
		}
	};
}

// 绑定发送事件
var forceRefreshBtn = document.getElementById("sendMessage");

//发送消息代码
var _getInputLength = function (str) {
    return (str || '').replace(/[^\x00-\xff]/g, "**").length;
};

function sendMessageNew4YZJ(groupID,content,noticePeople) {

	msgLen = _getInputLength(content),

	param = JSON.stringify({
        notifyType: 1,
        notifyTo: noticePeople || [],
        notifyToAll: false
    });

    content = content.toString().replace(/UNKWEEKSTUBASHUX/g,"%0A");

	myPostUrl = "http://yunzhijia.com/im/web/sendMessage.do?groupId="+groupID+"&toUserId=&msgType=2&content="+content+"&msgLen="+msgLen;

    $.ajax({
        method:'POST',
        url:myPostUrl,
        data:param,
        crossDomain: true,
        success:function(data){
           //console.log(data);
        },
        error: function(error) {
        	console.log(error);
            toastr.error('云之家消息发送异常',"错误");
        }
    });
}

function sendMessageNew4ZenTaoSyn(productID,planID,version,account,requireTitle,requireNumber,requDepict) {

	myPostUrl = zentaoSynUrl+"synStory?productID="+productID+"&planID="+planID+"&version="+version+"&account="+account+"&requireTitle="+requireTitle+"&requireNumber="+requireNumber+"&requDepict="+requDepict+"";

	//console.log(myPostUrl);

    $.ajax({
        method:'POST',
        url:myPostUrl,
        success:function(data){
           //console.log(data);
        },
        error: function(error) {
        	console.log(error);
            toastr.error('调用禅道同步服务异常',"错误");
            tagError=true;
        }
    });
}

// 发送消息
forceRefreshBtn.addEventListener('click', function() {

	if(tagError){
		toastr.error('服务异常，请检查配置项是否正确',"错误");
		return;
	}

    var str=document.getElementsByName("require_check_name");
    var objarray=str.length;

    if($('input:checkbox[name=require_check_name]:checked').length == 0){
    	toastr.info('至少要选择一个需求!',"提示");
		return;
    }

    var chestr="";

    chestr+="需求明细：";

    chestr+=brTAG;

    for (i=0;i<objarray;i++)
    {
      if(str[i].checked == true)
      {
       chestr+="   ";
       chestr+=str[i].value;
       chestr+=brTAG;
      }
    }

    chestr+="Axure原型地址";
    chestr+=brTAG;

    chestr+="   ";
    chestr+=page_url;
	chestr+=brTAG;

    chestr+="禅道需求地址";
    chestr+=brTAG;

    // 获取产品ID
    var pid = $("#productList").val();

    chestr+="   ";

    if(zentaoVersion == '6.x'){  //8.x禅道地址
    	chestr+=zentaoUrl+"index.php?m=product&f=browse&productID="+pid;
    }else if(zentaoVersion == '8.x'){  //6.x禅道地址
    	chestr+=zentaoUrl+"product-browse-"+pid+".html";
    }

	chestr+=brTAG;

    //console.log(chestr);

    $('input[name="who_check_name"]:checked').each(function(){
        var v=$(this).val();
        var t=$(this).parent().text();
		chestr+="@"+t+" ";
    });

	chestr+=brTAG;

	var co = $("#messageContent").val();

	if(co==messageContentStr){
		co = '';
	}

	chestr+=co;

	var noticePeople = new Array();

	// 取选中的人
	var spCodesTemp = "";
	$('input:checkbox[name=who_check_name]:checked').each(function(i){
		noticePeople[i] = $(this).val();
	});

	//console.log(chestr);

	//console.log("noticePeople:"+noticePeople);

	if($("#planList").val() == ''){
		toastr.info('未读取到需求所属计划，请检查',"提示");
		return;
	}

	var firstSend = true;

	// 未输入消息时，或者不选择人时，不同步到云之家
	if((co==messageContentStr || co.length==0) && noticePeople.length == 0){
		toastr.info('未输入消息或选择人，只会同步到禅道系统中',"提示");
		firstSend = false;
	}else{
		sendMessageNew4YZJ($('#groupList').val(),encodeURIComponent(chestr),noticePeople);
	}

    for (i=0;i<objarray;i++)
    {
      if(str[i].checked == true)
      {
       	var myRequire = str[i].value;
       	if(!(myRequire.indexOf("[")==0 && myRequire.indexOf("]")>0)){
       		toastr.error('需求：'+myRequire+'不含编号，请检查',"提示");
			return;
       	}
       	var requireNumber = myRequire.substring(myRequire.indexOf("[")+1,myRequire.indexOf("]"));
       	var requDepict = "Axure原型地址：";
       	requDepict+="<br/>";
       	requDepict+="&nbsp;&nbsp;<a href='";
       	requDepict+=page_url;
       	requDepict+="&reqnumber=";
       	requDepict+=requireNumber;
       	requDepict+="' target='_blank'";
       	requDepict+=">";
       	requDepict+=page_url;
       	requDepict+="&reqnumber=";
       	requDepict+=requireNumber;
       	requDepict+="</a>";
       	requDepict+="<br/>";
       	requDepict+="需求描述：";
       	requDepict+="<br/>";
       	requDepict+=require_info_list[i];

		sendMessageNew4ZenTaoSyn($("#productList").val(),$("#planList").val(),zentaoVersion,zentaoAccount,encodeURIComponent(myRequire),encodeURIComponent(requireNumber),encodeURIComponent(requDepict));
      }
    }

    var productListVal = $("#productList").prop('selectedIndex');
    var planListVal = $("#planList").prop('selectedIndex');
    var whoList_ulVal = $("#groupList").prop('selectedIndex');

    var newmsg = {
		my_product_id:productListVal,
		my_plan_id:planListVal,
		my_groups_id:whoList_ulVal
	};

	//console.log(newmsg)

	// 行为记录
	chrome.runtime.sendMessage(newmsg);

    if(firstSend){
    	toastr.success('发送成功!',"提示");
    }

});