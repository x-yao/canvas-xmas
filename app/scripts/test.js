class color {
	constructor(color){
		this.color = color;
	}
	aaa(num){
		// console.log(num);
		return num;
	}
}
class subColor extends color{
	constructor(color2){
		super(color2);
		this.color2 = color2;
	}
	bbb(num){
		// console.log(num);
		return super.aaa(num);
	}
}
let a = new subColor('#FFF');
console.log(a.color,a.color2);
let b = a.bbb(123);
console.log(b);
// console.log(a.bbb(1));
