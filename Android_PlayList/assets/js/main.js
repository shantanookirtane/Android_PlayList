/***
   * Thanks for your download :)
   * 31. january 2013
   * www.tempees.com  
   * http://www.facebook.com/tempeescom
   * http://www.twitter.com/tempeescom
   * http://www.tempees.com/donate
   * LICENCE: All of our site is free, and you can use it where you want. For private and commercial purposes.        
***/  

$(document).ready(function() {
  
  TriggerClick = 0;
  $('a#menu').click(function(){
    if(TriggerClick==0){
         TriggerClick=1;
         $('body').addClass('open-menu');
         $('#left-menu').show();
         $('#content-wrapper').animate({marginLeft:'75%'}, 200);
         $(window).resize(function() {
           $('#body').height($(window).height());
         });
         $(window).trigger('resize');
    }else{
         TriggerClick=0;
         $('body').removeClass('open-menu');
         $('#content-wrapper').animate({marginLeft:'0%'}, 200);
         $(window).resize(function() {
           $('#body').height('auto');
         });
         $(window).trigger('resize');
    };
    
    return false;
  });
  
  $('.open-menu #content-wrapper').click(function(){
    $('body').removeClass('open-menu');
    $(this).animate({marginLeft:'0%'}, 200);
  });
  
  $(window).resize(function() {
    $('#content-wrapper').height($(window).height());
    $('.wrapmenu').height($(window).height()-50);
    $('#content-wrapper section').height($(window).height()-50);
  });
  $(window).trigger('resize');
           
});