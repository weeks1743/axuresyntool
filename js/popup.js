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
// axure网页内的url字段
page_url = '';
//换行TAG
brTAG = "UNKWEEKSTUBASHUX";

// 全局异常标示
tagError = false;

// 消息框提示语
var messageContentStr = "....输入消息可以同步到云之家讨论组";

//得到产品信息
function getProduct(callback) {
    $.ajax({
        type: 'GET',
        url: zentaoSynUrl+'getProductPlan',
        success: function(data) {
        	console.log('data'+data)
        	data = JSON.parse(data);
            cd_product_id = data.var_cd_product_id;
            cd_product_name = data.var_cd_product_name;
            cd_product_plan_id = data.var_cd_product_plan_id;
            cd_product_plan_name = data.var_cd_product_plan_name;

            if(cd_product_id.length == 0){
            	myMsgBox('获取禅道产品信息异常，请检查地址！');
            	tagError=true;
            }

            callback();
        },
        error: function(err) {
            console.log(err.message);
            myMsgBox('调用禅道同步服务异常');
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

	if(typeof zentaoSynUrl === 'undefined' || typeof zentaoUrl === 'undefined' || typeof zentaoAccount === 'undefined'){
		myMsgBox('未配置禅道服务参数，请点击选项按钮进行设置');
		tagError = true;
		return;
	}

	if(typeof zentaoAccount == 'undefined' || zentaoAccount.length == 0){
		myMsgBox('未读取到禅道账号参数，请点击选项按钮进行设置');
		tagError = true;
		return;
	}

	if(typeof gggg == 'undefined' || gggg.length == 0){
		myMsgBox('未读取到云之家参数，请登陆到云之家并点击记住我');
		tagError = true;
		return;
	}

	if(typeof page_url == 'undefined' || page_url ==''){
		myMsgBox('Axure未配置当前页面配置地址，请检查');
		tagError = true;
		return;
	}

	if(typeof require_list == 'undefined' || require_list.length ==0){
		myMsgBox('未抓取到需求列表，请检查Axure内是否使用需求卡片|或刷新页面进行');
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

	// 需求列表拼接
	for(var i=0;i<require_list.length;i++) {
		$("#requireList_ul").append('<li><input checked="checked" type="checkbox" value="'+require_list[i]+'" name="require_check_name">'+require_list[i]+'</li>')
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

	for(var i=0;i<cd_product_id.length;i++){
		product.options[i]=new Option(cd_product_name[i],cd_product_id[i]);
	}
	for(var i=0;i<cd_product_plan_id.length;i++){
		plan.options[i]=new Option(cd_product_plan_name[0][i],cd_product_plan_id[0][i]);
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

	// 初始所有群组
	for(var i=0;i<yzj_group_gid.length;i++){
		group.options[i]=new Option(yzj_group_gname[i],yzj_group_gid[i]);
	}

	// 初始组内成员
	for(var j=0;j<yzj_group_uid[0].length;j++){
		$("#whoList_ul").append('<li><input type="checkbox" name="who_check_name" value="' + yzj_group_uid[0][j] + '">'+yzj_group_uname[0][j]+'</li>')
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
           console.log(data);
        },
        error: function(error) {
        	console.log(error);
            myMsgBox('云之家消息发送异常');
        }
    });
}

function sendMessageNew4ZenTaoSyn(productID,planID,account,requireTitle,requireNumber,requDepict) {

	myPostUrl = zentaoSynUrl+"synStory?productID="+productID+"&planID="+planID+"&account="+account+"&requireTitle="+requireTitle+"&requireNumber="+requireNumber+"&requDepict="+requDepict+"";

	console.log(myPostUrl);

    $.ajax({
        method:'POST',
        url:myPostUrl,
        success:function(data){
           console.log(data);
        },
        error: function(error) {
        	console.log(error);
            myMsgBox('调用禅道同步服务异常');
            tagError=true;
        }
    });
}

function myMsgBox(alertContent){
	var v = new msgBox({
	    width: '200px',    //设置弹窗的宽度，不设置的话默认由弹窗内容决定
	    minWidth: '100px', //设置弹窗的最小宽度，默认0
	    maxWidth: '300px', //设置弹窗的最大宽度，默认100%
	    height: '',       //设置弹窗的高度，不设置的话默认由弹窗内容决定
	    title: '提示',  //设置弹窗边框的标题 默认为空
	    body: '<div style="color:red;">'+alertContent+'</div>', //设置弹窗内容，可由html模板组成 默认为空
	    btnLabel: ['确定'], //设置弹窗底部按钮标题,数组形式，个数最多两个 默认为空
	    visible: true,    //设置弹窗初始化时是否显示，默认为true
	    isClose: true,    //设置弹窗是否显示右上角的关闭功能，默认为true
	    complete: function() {}, //设置弹窗初始化完成后运行的回调函数，默认为空函数
	    firstCallback: function() {v.closeMsg()}, //设置弹窗底部按钮一回调函数，默认为空函数
	    secondCallback: function() {} //设置弹窗底部按钮二回调函数，默认为关闭弹窗功能的函数
	});
}

// 发送消息
forceRefreshBtn.addEventListener('click', function() {

	if(tagError){
		myMsgBox('服务异常，请检查配置项是否正确');
		return;
	}

    var str=document.getElementsByName("require_check_name");
    var objarray=str.length;
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
	chestr+=zentaoUrl+"product-browse-"+pid+".html";
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
		myMsgBox('未读取到需求所属计划，请检查');
		return;
	}

	var firstSend = true;

	// 未输入消息时，或者不选择人时，不同步到云之家
	if((co==messageContentStr || co.length==0) && noticePeople.length == 0){
		myMsgBox('未输入消息或选择人，消息不会同步到云之家，只会同步到禅道系统中');
		firstSend = false;
	}else{
		sendMessageNew4YZJ($('#groupList').val(),encodeURIComponent(chestr),noticePeople);
	}

    for (i=0;i<objarray;i++)
    {
      if(str[i].checked == true)
      {
       	var myRequire = str[i].value;
       	var requireNumber = myRequire.substring(myRequire.indexOf("[")+1,myRequire.indexOf("]"));
       	var requDepict = "Axure原型地址：";
       	requDepict+="<br/>";
       	requDepict+="&nbsp;&nbsp;<a href='";
       	requDepict+=page_url;
       	requDepict+="' target='_blank'";
       	requDepict+=">";
       	requDepict+=page_url;
       	requDepict+="</a>";
       	requDepict+="<br/>";
       	requDepict+="需求描述：";
       	requDepict+="<br/>";
       	requDepict+=require_info_list[i];

		sendMessageNew4ZenTaoSyn($("#productList").val(),$("#planList").val(),zentaoAccount,encodeURIComponent(myRequire),encodeURIComponent(requireNumber),encodeURIComponent(requDepict));
      }
    }

    if(firstSend){
    	myMsgBox('发送成功!');
    }

});