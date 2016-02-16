(function($){
	if(!$('.J_wrap').size())return;
	$('.J_wrap').each(function(){//分别执行
		var $this = $(this),
				$wind = $this.find('.J_window'),
				$subli = $wind.find('li'),
				vHeight = $subli.height(),
				vNub = $subli.size(),
				now = 0,
				ready = true,
				vWsize = 0,
				vHsize = 0;
				$wind.width(vHeight*4);
				$wind.height(vHeight*2);
		for (var i=0;i<vNub;i++){//循环遍历每张图片按一定规律绝对定位排列
				if(vWsize>3){//判断,每超过4张图片时,使下张图片的left属性从0开始,保证每行只有4张图片排列
					vWsize = 0;
				}
			$subli.eq(i).css('left',$subli.width()*vWsize);
			vWsize++;
			if(vHsize>7){//每次只能看到8张图片,判断从第9张图片开始往后所有的图片都隐藏排列起来
					vHsize = 8;
					$subli.eq(i).hide();
					move($subli.eq(i),{opacity:0},0);
				}
			$subli.eq(i).css('top',parseInt(vHsize/4)*$subli.height());
			vHsize++;
		};
		$('.prev').on('click',function(){//向上翻页
			if(!ready || now==0)return;
			ready = false;//动画执行过程中按钮禁用
			now-=4;
			var i = 12,
					time = setInterval(function(){//间隔一段时间,判断每一行并且执行动画
						if(i>7){//第三行
							move($subli.eq(i+now),{opacity:0,top:vHeight*2},function(){//动画结束后执行回调函数
								$(this).hide();								
							});							
						}						
						else if(i<4){//第一行
							$subli.eq(i+now).show();
							move($subli.eq(i+now),{opacity:1,top:0},function(){//所有动画结束后,铵扭可用
								ready = true;
							});
						}
						else{//第二行
							move($subli.eq(i+now),{top:vHeight});
						};						
						if(i==0){//停止计时器
							clearInterval(time);
						}
						i--;
					},35);
		});
		$('.next').on('click',function(){//向下翻页
			if(!ready || vNub-now<12) return;
			ready = false; //动画执行过程中按钮禁用
			var i = 0,
					time = setInterval(function(){//间隔一段时间,判断每一行并且执行动画
						if(i<4){//第一行
							move($subli.eq(i+now),{opacity:0,top:-vHeight},function(){//动画结束后执行回调函数
								$(this).hide();								
							});
						}						
						else if(i>7){//第三行
							$subli.eq(i+now).show();					
							move($subli.eq(i+now),{opacity:1,top:vHeight},function(){//所有动画结束后,铵扭可用
								ready = true;
							});
						}
						else{//第二行
							move($subli.eq(i+now),{top:0});
						};
						i++;
						if(i==12){//停止计时器
							clearInterval(time);
							now+=4;
						}
					},35);
		});
		function move($obj,json,fn){//动画框架
			$obj.stop();
			$obj.animate(json,{duration:400,easing:"easeOutQuad",complete:fn});
		};
	});
})(jQuery);

// $('.J_btn').click(function(){
// 	var vtxt = $('.J_text').val();
// 	if(vtxt.match(/^[\+]?\d+(\.(\d{1,}))?$/g)){
// 		alert('正数');
// 	}
// 	else {
// 		alert('负数或非数字');
// 	}
// });