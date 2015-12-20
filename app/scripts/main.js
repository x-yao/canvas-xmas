$(function() {
    var canvas, stage;
    var canvas = document.getElementById("myCanvas");
    var stage;
    var update = true;
    var isOk = false;
    var hammertime = new Hammer(canvas);
    var iniS;
    var iniP;
    var bitmap;
   	var bac;
   	var mask;
   	var cLoad = 0;
   	var c;
   	var nowIndex = 0;
   	var move = false;
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
    function init() {
        stage = new createjs.Stage(canvas);
        createjs.Touch.enable(stage);
        var image = new Image();
		image.src = "images/bac.png";
		image.onload = addBac;
        var image2 = new Image();
		image2.src = "images/mask.png";
		image2.onload = addMask;
		var image3 = new Image();
		image3.src = "images/c1.png";
		image3.onload = addCloth;
		var image4 = new Image();
		image4.src = "images/c2.png";
		image4.onload = addCloth;
		var image5 = new Image();
		image5.src = "images/c3.png";
		image5.onload = addCloth;
		c = [image3,image4,image5];
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
        reader.onload = (function(theFile) {
            return function(e) {
                var img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    // ctx.drawImage(img,0,0,320,640);
                    addPic(img);
                    showMask();
                };
                //e.target.result;
            }
        })(f, target);
    });
    function addBac(event){
    	var image = event.target;
		bac = new createjs.Bitmap(image);
		stage.addChild(bac);
		bac.scaleX = bac.scaleY = bac.scale = 750 / bac.image.width;
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", stage);
    }
    function addPic(image) {
    	if (bitmap) {
    		stage.removeChild(bitmap);
    	};
    	isOk = false;
    	bitmap = new createjs.Bitmap(image);
        stage.addChild(bitmap);
        bitmap.sourceRect = new createjs.Rectangle(0, 0, bitmap.image.width, bitmap.image.height);
        EXIF.getData(image, function() {
    		Orientation = EXIF.getTag(this,"Orientation");
	        console.log(Orientation);
	        if(Orientation != "" && Orientation != 1){  
	            //alert('旋转处理');  
	            switch(Orientation){  
	                case 6://需要顺时针（向左）90度旋转  
	                	bitmap.rotation = 90;
	                	iniS = bitmap.scaleX = bitmap.scaleY = bitmap.scale = 750 / bitmap.image.height;
        				bitmap.x = 750;
	                    break;  
	                case 8://需要逆时针（向右）90度旋转  
	                    rotateImg(this,'right',canvas);  
	                    break;  
	                case 3://需要180度旋转  
	                    rotateImg(this,'right',canvas);//转两次  
	                    rotateImg(this,'right',canvas);  
	                    break;
	            }         
        	}
        	else{
        		iniS = bitmap.scaleX = bitmap.scaleY = bitmap.scale = 750 / bitmap.image.width;
        	}
	    });
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
		$('.isok').on('click',function(){
			ok();
		})
    }
    function ok(){
		mask.alpha = 0;
		bac.alpha = 1;
		cloth1.alpha = 1;
		update = true;
		isOk = true;
		$('.isok').hide();
    }
    function showMask(){
    	stage.setChildIndex(bitmap,0);
    	// stage.setChildIndex(mask,3);
    	mask.alpha = 0.6;
		mask.scaleX = mask.scaleY = mask.scale = 750 / mask.image.width;
		bac.alpha = 0;
		update = true;
		$('.isok').show();
    }
    function addCloth(){
    	cLoad++;
    	if (cLoad=3) {
			cloth1 = new createjs.Bitmap(c[0]);
			stage.addChild(cloth1);
			cloth1.scaleX = cloth1.scaleY = cloth1.scale = 516 / cloth1.image.width;
			cloth1.alpha = 0;
			cloth1.x = 83,
			cloth1.y = 276;
			// update = true;
    	};
    }
    function tick(event) {
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update) {
            update = false; // only update once
            stage.update(event);
        }
        if (move) {
        	// cloth1.x = cloth1.x - 100;
        	// if (cloth1 < -750) {
        	// 	move = false;
        	// };
        	stage.update(event);
        };
    }
    hammertime.on('pinchmove', function(ev) {
    	if (isOk||!bitmap) {
    		return false
    	};
        bitmap.scaleX = bitmap.scaleY = bitmap.scale = iniS*ev.scale;
        update = true;
    });
    hammertime.on('pinchend', function(ev) {
    	if (!bitmap) {
    		return false
    	};
    	iniS = bitmap.scaleX;
        // console.log(ev);
    });
    hammertime.on('pan', function(ev) {
    	if (isOk||!bitmap) {
    		return false
    	};
    	console.log(ev.deltaX,ev.deltaY);
    	bitmap.x = iniP.x+ev.deltaX;
    	bitmap.y = iniP.y+ev.deltaY;
    	update = true;
    });
    hammertime.on('panend', function(ev) {
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
    	if (cloth1&&!move) {
    		move = true;
    		createjs.Tween.get(cloth1, {}).to({x: -600}, 1000, createjs.Ease.getPowInOut(1)).call(function(){
    			move = false;
    		});
    	};
    	console.log(ev);
    })
    hammertime.on('swiperight',function(ev){
    	if (cloth1&&!move) {
    		move = true;
    		createjs.Tween.get(cloth1, {}).to({x: 750}, 1000, createjs.Ease.getPowInOut(1)).call(function(){
    			move = false;
    		});
    	};
    	console.log(ev);
    })
    //次优先级 - 旋转
    // hammertime.on('rotate', function(ev) {
    // 	// bitmap.rotation = ;
    // 	console.log(bitmap.rotation);
    //     console.log(ev.angle);
    // });
})
