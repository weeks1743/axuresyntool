//UMD通用接口
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('msgBox', [], function () {
            return factory;
        });
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports.msgBox = factory;

    } else {
        // Browser globals
        root.msgBox = factory;
    }
}(typeof window !== "undefined" ? window : this, function (opt) {
    var newNode = document.createElement('div'),
        newClass = document.createAttribute('class'),
        cntAttr = '',
        h3Node = '',
        closeNode = '',
        cntTitleNode = '',
        cntBodyNode = '',
        btnNode = '',
        _self = this;

    //构造函数的数据结构
    this.width = opt.width || '';
    this.minWidth = opt.minWidth || '0';
    this.maxWidth = opt.maxWidth || '100%';
    this.height = opt.height || '';

    this.title = opt.title || '';
    this.body = opt.body || '';
    this.btnLabel = opt.btnLabel || [];

    this.visible = typeof opt.visible === 'boolean' ? opt.visible : true;
    this.isClose = typeof opt.isClose === 'boolean' ? opt.isClose : true;

    this.openMsg = function () {
        newNode.setAttribute('class', 'ui-dialog show');
    };
    this.closeMsg = function () {
        document.body.removeChild(newNode);
    };

    this.complete = opt.callback || function () {
        };
    this.firstCallback = opt.firstCallback || function () {
        };
    this.secondCallback = opt.secondCallback || function () {
            _self.closeMsg();
        };

    if (this.width) {
        cntAttr = 'style="width:' + this.width + ';min-width:' + this.minWidth + ';max-width:' + this.maxWidth + '"';
        if (this.height) {
            cntAttr = 'style="width:' + this.width + ';min-width:' + this.minWidth + ';max-width:' + this.maxWidth + ';height:' + this.height + '"';
        }
    } else if (this.height) {
        cntAttr = 'style="height:' + this.height + '"';
    }
    if(this.title === '') {
        h3Node = '<h3>&nbsp;</h3>';
    }else {
        h3Node = '<h3>' + this.title + '</h3>';
    }
    cntBodyNode = '<div>' + this.body + '</div>';

    if (this.isClose) {
        closeNode = '<span class="ui-dialog-close" onFocus="this.blur()"></span>';
    }
    if (Object.prototype.toString.call(this.btnLabel) === "[object Array]") {
        if (this.btnLabel.length === 1) {
            btnNode = '<button class="save alone" onFocus="this.blur()">' + this.btnLabel[0] + '</button>';
        } else if (this.btnLabel.length > 1) {
            btnNode = '<button class="save" onFocus="this.blur()">' + this.btnLabel[0] + '</button>' +
                '<button class="cancel" onFocus="this.blur()">' + this.btnLabel[1] + '</button>';
        }
    }

    if (this.visible) {
        newClass.value = 'ui-dialog show';
    } else {
        newClass.value = 'ui-dialog';
    }
    newNode.setAttributeNode(newClass);
    newNode.innerHTML = '<div class="ui-dialog-cnt" ' + cntAttr + '>' +
        '<div class="ui-dialog-hd">' +
        h3Node + closeNode +
        '</div>' +
        '<div class="ui-dialog-bd">' +
        cntTitleNode + cntBodyNode +
        '</div>' +
        '<div class="ui-dialog-ft">' +
        btnNode +
        '</div>' +
        '</div>';
    document.body.insertBefore(newNode, document.body.firstChild);
    //获取弹窗高度，然后设置margin-top
    if (!!newNode.firstChild.getAttribute('style')) {
        newNode.firstChild.setAttribute('style', newNode.firstChild.getAttribute('style') + ';margin-top:-' + newNode.firstChild.offsetHeight / 2 + 'px');
    } else {
        newNode.firstChild.setAttribute('style', 'margin-top:-' + newNode.firstChild.offsetHeight / 2 + 'px');
    }
    setTimeout(this.complete, 0);
    setTimeout(function () {
        if (_self.isClose) {
            newNode.firstChild.firstChild.lastChild.addEventListener('click', function () {
                _self.closeMsg();
            }, false);
        }
        if (_self.btnLabel.length === 1) {
            newNode.firstChild.childNodes[2].firstChild.addEventListener('click', _self.firstCallback, false);
        } else if (_self.btnLabel.length > 1) {
            newNode.firstChild.childNodes[2].firstChild.addEventListener('click', _self.firstCallback, false);
            newNode.firstChild.childNodes[2].lastChild.addEventListener('click', _self.secondCallback, false);
        }
    }, 0);
}));