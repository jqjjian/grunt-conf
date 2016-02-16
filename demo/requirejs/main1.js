/*!
 * main
 * author: xiewulong
 * create: 2013/9/29
 * update: 2013/9/29
 */

alert('main1.outside');

define(['jqueryX', 'main2'], function($, m2){

	var init	= {
			module: function(){
				alert('main1.inside');
			}
		},
		main	= {
			show: function(){
				alert('main1.use');
			}
		};
		//alert('1');
		m2.show();

	return $.extend(main, $.loader(init));

});

