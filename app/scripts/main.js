! function($) {
	var Game = function(opt){
		this.init(opt);
	};
	Game.prototype = {
		init: function(opt) {
			this.touchEl = opt.el;//点击触发的el
			this.dpEl = opt.dpEl;//数字显示的el
			this.richMin = opt.richMin||0;//最小数字
			this.richMax = opt.richMax||100;//最大数字
			this.minLength = opt.minlength||10,//最小区间长度
			this.maxLength = opt.maxlength||20;//最大区间长度
			this.speed = opt.speed||1000;//速度
			this.drow = opt.drow;
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
				selfEl.trigger('game:start');
				self.enrich(self.richMin,self.richMax,self.speed);
			});
			selfEl.on('update',function(e,data){
				number = data;
				//输出数字
				selfEl.trigger('game:update',number);
				if(typeof self.dpEl != "undefined"){
					self.displayNum(self.dpEl,number);
				}
				// console.log(data);
			});
			selfEl.on('game:over',function(e,data){
				clearInterval(this.interval);
				// cancelAnimationFrame(this.aniId);
			});
			selfEl.on('end',function(e){
				clearInterval(this.interval);
				// cancelAnimationFrame(this.aniId);
				// console.log(number);
				// 游戏结束
				selfEl.trigger('game:end',number);
			});
		},
		displayNum:function(el,num){
			$(el).html(num);
		},
		enrich: function(min,max,speed) {
			var m = min;
			var self = $(this);
			var that = this;
			var ease = function(t, b, c, d) {
            	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        	}
        	var Linear = function(t, b, c, d) { return c*t/d + b; }
			this.interval = setInterval(function(){
				if(m<max){
					m++;
					self.trigger('update',m);
					that.drow(m);
				}else{
					//超出最大值game over
					self.trigger('game:over')
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
	window.Game = Game||{};
}(window.Zepto)