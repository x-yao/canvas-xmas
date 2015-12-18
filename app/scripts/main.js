$(function() {
    var canvas, stage;
    var canvas = document.getElementById("myCanvas");
    var stage;
    var update = true;
    var hammertime = new Hammer(canvas);
    var iniS;
    var bitmap;
    hammertime.get('pinch').set({
	    enable: true
	});
    function init() {
        stage = new createjs.Stage(canvas);
        createjs.Touch.enable(stage);
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

                };

                //e.target.result;
            }
        })(f, target);
    });

    function addPic(image) {
        bitmap = new createjs.Bitmap(image);
        stage.addChild(bitmap);
        bitmap.sourceRect = new createjs.Rectangle(0, 0, bitmap.image.width, bitmap.image.height);
        // 	bitmap.x = canvas.width * Math.random() | 0;
        // bitmap.y = canvas.height * Math.random() | 0;
        // bitmap.rotation = 360 * Math.random() | 0;
        iniS = bitmap.scaleX = bitmap.scaleY = bitmap.scale = 640 / bitmap.image.width;
        // bitmap.scaleX = bitmap.scaleY = bitmap.scale = Math.random() * 0.4 + 0.6;
        bitmap.name = "bg";
        // bitmap.cursor = "pointer";
        createjs.Ticker.addEventListener("tick", tick);
    }

    function tick(event) {
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update) {
            update = false; // only update once
            stage.update(event);
        }
    }
    hammertime.on('pinchmove', function(ev) {
        bitmap.scaleX = bitmap.scaleY = bitmap.scale = iniS*ev.scale;
        update = true;
    });
    hammertime.on('pinchend', function(ev) {
    	iniS = bitmap.scaleX;
        console.log(ev);
    });
    hammertime.on('rotate', function(ev) {
        console.log(ev);
    });
})
