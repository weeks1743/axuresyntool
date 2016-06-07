'use strict';

function $(selector) {
  return document.querySelector(selector);
}

function intAll () {

   var arr = [];
   arr["zentaoSynUrl"] = "zentaoSynUrl";
   arr["zentaoUrl"] = "zentaoUrl";
   arr["zentaoAccount"] = "zentaoAccount";

   var zentaoSynUrl = $('#zentaoSynUrl');
   var zentaoUrl = $('#zentaoUrl');
   var zentaoAccount = $('#zentaoAccount');

    chrome.storage.local.get(i, function(obj) {
        zentaoSynUrl.value = obj.zentaoSynUrl || '';
        zentaoUrl.value = obj.zentaoUrl || '';
        zentaoAccount.value = obj.zentaoAccount || '';

        //console.log(obj.groups)
        //console.log("groups",JSON.parse(obj.groups));
    });


   var myobj = {};

   for (var i in arr) {
      myobj[i] = arr[i];
      var tempDiv = $('#'+i);   

      chrome.storage.local.get(i, function(obj) {
        tempDiv.value = obj[myobj[i]] || '';
      });

      tempDiv.addEventListener('change', function() {
        var tempID = this.id;
        var tempValue = this.value;
        var option = new Array();
        option[tempID] = tempValue;

        var json = JSON.parse("{\""+tempID+"\":\""+tempValue+"\"}");

        chrome.storage.local.set(json);
      });

   }

  }

window.addEventListener('load', function() {
  intAll();
});
