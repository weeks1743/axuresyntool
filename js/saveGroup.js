/**
 * Created by reamd on 2016/6/3.
 */
//保存云之家群组列表
(function () {
    var jsArr = ['(function(){',
        'function saveGroup() {',
        'var data = {',
        'offset:0 ,',
        'count: 40,',
        '_: new Date().getTime(),',
        '};',
        '$.ajax({',
        'type: "GET",',
        'url: "http://yunzhijia.com/im/web/updatelistGroup.do?offset=" + data.offset + "&count=" + data.count + "&_=" + data._,',
        'success: function(data){',
        'var groups = JSON.parse(data).list,',
        'newGroups = [];',
        'groups.forEach(function(item, idx){',
        'if(item.type === 2) {',
        'newGroups.push(item);',
        '}',
        '});',
        'var temp = "\<input id=chromeData type=hidden />"\;',
        '$("body").append(temp);',
        '$("#chromeData").val(JSON.stringify(newGroups))',
        //'$("#chromeData").html("10086")',
        '},',
        'error: function(err){console.log("test",err)},',
        '})',
        '}',
        'saveGroup();',
        '}())'];
        
    $('body').append('<script>' + jsArr.join('') + '<\/script>');

    console.log("saveGroup......");

    setTimeout(function() {
        var content = $('#chromeData').val();
        chrome.runtime.sendMessage({"groups": content});
    },5000);
}());
