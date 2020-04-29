$(document).ready(function () {
  $(".treeview").click(function () {
    $(this).find(".treeview-menu").animate({
      height: "toggle"
    }, 1000, function () {
      // Animation complete.
    });
    $(this).toggleClass("active");
  });

  $('.sidebar-toggle').click(function () {
    $('body').toggleClass("sidebar-hide");
  })
  if ($(document).width() < 991) {
    $('body').addClass("sidebar-hide");
  }
  /*Status select*/
  var nav = $('.nav-select');
  var selection = $('.select-list');
  var select = selection.find('li');

  nav.click(function (event) {
    if (nav.hasClass('active')) {
      nav.removeClass('active');
      selection.stop().slideUp(200);
    } else {
      nav.addClass('active');
      selection.stop().slideDown(200);
    }
    event.preventDefault();
  });

  select.click(function (event) {
    nav.removeClass('active');
    selection.stop().slideUp(200);
    select.removeClass('active');
    $(this).addClass('active');
    var current = $(this).html();
    $(nav).html(current);
    $('.input-status').val($(this).attr('data-value'));
  });
});
