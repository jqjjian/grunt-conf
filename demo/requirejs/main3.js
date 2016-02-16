/*!
 * main
 * author: xiewulong
 * create: 2013/9/29
 * update: 2013/9/29
 */

alert('main3.outside');

define(['jquery'], function($){

	var init	= {
			module: function(){
				alert('main3.inside');
			}
		},
		main	= {
			show: function(){
				alert('main3.use');
			}
		};
		alert('jquery version: ' + $().jquery);


	return $.extend(main, $.loader(init));

});