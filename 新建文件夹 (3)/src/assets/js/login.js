var canvas = document.getElementById("canv");
var context = canvas.getContext("2d");
var button = document.getElementById("bt");
var input = document.getElementById("inp");
draw();
canvas.onclick = function () {
    context.clearRect(0,0,120,40);
    draw();
}
function getColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b +")";
}
function draw() {
    context.strokeRect(0,0,120,40);
    var aCode = ["0", "1", "2", "3", "4", "5" ,"6", "7" ,"8" ,"9"];
    var arr = [];
    var num
    for (var i = 0; i<4; i++){
        var x = 20 + i * 20;
        var y = 20 + 10 * Math.random();
        var index = Math.floor(Math.random() * aCode.length);
        var txt = aCode[index];
        context.font = "blod 20px 微软雅黑"
        context.fillStyle=getColor();
        context.translate(x,y);
        var deg = 90*Math.random()*Math.PI/180;
        context.rotate(deg);
        context.fillText(txt, 0, 0);
        context.rotate(-deg);
        context.translate(-x,-y);
        arr[i] = txt
    }
    num = arr[0] + arr[1] + arr[2] + arr[3]
    var user = document.getElementById("user");
    var password = document.getElementById("password");
    var res = document.getElementById("all");
    res.onmousemove = function(){
        if(user.value == '' || password.value == '' || input.value == ''){
            button.style.display="none";
        }else{
            button.style.display="block";
        }
    }
    button.onclick = function () {
        if (num != input.value){
            alert('验证码错误');
        }
    }
}