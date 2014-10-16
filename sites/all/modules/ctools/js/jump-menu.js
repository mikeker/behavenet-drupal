
(function($) {
  Drupal.behaviors.CToolsJumpMenu = function(context) {
    $('.ctools-jump-menu-hide:not(.ctools-jump-menu-processed)')
      .addClass('ctools-jump-menu-processed')
      .hide();

    $('.ctools-jump-menu-change:not(.ctools-jump-menu-processed)')
      .addClass('ctools-jump-menu-processed')
      .change(function() {
        var loc = decodeURIComponent($(this).val());
        var urlArray = loc.split('::');
        if (urlArray[1]) {
          location.href = urlArray[1];
        }
        else {
          location.href = loc;
        }
        return false;
      });

    $('.ctools-jump-menu-button:not(.ctools-jump-menu-processed)')
      .addClass('ctools-jump-menu-processed')
      .click(function() {
        // Instead of submitting the form, just perform the redirect.

        // Find our sibling value.
        var $select = $(this).parents('form').find('.ctools-jump-menu-select');
        var loc = decodeURIComponent($select.val());
        var urlArray = loc.split('::');
        if (urlArray[1]) {
          location.href = urlArray[1];
        }
        else {
          location.href = loc;
        }
        return false;
      });
  };

})(jQuery);
