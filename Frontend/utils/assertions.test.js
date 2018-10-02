const expect = require('expect');
const utils = require('./utils');
it('should subtract two numbers',()=>{
	var res = utils.subtract(5,5);

	 expect(res).toBe(0);
});

it('should add two numbers',()=>{
	var res = utils.add(5,5);

	 expect(typeof res).toBe('number');	
});

it('should expect equal values',()=>{
	expect({name: 'Himanshu'}).toEqual({name: 'Himanshu'});
});

it('should expect number in array',()=>{
	expect([1,2,3]).toContain(2);
});

it('should not expect values',()=>{
	expect({
		name: 'Himanshu',
		location: 'Tempe'
	}).not.toContain({
		name: 'Himanshu',
		location: 'Mesa'
	})
});