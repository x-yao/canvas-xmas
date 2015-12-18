! function($) {
	var Increase = function(opt){
		this.init(opt);
	};
	Increase.prototype = {
		init: function(opt) {
			this.touchEl = opt.el;//点击触发的el
			this.dpEl = opt.dpEl;//数字显示的el
			this.richMin = opt.richMin||0;//最小数字
			this.richMax = opt.richMax||100;//最大数字
			this.speed = opt.speed||1000;//速度
			this.drow = opt.drow;
			this.ct = opt.continue || false;
			this.flag = false;
			this.cunrentNum = opt.richMin||0;
			this.reset = opt.reset||false;
			if(typeof this.touchEl != "undefined"){
				this.handel(this.touchEl);
			}
			this.handRich();
		},
		handRich:function(){
			var number;
			var self = this;
			var selfEl = $(this);
			selfEl.on('start',function(){
				selfEl.trigger('increase:start');
				self.enrich(self.richMin,self.richMax,self.speed);
			});
			selfEl.on('update',function(e,data){
				number = data;
				//输出数字
				selfEl.trigger('increase:update',number);
				if(typeof self.dpEl != "undefined"){
					self.displayNum(self.dpEl,number);
				}
				// console.log(data);
			});
			selfEl.on('increase:over',function(e,data){
				clearInterval(this.interval);
				this.flag = false;
				// cancelAnimationFrame(this.aniId);
			});
			selfEl.on('end',function(e){
				clearInterval(this.interval);
				// cancelAnimationFrame(this.aniId);
				// console.log(number);
				// 游戏结束
				this.flag = false;
				selfEl.trigger('increase:end',number);
			});
		},
		displayNum:function(el,num){
			$(el).html(num);
		},
		enrich: function(min,max,speed,callback) {
			if (this.ct !== true) {
				this.cunrentNum = min;
			};
			var self = $(this);
			var that = this;
			var ease = function(t, b, c, d) {
            	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        	}
        	var Linear = function(t, b, c, d) { return c*t/d + b; }
			this.interval = setInterval(function(){
				that.flag = true;
				if(that.cunrentNum<=max){
					self.trigger('update',that.cunrentNum);
					if(typeof that.drow === "function"){
						that.drow(that.cunrentNum);
					}
					that.cunrentNum++;
				}else{
					//超出最大值increase over
					if (that.reset) {
						that.cunrentNum = min;
					}else{
						self.trigger('increase:over');
					};
					if (typeof callback === "function") {
						callback();
					};
				}
			},1000/speed);
		},
		random: function(min,max,minlength,maxlength){
			var length = minlength+this.randomRange(minlength,maxlength);
			// console.log(length);
			var minNumber = min+this.randomRange(min,(max-length));
			var maxNumber = minNumber + length;
			this.randomNum = [minNumber,maxNumber]
			return this.randomNum
		},
		randomRange:function(min,max){
			return Math.floor(Math.random()*(max-min+1));
		},
		handel:function(el){
			var self = $(this);
			$(el).on('mousedown touchstart',function(e){
				e.preventDefault();
				self.trigger('start');
			}).on('mouseup touchend',function(){
				self.trigger('end');
			})
		}
	}
	window.Increase = Increase||{};
}(window.Zepto)