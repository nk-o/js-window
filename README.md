# JS Window
Javascript window like plugin. No dependencies. [http://free.nkdev.info/js-window/](http://free.nkdev.info/js-window/)

## Getting Started
Include JSW plugin and styles
```html
<!-- JSW -->
<link href='js-window/jsw.css' rel='stylesheet' type='text/css'>
<script src='js-window/jsw.js'></script>
<!--[if lte IE 8]>
<link href='js-window/jsw-ie.css' rel='stylesheet' type='text/css'>
<![endif]-->
```

## Call the plugin
```javascript
var myWindow = JSW({
    content: 'My Content'
});
myWindow.show();
```

# Options
<table class='table table-bordered table-striped'>
    <thead>
        <tr>
            <th>name</th>
            <th>type</th>
            <th>default</th>
            <th style='width: 60%;'>description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>title</td>
            <td>string</td>
            <td>Window</td>
            <td>Window title.</td>
        </tr>
        <tr>
            <td>content</td>
            <td>string</td>
            <td>&lt;p>Content&lt;/p></td>
            <td>Window content.</td>
        </tr>
        <tr>
            <td>position</td>
            <td>string</td>
            <td>absolute</td>
            <td>Window position on screen 'absolute' or 'fixed'.</td>
        </tr>
        <tr>
            <td>x</td>
            <td>number</td>
            <td>40</td>
            <td rowspan='6'>Window initial position and sizes.</td>
        </tr>
        <tr>
            <td>y</td>
            <td>number</td>
            <td>40</td>
        </tr>
        <tr>
            <td>width</td>
            <td>number</td>
            <td>500</td>
        </tr>
        <tr>
            <td>height</td>
            <td>number</td>
            <td>200</td>
        </tr>
        <tr>
            <td>minWidth</td>
            <td>number</td>
            <td>300</td>
        </tr>
        <tr>
            <td>minWidth</td>
            <td>number</td>
            <td>100</td>
        </tr>
        <tr>
            <td>safeOutOffset</td>
            <td>number</td>
            <td>40</td>
            <td>When you drag window out of document it will be visible by safeOutOffset pixels.</td>
        </tr>
        <tr>
            <td>draggable</td>
            <td>boolean</td>
            <td>true</td>
            <td>Draggable window (apply on .jsw-draggable items).</td>
        </tr>
        <tr>
            <td>resizable</td>
            <td>boolean</td>
            <td>true</td>
            <td>Resizable window.</td>
        </tr>
        <tr>
            <td>preventScroll</td>
            <td>boolean</td>
            <td>false</td>
            <td>Prevent document scrolling when mouse over JSW.</td>
        </tr>
        <tr>
            <td>controls</td>
            <td>object</td>
            <td>[see here](#default-controls)</td>
            <td>Window controls.</td>
        </tr>
        <tr>
            <td>template</td>
            <td>string</td>
            <td>[see here](#default-template)</td>
            <td>String with window template.</td>
        </tr>
        <tr>
            <td>zIndex</td>
            <td>number</td>
            <td>100000</td>
            <td>zIndex css property for window.</td>
        </tr>
        <tr>
            <td>onShow</td>
            <td>event</td>
            <td></td>
            <td rowspan='10'>Window events. For drag and resize events available first argument 'event'</td>
        </tr>
        <tr>
            <td>onHide</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onDragStart</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onDragEnd</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onDrag</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onResizeStart</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onResizeEnd</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onResize</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onMinimize</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onMaximize</td>
            <td>event</td>
            <td></td>
        </tr>
        <tr>
            <td>onDestroy</td>
            <td>event</td>
            <td></td>
        </tr>
    </tbody>
</table>

## Default Controls
```javascript
{
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
}
```

## Default Template
```html
<div class="jsw jsw-hide jsw-table jsw-mobile-ready">
    <div class="jsw-head jsw-draggable jsw-table-row">
        <div>
            <div class="jsw-controls"></div>
            <div class="jsw-title"></div>
            <div class="jsw-tabs"></div>
        </div>
    </div>
    <div class="jsw-table-row jsw-table-row-scroll">
        <div>
            <div class="jsw-content"></div>
        </div>
    </div>
</div>
```

## Events Usage
```javascript
var myWindow = JSW({
    onDrag: function (event) {
        console.log('drag', this, event);
    },
    onMinimize: function () {
        console.log('minimize', this);
    }
});
myWindow.show();
```

# Methods
<table class='table table-bordered table-striped'>
    <thead>
        <tr>
            <th>name</th>
            <th>return</th>
            <th style='width: 60%;'>description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>show()</td>
            <td>window</td>
            <td>Show window.</td>
        </tr>
        <tr>
            <td>hide()</td>
            <td>window</td>
            <td>Hide window.</td>
        </tr>
        <tr>
            <td>minimize()</td>
            <td>window</td>
            <td>Minimize window.</td>
        </tr>
        <tr>
            <td>maximize()</td>
            <td>window</td>
            <td>Maximize window.</td>
        </tr>
        <tr>
            <td>setTitle(title)</td>
            <td>window</td>
            <td>Set title for window.</td>
        </tr>
        <tr>
            <td>getTitle()</td>
            <td>title</td>
            <td>Get title.</td>
        </tr>
        <tr>
            <td>setPosition(x, y, width, height)</td>
            <td>window</td>
            <td>Set window position and size. If you dont want to set some some of properties, just use false -> setPosition(false, 20)</td>
        </tr>
        <tr>
            <td>getPosition()</td>
            <td>{x, y, width, height}</td>
            <td>Get window position and size.</td>
        </tr>
        <tr>
            <td>destroy()</td>
            <td>-</td>
            <td>Destroy window.</td>
        </tr>
    </tbody>
</table>

# License
Copyright (c) 2015 _nK Licensed under the WTFPL license.
