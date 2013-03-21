define(function (require, exports, module) {
  var $ = require('$');
  var Widget = require('widget');

  var modal = $('<div class="ui-dialog-modal">').html('<div class="ui-dialog"></div>');
  var dialog = $('>div', modal);
  //防止点击穿透
  modal.on('click touchstart', false);
  dialog.on('click', function (e) {
    e.stopPropagation();
  });

  var Dialog = Widget.extend({
    setup: function () {
      this.prev = this.element.prev();
      if (!this.prev.length) {
        this.parent = this.element.parent();
      }
    },
    show: function () {
      $(window).on('resize.dialog', this._refreshRender);
      dialog.append(this.element.show());
      modal.appendTo('body');
      this._refreshRender();
      getComputedStyle(modal[0]).background;
      modal.addClass('active');
    },
    hide: function () {
      var that = this;
      $(window).off('resize.dialog', this._refreshRender);
      modal.one('webkitTransitionEnd transitionend',function () {
        if (that.prev.length) {
          that.prev.after(that.element);
        } else if (that.parent.length) {
          that.parent.prepend(that.element);
        }
        modal.remove();
      }).removeClass('active');
    },
    _refreshRender: function () {
      modal.height($(document).height());
      dialog.css({
        'top': (window.innerHeight - dialog.height()) / 2 + 'px',
        'left': (window.innerWidth - dialog.width()) / 2 + 'px'
      });
    }
  });
  return Dialog;
});