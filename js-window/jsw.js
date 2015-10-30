/*!
 * Name    : JS Window [JSW]
 * Version : 1.0.0
 * Author  : _nK http://nkdev.info
 * GitHub  : https://github.com/nk-o/js-window
 */
(function () {
    'use strict';

    /*
     * Helpers
     */
    var getElementsByClassName = function (node, classname) {
        if (node.getElementsByClassName) { // use native implementation if available
            return node.getElementsByClassName(classname);
        } else {
            return (function getElementsByClass(searchClass,node) {
                if (node == null) {
                    node = document;
                }
                var classElements = [],
                    els = node.getElementsByTagName("*"),
                    elsLen = els.length,
                    pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

                for (i = 0, j = 0; i < elsLen; i++) {
                    if (pattern.test(els[i].className)) {
                        classElements[j] = els[i];
                        j++;
                    }
                }
                return classElements;
          })(classname, node);
        }
    }

    var css = function (el, css) {
        for (var k in css) {
            el.style[k] = css[k];
        }
    }

    var hasClass = function (o, c) {
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
        return re.test(o.className);
    }

    var addClass = function (o, c){
        if (hasClass(o, c)) return;
        o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }

    var removeClass = function (o, c){
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
        o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }

    var extend = function () {
        for (var i = 1, len = arguments.length; i < len; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    };

    var isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    var isString = function (n) {
        return typeof n === 'string';
    }

    var offset = function (elem) {
        if (elem.getBoundingClientRect) {
            var box = elem.getBoundingClientRect()

            var body = document.body
            var docElem = document.documentElement

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

            var clientTop = docElem.clientTop || body.clientTop || 0
            var clientLeft = docElem.clientLeft || body.clientLeft || 0

            var top  = box.top +  scrollTop - clientTop
            var left = box.left + scrollLeft - clientLeft

            return {
                top: Math.round(top),
                left: Math.round(left)
            }
        } else {
            var top = 0,
                left = 0;

            while (elem) {
                top = top + parseInt(elem.offsetTop)
                left = left + parseInt(elem.offsetLeft)
                elem = elem.offsetParent
            }

            return {
                top: top,
                left: left
            }
        }
    }

    // string to dom
    var s2d_tmp = document.createElement('div');
    var string2dom = function (str) {
        s2d_tmp.innerHTML = str;
        return s2d_tmp.childNodes[0];
    };

    var bind = function (element, event, func) {
        if (element.addEventListener) {
            element.addEventListener(event, func, true);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, func);
        } else {
            element['on' + event] = func;
        }
    };
    var unbind = function (element, event, func) {
        if (element.removeEventListener) {
            element.removeEventListener(event, func, true);
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, func);
        } else {
            element['on' + event] = null; 
        }
    };

    // get current document scroll
    var getDocumentScroll = function () {
        var wnd = {
            left: 0,
            top: 0
        }
        if (typeof window.pageYOffset !== 'undefined') {
            wnd.left = window.pageXOffset;
            wnd.top = window.pageYOffset;
        } else {
            var sx, sy, d = document, r = d.documentElement, b = d.body;
            sx = r.scrollLeft || b.scrollLeft || 0;
            sy = r.scrollTop || b.scrollTop || 0;
            wnd.left = sx;
            wnd.top = sy;
        }
        return wnd;
    }

    // on mouse move
    var mouseMoveList = [];
    var mouseMove = function (func) {
        mouseMoveList.push(func);
        _moveEvt();
    }
    var _moveEvt = function (e) {
        for (var k = 0, len = mouseMoveList.length; k < len; k++) {
            mouseMoveList[k](e);
        }
    }
    bind(document, 'mousemove', _moveEvt);
    bind(document, 'touchmove', _moveEvt);

    // on drag
    var drag = function (elem, start, move, end) {
        var dragstart = 0;
        bind(elem, 'mousedown', function (e) {
            if((e.which || e.button) === 1) {
                dragstart = 1;
            }
        });
        bind(elem, 'touchstart', function (e) {
            dragstart = 1;
            start && start(e);
        });
        bind(document, 'mouseup', function (e) {
            if(dragstart) {
                dragstart === 2 && end && end(e);
                dragstart = 0;
            }
        });
        bind(document, 'touchend', function (e) {
            if(dragstart) {
                dragstart === 2 && end && end(e);
                dragstart = 0;
            }
        });
        mouseMove(function (e) {
            if (dragstart) {
                e = e || window.event; // IE compatibility
                if (e.preventDefault) {  
                    e.preventDefault();  
                } else {  
                    e.returnValue = false;  
                    e.cancelBubble=true;  
                }

                if (dragstart === 1) {
                    dragstart = 2;
                    start && start(e);
                }
                move && move(e);
            }
        });
    }


    /* In this node will be added all windows (added after first window init) */
    var parentNode;

    /*
     * JSW instance
     */
    var JSW = (function () {
        var instanceID = 0;

        function JSW (userOptions) {
            this.defaults   = {
                // window title
                title          : 'Window',

                // window content
                content        : '<p>Content</p>',

                // window initial position and sizes
                position       : 'absolute', // absolute, fixed
                x              : 40,
                y              : 40,
                width          : 500,
                height         : 200,
                minWidth       : 300,
                minHeight      : 100,

                // safe offset (when you drag window out of document it will be visible by safeOutOffset pixels)
                safeOutOffset  : 40,

                // draggable window (apply on .jsw-draggable items)
                draggable      : true,

                // resizable window
                resizable      : true,

                // prevent document scrolling when mouse over JSW
                preventScroll  : false,

                // controls
                controls: {
                    close: {
                        icon: 'jsw-control jsw-control-close',
                        title: 'Close',
                        click: function () {
                            this.hide();
                        }
                    },
                    maximize: {
                        icon: 'jsw-control jsw-control-maximize',
                        title: 'Maximize',
                        click: function () {
                            this.maximize();
                        }
                    },
                    minimize: {
                        icon: 'jsw-control jsw-control-minimize',
                        title: 'Minimize',
                        click: function () {
                            this.minimize();
                        }
                    }
                },

                // string with window template
                template       : [
                    '<div class="jsw jsw-hide jsw-table jsw-mobile-ready">',
                        '<div class="jsw-head jsw-draggable jsw-table-row">',
                            '<div>',
                                '<div class="jsw-controls"></div>',
                                '<div class="jsw-title"></div>',
                                '<div class="jsw-tabs"></div>',
                            '</div>',
                        '</div>',
                        '<div class="jsw-table-row jsw-table-row-scroll">',
                            '<div>',
                                '<div class="jsw-content"></div>',
                            '</div>',
                        '</div>',
                    '</div>'
                ].join('\n'),

                // z-index
                zIndex        : 100000,


                // events
                onShow        : 0, // function () { console.log('show') }
                onHide        : 0, // function () { console.log('hide') }
                onDragStart   : 0, // function (event) { console.log('drag start') }
                onDragEnd     : 0, // function (event) { console.log('drag end') }
                onDrag        : 0, // function (event) { console.log('drag') }
                onResizeStart : 0, // function (event) { console.log('resize start') }
                onResizeEnd   : 0, // function (event) { console.log('resize end') }
                onResize      : 0, // function (event) { console.log('resize') }
                onMinimize    : 0, // function () { console.log('minimize') }
                onMaximize    : 0, // function () { console.log('maximize') }
                onDestroy     : 0  // function () { console.log('destroy') }
            };
            this.options    = extend({}, this.defaults, userOptions);

            // prepare controls
            if (typeof this.options.controls === 'object') {
                for (var k in this.defaults.controls) {
                    if (
                        (typeof this.options.controls[k] === 'boolean' && this.options.controls[k])
                        || typeof this.options.controls[k] === 'undefined'
                        ) {
                        this.options.controls[k] = this.defaults.controls[k];
                    }
                }
            }

            this.instanceID = instanceID++;

            this.init();
        }

        return JSW;
    }());

    // destroy window
    JSW.prototype.destroy = function () {
        this.callEvent('onDestroy');

        if (this.jswItem.parentNode) {
            this.jswItem.parentNode.removeChild(this.jswItem);
        }

        for(var n in this) {
            delete this[n];
        }
    }

    // call event from options
    JSW.prototype.callEvent = function (name) {
        if (this.options[name] && typeof this.options[name] === 'function') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.options[name].apply(this, args);
        }
    }

    // init JSW
    JSW.prototype.init = function () {
        // create parent node
        if (!parentNode) {
            parentNode = document.createElement('div');
            document.body.appendChild(parentNode);
        }

        // create window
        this.jswItem = string2dom(this.options.template);

        // add id
        this.jswItem.id = 'jsw-' + this.instanceID;

        // add JSW instance to dom
        this.jswItem.JSW = this;

        // create controls
        this.$title     = getElementsByClassName(this.jswItem, 'jsw-title');
        this.$controls  = getElementsByClassName(this.jswItem, 'jsw-controls');
        this.$tabs      = getElementsByClassName(this.jswItem, 'jsw-tabs');

        // title
        if (this.options.title) {
            this.setTitle(this.options.title);
        }

        // content
        if (this.options.content) {
            this.initContent();
        }

        // controls
        if (this.options.controls) {
            this.initControls();
        }

        // draggable
        if (this.options.draggable) {
            this.initDraggable();
        }

        // resizable
        if (this.options.resizable) {
            this.initResizable();
        }

        // init focus window
        this.initFocusWindow();

        // prevent scroll
        if (this.options.preventScroll) {
            this.preventScroll();
        }

        this.setPosition(this.options.x, this.options.y, Math.max(this.options.width, this.options.minWidth), Math.max(this.options.height, this.options.minHeight));

        // insert window to page
        parentNode.appendChild(this.jswItem);

        return this;
    };

    // show window
    JSW.prototype.show = function () {
        removeClass(this.jswItem, 'jsw-hide');
        addClass(this.jswItem, 'jsw-show');
        this.correctPosition();
        this.callEvent('onShow');
        return this;
    };

    // hide window
    JSW.prototype.hide = function () {
        removeClass(this.jswItem, 'jsw-show');
        addClass(this.jswItem, 'jsw-hide');
        this.callEvent('onHide');
        return this;
    };

    // minimize window
    JSW.prototype.minimize = function () {
        if (hasClass(this.jswItem, 'jsw-minimized')) {
            removeClass(this.jswItem, 'jsw-minimized');
        } else {
            addClass(this.jswItem, 'jsw-minimized');
        }
        this.callEvent('onMinimize');
        return this;
    };

    // maximize window
    JSW.prototype.maximize = function () {
        if (hasClass(this.jswItem, 'jsw-maximized')) {
            removeClass(this.jswItem, 'jsw-maximized');
        } else {
            addClass(this.jswItem, 'jsw-maximized');
        }
        this.callEvent('onMaximize');
        return this;
    };

    // set title
    JSW.prototype.setTitle = function (title) {
        if (this.$title[0]) {
            this.options.title = title;
            this.$title[0].innerHTML = title;
        }
        return this;
    };

    // get title
    JSW.prototype.getTitle = function () {
        return this.options.title;
    };

    // set window position and size
    JSW.prototype.setPosition = function (x, y, w, h) {
        var self = this;

        var result = {
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)'
        };

        if (self.options.position === 'fixed') {
            result.position = 'fixed';
        } else {
            result.position = 'absolute';
        }

        if(isNumeric(y) || isString(y)) {
            result.top = isNumeric(y) ? Math.max(0, y) + 'px' : y;
        }
        if(isNumeric(x) || isString(x)) {
            result.left = isNumeric(x) ? x + 'px' : x;
        }
        if(isNumeric(w) || isString(w)) {
            result.width = isNumeric(w) ? Math.max(self.options.minWidth, w) + 'px' : w;
        }
        if(isNumeric(h) || isString(h)) {
            result.height = isNumeric(h) ? Math.max(self.options.minHeight, h) + 'px' : h;
            result.maxHeight = 'none';
        }

        css(self.jswItem, result);
        return this;
    };

    // get window position and size
    JSW.prototype.getPosition = function () {
        var self = this;
        var pos = offset(self.jswItem);

        if (self.options.position === 'fixed') {
            var wnd = getDocumentScroll();
            pos.left -= wnd.left;
            pos.top -= wnd.top;
        }

        return {
            x: pos.left,
            y: pos.top,
            width: self.jswItem.clientWidth,
            height: self.jswItem.clientHeight
        };
    };

    // correct window position and size
    JSW.prototype.correctPosition = function () {
        var position = this.getPosition();
        var wnd = {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };

        if (this.options.position !== 'fixed') {
            wnd.width = document.body.scrollWidth;
            wnd.height = document.body.scrollHeight;
        }

        // calculate position
        position.x = Math.max(this.options.safeOutOffset - position.width, position.x);
        position.y = Math.min(wnd.height - this.options.safeOutOffset, position.y);
        position.x = Math.min(wnd.width - this.options.safeOutOffset, position.x);

        // prevent width and height changes if it is not changed before
        if (this.jswItem.style.height == '') {
            position.height = undefined;
        }
        if (this.jswItem.style.width == '') {
            position.width = undefined;
        }

        this.setPosition(position.x, position.y, position.width, position.height);
        return this;
    };

    // content
    JSW.prototype.initContent = function () {
        var self = this;

        self.$content = getElementsByClassName(self.jswItem, 'jsw-content');
        if (!self.$content.length) {
            return;
        }

        self.$content[0].innerHTML = self.options.content;
    };

    // controls
    JSW.prototype.initControls = function () {
        var self = this;

        self.$controls = getElementsByClassName(self.jswItem, 'jsw-controls');
        if (!self.$controls.length) {
            return;
        }

        for (var k in self.options.controls) (function (k, item) {
            if (!item[k]) {
                return;
            }

            var icon = item[k].icon;
            var title = item[k].title;
            var onClick = item[k].click;

            var span = document.createElement('span');
            addClass(span, icon);
            span.title = title;

            bind(span, 'click', function (e) {
                onClick.apply(self, e);
            })
            span.unbindEvent = function () {
                unbind(span, 'click', function(e) {
                    onClick.apply(self, e);
                })
            };

            self.$controls[0].insertBefore(span, self.$controls[0].firstChild);
        }(k, self.options.controls));
    };

    // init draggable event
    JSW.prototype.initDraggable = function () {
        this.$draggable = getElementsByClassName(this.jswItem, 'jsw-draggable');
        if (!this.$draggable.length) {
            return;
        }

        var self = this,
            startX = 0,
            startY = 0,
            startPosition = self.getPosition();

        for (var k = 0, len = this.$draggable.length; k < len; k++) {
            drag(this.$draggable[k],
                function dragStart (e) {
                    startX = (e.touches && e.touches[0] ? e.touches[0] : e ).screenX;
                    startY = (e.touches && e.touches[0] ? e.touches[0] : e ).screenY;
                    startPosition = self.getPosition();
                    addClass(self.jswItem, 'jsw-draggable-started');
                    self.callEvent('onDragStart', e);
                }, 
                function dragMove (e) {
                    var pageX = (e.touches && e.touches[0] ? e.touches[0] : e ).screenX;
                    var pageY = (e.touches && e.touches[0] ? e.touches[0] : e ).screenY;
                    var newLeft = startPosition.x + (pageX - startX);
                    var newTop = startPosition.y + (pageY - startY);
                    self.setPosition(newLeft, newTop);
                    self.callEvent('onDrag', e);
                },
                function dragEnd (e) {
                    removeClass(self.jswItem, 'jsw-draggable-started');
                    self.correctPosition();
                    self.callEvent('onDragEnd', e);
                }
            );
        }
        return this;
    };

    // init resizable event
    JSW.prototype.initResizable = function () {
        addClass(this.jswItem, 'jsw-resizable-enabled');

        var self = this,
            startX = 0,
            startY = 0,
            startPosition = self.getPosition();

        function dragStart (e) {
            startX = (e.touches && e.touches[0] ? e.touches[0] : e ).screenX;
            startY = (e.touches && e.touches[0] ? e.touches[0] : e ).screenY;
            startPosition = self.getPosition();
            addClass(self.jswItem, 'jsw-resizable-started');
            self.callEvent('onResizeStart', e);
        }

        function dragEnd (e) {
            removeClass(self.jswItem, 'jsw-resizable-started');
            self.correctPosition();
            self.callEvent('onResizeEnd', e);
        }

        function topResize (e) {
            var screenY = (e.touches && e.touches[0] ? e.touches[0] : e ).screenY;
            var changedSize = screenY - startY;
            var newTop = startPosition.y + changedSize;
            var newHeight = startPosition.height - changedSize;

            // stop calculate top position if minimum height
            if (self.options.minHeight >= newHeight) {
                newTop -= self.options.minHeight - newHeight;
            }
            self.setPosition(undefined, newTop, undefined, newHeight);
        }

        function rightResize (e) {
            var screenX = (e.touches && e.touches[0] ? e.touches[0] : e ).screenX;
            var changedSize = startX - screenX;
            var newWidth = startPosition.width - changedSize;
            self.setPosition(undefined, undefined, newWidth, undefined);
        }

        function leftResize (e) {
            var screenX = (e.touches && e.touches[0] ? e.touches[0] : e ).screenX;
            var changedSize = screenX - startX;
            var newLeft = startPosition.x + changedSize;
            var newWidth = startPosition.width - changedSize;

            // stop calculate top position if minimum height
            if (self.options.minWidth >= newWidth) {
                newLeft -= self.options.minWidth - newWidth;
            }
            self.setPosition(newLeft, undefined, newWidth, undefined);
        }

        function bottomResize (e) {
            var screenY = (e.touches && e.touches[0] ? e.touches[0] : e ).screenY;
            var changedSize = startY - screenY;
            var newHeight = startPosition.height - changedSize;
            self.setPosition(undefined, undefined, undefined, newHeight);
        }

        // top resize
        var n = document.createElement('div');
        addClass(n, 'jsw-resizable-n');
        drag(n, dragStart, function(e) {
            topResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        // right resize
        var e = document.createElement('div');
        addClass(e, 'jsw-resizable-e');
        drag(e, dragStart, function(e) {
            rightResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        // left resize
        var w = document.createElement('div');
        addClass(w, 'jsw-resizable-w');
        drag(w, dragStart, function(e) {
            leftResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        // bottom resize
        var s = document.createElement('div');
        addClass(s, 'jsw-resizable-s');
        drag(s, dragStart, function(e) {
            bottomResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        // top left resize
        var nw = document.createElement('div');
        addClass(nw, 'jsw-resizable-nw');
        drag(nw, dragStart, function (e) {
            topResize(e);
            leftResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        // top right resize
        var ne = document.createElement('div');
        addClass(ne, 'jsw-resizable-ne');
        drag(ne, dragStart, function (e) {
            topResize(e);
            rightResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        // bottom left resize
        var sw = document.createElement('div');
        addClass(sw, 'jsw-resizable-sw');
        drag(sw, dragStart, function (e) {
            bottomResize(e);
            leftResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        // bottom right resize
        var se = document.createElement('div');
        addClass(se, 'jsw-resizable-se');
        drag(se, dragStart, function (e) {
            bottomResize(e);
            rightResize(e);
            self.callEvent('onResize', e);
        }, dragEnd);

        this.jswItem.appendChild(n);
        this.jswItem.appendChild(e);
        this.jswItem.appendChild(w);
        this.jswItem.appendChild(s);
        this.jswItem.appendChild(nw);
        this.jswItem.appendChild(ne);
        this.jswItem.appendChild(sw);
        this.jswItem.appendChild(se);
        return this;
    };

    // init focus window
    JSW.prototype.initFocusWindow = function () {
        var self = this;

        // set default zIndex
        css(self.jswItem, {
            zIndex: self.options.zIndex
        })

        // on click set for current window zIndex over then others
        bind(self.jswItem, 'click', function() {
            var allWindows = parentNode.childNodes;
            for(var k = 0; k < allWindows.length; k++) {
                css(allWindows[k], {
                    zIndex: self.options.zIndex
                })
            }
            css(self.jswItem, {
                zIndex: self.options.zIndex + 1
            })
        })
    };

    // prevent scroll
    JSW.prototype.preventScroll = function () {
        var self = this;
        if (!self.$content[0]) {
            return;
        }

        function scroll (e) {
            e.preventDefault();

            if ((e.target === self.$content[0]) || 
                (e.target && e.target.offsetParent && e.target.offsetParent === self.$content[0])) {
                var scrollTo = null;

                if (e.type == 'mousewheel') {
                    scrollTo = (e.wheelDelta * -1);
                }
                else if (e.type == 'DOMMouseScroll') {
                    scrollTo = 40 * e.detail;
                }

                if (scrollTo) {
                    self.$content[0].scrollTop += scrollTo;
                }
            }
        }

        bind(self.jswItem, 'mousewheel', scroll);
        bind(self.jswItem, 'DOMMouseScroll', scroll);
    };

    // Declaration
    var oldJSW = window.JSW;
    window.JSW = function (options) {
        return new JSW(options);
    };

    window.JSW.noConflict = function () {
        window.JSW = oldJSW;
        return this;
    };
}());