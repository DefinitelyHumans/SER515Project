// Test cases to run
//Behavior Driven Development

const utils = require('./utils');

it('should add two numbers',()=>{
	var res = utils.add(3,5);
	if(res!== 8){
		throw new Error(`Expected 8 but got ${res}`);
	}
}); 

it('should square a number',()=>{
	var r = utils.square(5);
	if(r!==25){
		throw new Error(`Expected 25 but got ${r}`);
	}
});

