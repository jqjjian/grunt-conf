(function($){
	$('.J_wrap').each(function(){
		var $this		=		$(this),
				$li			=		$this.find('ul li'),
				vsize		=		$li.size(),
				vnow 		= 	null,
				vVal		=		null,
				btnTag	= 	null,
				tag 		=		true; //开关
		$this.on('click','a',function(){//点击事件
			$(this).hasClass('btn') ? btnTag = 1 : btnTag = 0; //判断点击哪个按钮
			fade();
		});
		function move($obj,val,fn){//动画框架
			$obj.stop();
			$obj.animate({opacity:val},400,fn);
		};
		function fade(){//淡出淡入切换图片
			if(btnTag==1){
				if(!tag || vnow>=16) return;
			}
			else {
				if(!tag || vnow<=0) return;
			}
			btnTag==1 ? (vnow+=vsize , vVal = 0) : (vnow-=vsize , vVal = 9);
			tag = false; //关闭开关
			var i =	(btnTag==1) ? 0 : 7,
					time = setInterval(function(){//计时器
						move($li.eq(i),0,function(){//淡出效果,运动结束之后执行回调
							btnTag==1 ?	vVal++ : vVal--;
							if(vVal>8 || vVal<1){
								vVal = 1;
							}
							if((vnow+vVal)>20 || (vnow + vVal)<0)return;//超过最大图片数或者小于0后停止循环
							$(this).find('img').attr('src',"images/"+(vnow + vVal)+".jpg");//切换图片
							move($(this),1,function(){//淡入效果,开关打开
								tag = true;	
							});
						});
						btnTag==1 ? i++ : i--;
						if(i>7 || i<0){//停止计时器
							clearInterval(time);					
						}
					},35);
		}
	});
})(jQuery);
