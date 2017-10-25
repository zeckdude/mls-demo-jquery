(function($){
  $.fn.onDelayed = function(eventName,delayInMs,callback){
    var _timeout;
    this.on(eventName,function(e){
      if(!!_timeout){
        clearTimeout(_timeout);
        console.log('timer being re-set: ' + eventName);
      } else {
        console.log('timer being set for the first time: ' + eventName);
      }
      _timeout = setTimeout(function(){
        callback(e);
      },delayInMs);
    });
  };
})(jQuery);