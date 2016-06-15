'use strict';

$(function(){
    $("#mainFrame").on("load",function(){

    	// 取Axure内的所有div
        var list = document.getElementById("mainFrame").contentDocument.getElementsByTagName("div");

		// 筛选内容： data-label="需求卡片-内容"  | 需求卡片-标题
		var aDiv=getElementByAttr(list,'data-label','需求卡片-标题');

		//console.log('aDiv:'+aDiv);

		// 筛选后的标题数组
		var result = [];

		for(var i=0;i<aDiv.length;i++) {
			var b=aDiv[i].getElementsByTagName("span");
			result.push(b[0].innerHTML);
		}

		// 当未获取到要得到的信息则，发送置空消息
		// 构建发送给background.js的内容

		if(typeof aDiv[0] == 'undefined'){
			sendnullmsg();
			return;
		}

		// 筛选内容： data-label="需求卡片-内容"  | 需求卡片-标题
		var CDiv=getElementByAttr(list,'data-label','需求卡片-内容');

		//console.log('CDiv:'+CDiv);

		// 筛选后的标题数组
		var result3 = [];

		for(var i=0;i<CDiv.length;i++) {
			var b=CDiv[i].getElementsByTagName("span");
			var remark = "";
			for(var k=0;k<b.length;k++){
				remark += "&nbsp;&nbsp;";
				remark += b[k].innerHTML+"<br/>";
			}
			result3.push(remark);
		}

		//console.log(result3);


		// 同上取，当前页面地址字段
		var bDiv=getElementByAttr(list,'data-label','当前页面地址');

		if(typeof bDiv[0] == 'undefined'){
			sendnullmsg();
			return;
		}

		console.log('bDiv:'+bDiv);

		var result2 = '';
		
		var bb=bDiv[0].getElementsByTagName("span");
		result2 = bb[0].innerHTML;

		// 构建发送给background.js的内容
		var msg2 = {
			page_url:result2,
			require_list:result,
			require_info_list:result3
		};

		// 发送
		chrome.runtime.sendMessage(msg2);

    });
});

function sendnullmsg(){
	var nullmsg = {
		page_url:'',
		require_list:[],
		require_info_list:[]
	};

	// 发送
	chrome.runtime.sendMessage(nullmsg);
}

// 内容筛选|取标签
function getElementByAttr(aElements,attr,value)
{
    var aEle=[];
    for(var i=0;i<aElements.length;i++)
    {
        if(aElements[i].getAttribute(attr)==value)
            aEle.push( aElements[i] );
    }
    return aEle;
}