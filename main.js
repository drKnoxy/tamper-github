// ==UserScript==
// @name         GitHub - Make PRs easier
// @namespace    http://adamwknox.com
// @version      0.6
// @description  Collapsing Headers on diffs
// @author       DrKnoxy
// @include      https://github.com/*
// @grant        none
// ==/UserScript==

var blobSelector = '.blob-wrapper, .render-wrapper, .file-header + .empty';
function monitorHeaderToggle() {
  $(document).on('click', '.file-header', function(e){
    $(this).next(blobSelector).toggle();
  });
}

var toggleID = 'js-blob-collapser';
function addToggle() {
  if (!$('#'+toggleID).length){
    $('#toc .btn-group').before('<a id="'+toggleID+'" class="btn btn-sm right" style="margin-left:4px;">Collapse</a>');
  }
}

var allVisible = true;
function monitorToggle() {
  $(document).on('click', '#'+toggleID, function(e) {
    e.preventDefault();
    if (allVisible) {
      $(this).addClass('selected');
      $(blobSelector).hide();
    } else {
      $(this).removeClass('selected');
      $(blobSelector).show();
    }

    allVisible = !allVisible;
  });
}

$(function(){
  // Toggling with the header
  monitorHeaderToggle();

  // Collapsing all
  addToggle();
  monitorToggle();

  $(document).on('pjax:complete pjax:popstate', function(e){
    addToggle();
  });
});