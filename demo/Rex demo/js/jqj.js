(function($){
	var $val = $('.J_val'),
	vVal1 = null,//参照值
	vVal2 = null,//文本内容
	$oDiv = $('.J_div'),
	$span = $oDiv.find('span'),
	tag = 1;
	$val.on('keyup',function(){//按键弹起事件
		vVal2 = $val.val();
		if(vVal1==vVal2)return;
		$span.html(vVal2.length + vVal2.match(/[\u4e00-\u9fa5]*/g).join('').length);//匹配中文后,取出返回一个数组;join('')设置数组连接符为空;得到一个只有中文的数组获取长度加入到文本内容总长度中
		vVal1 = vVal2;//设置参照值
		if(tag==0)return;//如果文字已经显示了就不需要重复执行显示交互效果
		$oDiv.show();
		tag = 0;
	});
})(jQuery);
