$(function() {
    var canvas, stage;
    var canvas = document.getElementById("myCanvas");
    var stage;
    var update = true;
    var isOk = false;
    var hammertime = new Hammer(canvas);
    var hammerMask = new Hammer($('.mask')[0],{
    	transform_always_block : true,
    	prevent_default : true,
    });
    var iniS;
    var iniP;
    var bitmap;
   	var bac;
   	var mask;
   	var cLoad = 0;
   	var c = [];
   	var nowIndex = getSearch().ids || 0;
   	var move = false;
   	var indexC = 0;
   	var images = {};
   	var cloth1;
   	var cloth2;
   	var shareUrl;
   	var dfImg;
   	var shareLoc;
   	var wt = -5;
   	var ht = 5;
   	var snowok,
   		bacok,
   		clothok,
   		dfImgok;
   	var clList = [{
			   		id:0,
			   		url:"http://img.kuaidadi.com/cms/img/ef9d585d44228096404a334fa8fd5c0d.png",
			   		x:83+wt,
			   		y:276+ht,
			   		width:516
			   	},
			   	{
			   		id:1,
			   		url:"http://img.kuaidadi.com/cms/img/0ca62af49e5131f28f70cd3559a84104.png",
			   		x:90+wt,
			   		y:278+ht,
			   		width:610
			   	},
			   	{
			   		id:2,
			   		url:"http://img.kuaidadi.com/cms/img/852bb72393a383c812d65eb0ad53444c.png",
			   		x:146+wt,
			   		y:280+ht,
			   		width:542
			   	}]
    hammertime.get('pinch').set({
	    enable: true
	});
	hammertime.get('rotate').set({
	    enable: true
	});
	hammertime.get('pan').set({
		threshold: 1,
	    enable: true
	});
	hammertime.get('swipe').set({
		velocity: 0.1,
	    enable: true
	});
	function getSearch(){
        var search = {};
        if(location.search){
            var SEARCH = location.search.split('?')[1].split('&');
            SEARCH.forEach(function(item){
                search[item.split('=')[0]] = item.split('=')[1];
            });
        }
        return search;
    }
    var imgD = getSearch().img;

    function init() {
        stage = new createjs.Stage(canvas);
        createjs.Touch.enable(stage);
        var image = new Image();
        image.crossOrigin = "Anonymous";
		image.src = "http://img.kuaidadi.com/cms/img/213effed57670ddfefe62fe68ee7d0cb.png";
		image.onload = addBac;
		var image2 = new Image();
        image2.crossOrigin = "Anonymous";
		image2.src = "http://img.kuaidadi.com/cms/img/b80c2b010e775a65a14ce282c01a9235.png";
		image2.onload = addSnow;
		var imageB = new Image();
        	imageB.crossOrigin = "Anonymous";
		if (imgD&&imgD !="undefined") {
        	imageB.src = imgD;
        	$('#btn2').show();
		}else{
			imageB.src = "http://img.kuaidadi.com/cms/img/4ad93a505817301746b647314a5d1fd9.png";
			$('#btn1,#pic,.share').show();
		};
		imageB.onload = addDfImg;
		for (var i = 0; i < clList.length; i++) {
			images[i] = new Image()  
			images[i].crossOrigin = "Anonymous";
            images[i].src = clList[i].url;
            images[i].onload = addCloth;
            // c.push(images[i]);
            clList[i].image = images[i];
		};
    }
    init();
    $("#pic").on("change", function(e) {
        var upload = $(this);
        var f = upload[0].files[0];
        if (!f.type.match('image.*')) {
            return false;
        }
        var target = $(this).attr('name');
        var reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = function(e) {
            var img = new Image();
            // img.crossOrigin = 'Anonymous';
            img.src = e.target.result;
            img.onload = function() {
                // ctx.drawImage(img,0,0,320,640);
                addPic(img);
                showMask();
            };
        }
    });
    function addBac(event){
    	var image = event.target;
		bac = new createjs.Bitmap(image);
		stage.addChild(bac);
		bac.scaleX = bac.scaleY = bac.scale = 750 / bac.image.width;
		stage.setChildIndex(bac,0);
		bacok = true;
		isAll();
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", stage);
		// createjs.Ticker.addEventListener("tick", tick);
    }
    function addDfImg(event){
    	var image = event.target;
		dfImg = new createjs.Bitmap(image);
		stage.addChild(dfImg);
		stage.setChildIndex(dfImg,0);
		dfImg.x = 270;
		dfImg.y = 433;
		dfImgok = true;
		isAll();
		update = true;
		// createjs.Ticker.addEventListener("tick", tick);
    }
    function addSnow(event){
    	var image = event.target;
		snow = new createjs.Bitmap(image);
		stage.addChild(snow);
		stage.setChildIndex(snow,3);
		snow.x = 0;
		snow.y = 917;
		snowok = true;
		isAll();
		update = true;
		// createjs.Ticker.addEventListener("tick", tick);
    }
    function addPic(image) {
    	if (bitmap) {
    		stage.removeChild(bitmap);
    	};
    	isOk = false;
    	bitmap = new createjs.Bitmap(image);
        stage.addChild(bitmap);
        bitmap.sourceRect = new createjs.Rectangle(0, 0, bitmap.image.width, bitmap.image.height);
	    // if(window.navigator.userAgent.indexOf("MicroMessenger")!=-1){
	    // 	iniS = bitmap.scaleX = bitmap.scaleY = bitmap.scale = 750 / bitmap.image.width;
	    // }else{
	    var w;
	    if (bitmap.image.width>=750) {
	    	w = 750;
	    }else{
	    	w = bitmap.image.width;
	    };
    	EXIF.getData(image, function() {
    		Orientation = EXIF.getTag(this,"Orientation");
	        if(Orientation == 6){  
	            //alert('旋转处理');  
            	bitmap.rotation = 90;
            	iniS = bitmap.scaleX = bitmap.scaleY = bitmap.scale = w / bitmap.image.height;
				bitmap.x = 750; 
        	}else{
        		iniS = bitmap.scaleX = bitmap.scaleY = bitmap.scale = w / bitmap.image.width;
        	}
	    });
	    // }
        // bitmap.rotation = 360 * Math.random() | 0;
        iniP = {
        	x:bitmap.x,
        	y:bitmap.y
        }
        bitmap.name = "bg";
        // stage.setChildIndex(bitmap,0);
        update = true;
        // bitmap.cursor = "pointer";
        // createjs.Ticker.addEventListener("tick", tick);
    }
    function addMask(event){
    	var image = event.target;
		mask = new createjs.Bitmap(image);
		stage.addChild(mask);
		mask.alpha = 0;
    }
    function ok(){
		// mask.alpha = 0;
		bac.alpha = 1;
		cloth1.alpha = 1;
		snow.alpha = 1;
		update = true;
		isOk = true;
		clip();
		$('.loadword,.loading').show();
		$('.isok,.title').hide();
		// setTimeout(function(){
		// 	$('.mask').hide();
		// 	$('.loadword,.loading').hide();
		// 	$('.title').show();
		// 	$('.input').show();
		// },1000);
    }
    function clip(){
    	var ctx = canvas.getContext('2d');
    	try{
    		var imgData=ctx.getImageData(270,433,210,230);
    	}catch(e){
         	$('.mask').hide();
			$('.loadword,.loading').hide();
			$('.title,.input,.share,.arr,#libao').show();
			alert('上传失败');
			return false;
    	}
    	var upCanvas = document.createElement('canvas');
    	upCanvas.width = 210;
    	upCanvas.height = 230;
    	var ctx2 = upCanvas.getContext('2d');
    	ctx2.putImageData(imgData,0,0);
    	var img = upCanvas.toDataURL("image/jpeg");
    	$.ajax({
             type: "post",
             url: "//pre.dj.kuaidadi.com/upload/img",
             data:{
             	imgData:img
             },
             success:function(data){
             	if (data.success) {
             		var loc = location.hostname+location.pathname;
             		var id = clList[indexC].id;
             		shareLoc = WXShareConfig.link = loc+"?img="+data.url+"&ids="+id;
             		WXShareConfig.imgUrl = "http:"+WXShareConfig.imgUrl;
             		if(wx){
			            wx.onMenuShareTimeline(WXShareConfig);
			            wx.onMenuShareAppMessage(WXShareConfig);
			            wx.onMenuShareQQ(WXShareConfig);
			            wx.onMenuShareWeibo(WXShareConfig);
			        }
	             	$('.mask').hide();
					$('.loadword,.loading').hide();
					$('.title,.input,.share,.arr,#libao').show();
             	}else{
             		$('.mask').hide();
					$('.loadword,.loading').hide();
					$('.title,.input,.share,.arr,#libao').show();
             		alert('生成失败，请重试');
             	};
             }
         });

    }
    function showMask(){
    	stage.setChildIndex(bitmap,0);
    	stage.removeChild(dfImg);
		bac.alpha = 0;
		snow.alpha = 0;
		cloth1.alpha = 0;
		$('.mask').show();
		$('.isok').show();
		$('.input,.share,.arr,#libao').hide();
		update = true;
    }
    function addCloth(){
    	cLoad++;
    	if (cLoad==clList.length) {
			resetCloth(2);
    	};
    }
    function resetCloth(d){
    	if (d == 0||d == 1) {
    		var f = clList.shift();
    		clList.push(f);
    		console.log(clList);
    	}
    	roll();
    	// cloth1.image = clList[1].image;
    	if (cloth1) {
    		stage.removeChild(cloth1);
    	};
    	cloth1 = new createjs.Bitmap(clList[indexC].image);
    	stage.addChild(cloth1);
    	cloth1.scaleX = cloth1.scaleY = cloth1.scale = clList[indexC].width / cloth1.image.width;
    	cloth1.x = clList[indexC].x,
		cloth1.y = clList[indexC].y;

		// cloth2.image = clList[2].image;
		if (cloth2) {
    		stage.removeChild(cloth2);
    	};
    	indexN = indexC +1;
		cloth2 = new createjs.Bitmap(clList[indexN].image);
		stage.addChild(cloth2);
		cloth2.scaleX = cloth2.scaleY = cloth2.scale = clList[indexN].width / cloth2.image.width;
    	cloth2.x = clList[indexN].x+750,
		cloth2.y = clList[indexN].y;
		clothok = true;
		isAll();
		update = true;
    }
    function isAll(){
    	if (snowok&&clothok&&bacok&&dfImgok) {
    		var index = stage.children.length;
			stage.setChildIndex(cloth2,index-3);
			stage.setChildIndex(cloth1,index-2);
			stage.setChildIndex(snow,index-1);
			update = true;
    	};
    }
    function roll(){
    	if (nowIndex) {
    		for (var i = 0; i < nowIndex; i++) {
	    		var f = clList.shift();
	    		clList.push(f);
    		};
    	};
    	nowIndex = 0;
    }
    function tick(event) {
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update) {
            update = false; // only update once
            stage.update(event);
        }
    }
    $('.mask').on('touchstart',function(e){
    	e.preventDefault();
    })
    hammerMask.on('pinchmove', function(ev) {
    	if (isOk||!bitmap) {
    		return false
    	};
        bitmap.scaleX = bitmap.scaleY = bitmap.scale = iniS*ev.scale;
        update = true;
    });
    hammerMask.on('pinchend', function(ev) {
    	if (!bitmap) {
    		return false
    	};
    	iniS = bitmap.scaleX;
        // console.log(ev);
    });
    hammerMask.on('pan', function(ev) {
    	if (isOk||!bitmap) {
    		return false
    	};
    	bitmap.x = iniP.x+ev.deltaX;
    	bitmap.y = iniP.y+ev.deltaY;
    	update = true;
    });
    hammerMask.on('panend', function(ev) {
    	if (!bitmap) {
    		return false
    	};
    	iniP = {
        	x:bitmap.x,
        	y:bitmap.y
        }
    	// console.log(ev);
    });
    hammertime.on('swipeleft',function(ev){
    	if (cloth1&&!move&&isOk) {
    		trunL();
    	};
    })
    hammertime.on('swiperight',function(ev){
    	if (cloth1&&!move&&isOk) {
    		trunR();
    	};
    });
    function trunR(){
    	move = true;
		createjs.Tween.get(cloth1, {}).to({x: 750}, 500, createjs.Ease.getBackInOut(.6)).call(function(){
			move = false;
		});
		var x = cloth2.x = cloth2.x-1500;
		createjs.Tween.get(cloth2, {}).to({x: x+750}, 500, createjs.Ease.getBackInOut(.6)).call(function(){
			move = false;
			resetCloth(1);
			var id = clList[indexC].id;
			WXShareConfig.link = shareLoc+"&ids="+id;
			// WXShareConfig.imgUrl = "http:"+WXShareConfig.imgUrl;
			if(wx){
	            wx.onMenuShareTimeline(WXShareConfig);
	            wx.onMenuShareAppMessage(WXShareConfig);
	            wx.onMenuShareQQ(WXShareConfig);
	            wx.onMenuShareWeibo(WXShareConfig);
		    }
		});
    }
    function trunL(){
    	move = true;
		createjs.Tween.get(cloth1, {}).to({x: -750}, 500, createjs.Ease.getBackInOut(.6)).call(function(){
			move = false;
		});
		var x = cloth2.x;
		createjs.Tween.get(cloth2, {}).to({x: x-750}, 500, createjs.Ease.getBackInOut(.6)).call(function(){
			move = false;
			resetCloth(0);
			var id = clList[indexC].id;
			WXShareConfig.link = shareLoc+"&ids="+id;
			// WXShareConfig.imgUrl = "http:"+WXShareConfig.imgUrl;
			if(wx){
	            wx.onMenuShareTimeline(WXShareConfig);
	            wx.onMenuShareAppMessage(WXShareConfig);
	            wx.onMenuShareQQ(WXShareConfig);
	            wx.onMenuShareWeibo(WXShareConfig);
		    }
		});
    }
	$('.isok').on('click',function(){
		ok();
	});
	$('.share').on('click',function(){
		$('.share-mask').show();
	});
	$('.share-mask').on('click',function(){
		$(this).hide();
	});
	$('#btn2').on('click',function(){
		$(this).hide();
		$('#btn1,#pic,.share').show();
	})
	$('#libao').on('click',function(){
		window.location = "http://dc.tt/vF2H";
	})
	$('.arrr').on('click',function(){
		trunL();
	});
	$('.arrl').on('click',function(){
		trunR();
	});
})
