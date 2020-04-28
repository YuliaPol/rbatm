$(document).ready(function () {
    $( ".treeview" ).click(function() {
        $(this).find(".treeview-menu" ).animate({
          height: "toggle"
        }, 1000, function() {
          // Animation complete.
        });
        $(this).toggleClass("active");
      });

      $('.sidebar-toggle').click(function(){
        $('body').toggleClass("sidebar-hide");
      })
      if( $( document ).width() < 991){
        $('body').addClass("sidebar-hide");
      }
});
