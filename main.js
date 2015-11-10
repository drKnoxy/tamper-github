// ==UserScript==
// @name         GitHub - Make PRs easier
// @namespace    http://adamwknox.com
// @version      1.0
// @description  Add some js buttons to diffs
// @author       DrKnoxy
// @include      https://github.com/*
// @grant        none
// ==/UserScript==

var tool = (function() {

    var collapse = {
        // vars
        toggleId: 'js-blob-toggle',
        blobSelector: '.blob-wrapper, .render-wrapper, .file-header + .empty',
        isAllVisible: true,

        // methods
        addElement: collapseAddElement,
        monitor: collapseMonitor
    };

    var whitespace = {
        // vars
        toggleId: 'js-whitespace-toggle',
        isVisible: false,

        // methods
        init: whitespaceInit,
        addElement: whitespaceAddElement,
        monitor: whitespaceMonitor
    };


    // Public methods
    return {
        init: init,
        addElements: addElements
    }


    /////////////////////

    function init() {
        whitespace.init();

        // Watch for events
        collapse.monitor();
        whitespace.monitor();
    }

    function addElements() {
        collapse.addElement();
        whitespace.addElement();
    }


    //////////////////////////
    /// Whitespace Methods
    //////////////////////////

    function whitespaceInit() {
        var search = _getSearchAsObj();
        whitespace.isVisible = (search.w == 1);
    }

    function whitespaceMonitor() {
        $(document).on('click', '#' + whitespace.toggleId, function(e) {
            e.preventDefault();

            // blow away the whole search query...
            window.location.search = whitespace.isVisible ? 'w=0' : 'w=1';
        });
    }

    function whitespaceAddElement() {
        var toggle = {
            id: whitespace.toggleId,
            label: 'Ignore Whitespace',
            isSelected: whitespace.isVisible
        };

        _addToggle(toggle);
    }


    //////////////////////////
    /// Collapse Methods
    //////////////////////////

    function collapseMonitor() {
        collapseMonitorHeader();
        collapseMonitorToggle();
    }

    function collapseMonitorHeader() {
        $(document).on('click', '.file-header', function(e) {
            $(this).next(collapse.blobSelector).toggle();
        });
    }

    function collapseMonitorToggle() {
        $(document).on('click', '#' + collapse.toggleId, function(e) {
            e.preventDefault();

            // can't use toggle, because we need to obey our state
            // not the items state
            if (collapse.isAllVisible) {
                $(this).addClass('selected');
                $(collapse.blobSelector).hide();
            } else {
                $(this).removeClass('selected');
                $(collapse.blobSelector).show();
            }

            collapse.isAllVisible = !collapse.isAllVisible;
        });
    }

    function collapseAddElement() {
        var toggle = {
            id: collapse.toggleId,
            label: 'Collapse'
        };

        _addToggle(toggle);
    }

    //////////////////////////
    /// Utils
    //////////////////////////

    /**
     * @param options {id, label, isSelected}
     */
    function _addToggle(options) {
        if (!$('#' + options.id).length) {
            var cssClasses = 'btn btn-sm right';
            if (options.isSelected) {
                cssClasses += ' selected';
            }

            var tmpl = [
                '<a id="' + options.id + '"',
                    'class="' + cssClasses + '"',
                    'style="margin-left: 4px;"',
                    '>',
                    options.label,
                '</a>'
            ].join(' ');

            $('#toc .btn-group').before(tmpl);
        }
    }

    function _getSearchAsObj() {
        var search = {};
        if (window.location.search) {
            window.location.search.replace('?', '').split('&').forEach(function(el) {
                var group = el.split('=');
                var prop = group[0];
                var val = group[1] || '';
                return search[prop] = val;
            });
        }

        return search;
    }

})();

// ready!
$(function() {
    tool.init();
    tool.addElements();

    $(document).on('pjax:complete pjax:popstate', function(e) {
        tool.addElements();
    });
});

