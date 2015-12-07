// ==UserScript==
// @name         GitHub - Make PRs easier to diff
// @namespace    https://github.com/drKnoxy/
// @version      1.0
// @description  Add some js buttons to diffs
// @author       DrKnoxy
// @include      https://github.com/*
// @grant        none
// ==/UserScript==

var tool = (function() {
    
    // Prep global variables
    var isWhitespaceVisible = _isWhitespaceVisible();

    /**
     * The collapse headers feature
     */
    var collapse = (function(){
        var toggleId = 'js-blob-toggle';
        var blobSelector = '.blob-wrapper, .render-wrapper, .file-header + .empty';
        var isAllVisible = true;
        
        return {
            addElement: addElement,
            monitor: monitor
        };

        //////////////////////

        function monitor() {
            _monitorHeader();
            _monitorToggle();
        }

        function _monitorHeader() {
            $(document).on('click', '.file-header', function(e) {
                $(this).next(blobSelector).toggle();
            });
        }

        function _monitorToggle() {
            $(document).on('click', '#' + toggleId, function(e) {
                e.preventDefault();

                // can't use toggle, because we need to obey our state
                // not the items state
                if (isAllVisible) {
                    $(this).addClass('selected');
                    $(blobSelector).hide();
                } else {
                    $(this).removeClass('selected');
                    $(blobSelector).show();
                }

                isAllVisible = !isAllVisible;
            });
        }

        function addElement() {
            var toggle = {
                id: toggleId,
                label: 'Collapse'
            };

            _addToggle(toggle);
        }
    })();

    /**
     * The hide whitespace features
     */
    var whitespace = (function(isWhitespaceVisible){
        var toggleId = 'js-whitespace-toggle';
        var isWhitespaceVisible = isWhitespaceVisible;

        return {
            addElement: addElement,
            monitor: monitor
        };

        //////////////////////

        function monitor() {
            $(document).on('click', '#' + toggleId, function(e) {
                e.preventDefault();

                // blow away the whole search query...
                window.location.search = isWhitespaceVisible ? '' : 'w=1';
            });
        }

        function addElement() {
            var toggle = {
                id: toggleId,
                label: 'Ignore Whitespace',
                isSelected: isWhitespaceVisible
            };

            _addToggle(toggle);
        }

    })(isWhitespaceVisible);

    /**
     * Public methods
     */
    return {
        monitor: monitor,
        addElements: addElements
    }

    //////////////////////

    function monitor() {
        // Watch for events
        collapse.monitor();
        whitespace.monitor();
    }

    function addElements() {
        collapse.addElement();
        whitespace.addElement();
    }

    /**
     * Add a button to the page
     * @param options {id, label, isSelected}
     */
    function _addToggle(options) {
        var toggleTemplate = '<a id="{{id}}" class="{{cssClass}}" style="margin-left: 4px;">{{label}}</a>';

        // Make sure it isn't on the page already
        if (!$('#' + options.id).length) {
            options.cssClass = 'btn btn-sm right';
            if (options.isSelected) {
                options.cssClass += ' selected';
            }
            tmpl = _render(toggleTemplate, options);

            $('#toc .btn-group').before(tmpl);
        }
    }

    function _isWhitespaceVisible() {
        var search = {};
        if (window.location.search) {
            window.location.search.replace('?', '').split('&').forEach(function(el) {
                var group = el.split('=');
                var prop = group[0];
                var val = group[1] || '';
                search[prop] = val;
            });
        }

        return (search.w && parseInt(search.w, 10) == 1);
    }

    /**
     * Simple template rendering
     * double curly brace syntax {{id}} or {{ id }}
     * 
     * @param  {string} tmpl
     * @param  {obj}    data  [description]
     * @return {string}
     */
    function _render(tmpl, data) {
        var curlyBraceRegex = /{{([^}}]+)}}/g
        var finds = tmpl.match(curlyBraceRegex);

        finds.forEach(function(curlyProp) {
            var prop = curlyProp.replace('{{', '').replace('}}','').trim();

            if (data[prop]){
                tmpl = tmpl.split(curlyProp).join(data[prop]);
            }
        });

        return tmpl;
    }

})();

// ready!
$(function() {
    // Make sure monitoring is going
    tool.monitor();

    // Add elements on page load
    tool.addElements();

    // Add elements on page change
    $(document).on('pjax:complete pjax:popstate', function(e) {
        tool.addElements();
    });
});

