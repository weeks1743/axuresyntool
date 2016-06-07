/**
 * Created by reamd on 2016/6/3.
 */
//保存云之家群组列表
(function () {
    var jsArr = ['(function(){',
        'function saveGroup() {',
        'var data = {',
        'offset:0 ,',
        'count: 10,',
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
        'var temp = "\<div id=chromeData display=none></div>";',
        '$("body").append(temp);',
        '$("#chromeData").html(JSON.stringify(newGroups))',
        //'$("#chromeData").html("10086")',
        '},',
        'error: function(err){console.log("test",err)},',
        '})',
        '}',
        'saveGroup();',
        '}())'];

    $('body').append('<script>' + jsArr.join('') + '<\/script>');
    setTimeout(function() {
        var content = $('#chromeData').html();
        chrome.runtime.sendMessage({"groups": content});
    },6000);
}());
