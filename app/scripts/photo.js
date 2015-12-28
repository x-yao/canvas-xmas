var WXPhoto = function(config){
		var _self = this;
		_self.config = $.extend({}, WXPhoto.config, (window.WXPhotoConfig || {}), config);
		_self._init();
	};
	WXPhoto.config = {
		kopConfig: null,
		debug: false
	};
	$.extend(WXPhoto.prototype, {	
		_init: function(){
			var _self = this,
				sdk = new KUI.WXSDK({
					kopConfig: _self.config.kopConfig,
					debug: _self.config.debug,
					jsApiList: [
						'chooseImage',
					]
				});
				
			_self.sdk = sdk;		
		}
	});
    
    if(!window.KUI){
    	window.KUI = {};
    }
    KUI.WXPhoto = WXPhoto;