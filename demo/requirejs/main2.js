/*!
 * main
 * author: xiewulong
 * create: 2013/9/29
 * update: 2013/9/29
 */

alert('main2.outside');

define(['main3'], function(m3){

	var init	= {
			module: function(){
				alert('main2.inside');
			}
		},
		main	= {
			show: function(){
				alert('main2.use');
			}
		};
		//alert('2');
		m3.show();

	return $.extend(main, $.loader(init));

});