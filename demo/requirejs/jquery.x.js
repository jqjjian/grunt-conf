/*!
 * jQuery X Plugins v1.0.0
 * xiewulong <xiewulong@vip.qq.com>
 * http://xiewulong.github.io/jqueryX
 * https://github.com/xiewulong/jqueryX/blob/master/MIT-License
 * create: 2013/5/16
 * update: 2014/2/9
 */

(function(window, undefined){

	/**
	 * jQuery X Plugins
	 * @module jqueryX
	 * @since 1.0.0
	 */
	var jQueryX = function($){

			var $win	= $(window),
				$doc	= $(document),
				Fn		= function(){};

			/**
			 * jquery静态方法
			 * @class $.extend
			 * @since 1.0.0
			 */
			$.extend({

				/**
				 * 粘贴板
				 * @method $.clip
				 * @since 1.0.0
				 * @param {object} d 文本输入区对象
				 * @param {function} [fn] 回调
				 * @return {none}
				 * @example $.clip(d, fn);
				 */
				clip: function(d, fn){
					var clip,
						text	= $(d).val(),
						fn		= fn || Fn;

					if((clip = window.clipboardData)){

						//IE,直接复制到剪贴板
						clip.clearData();
						clip.setData("text", text);
						fn.call(d, true);

					}else{

						//非IE,只作选中处理
						d.focus();
						d.selectionStart	= 0,
						d.selectionEnd		= text.length;
						fn.call(d, false);

					}

				},

				/**
				 * 加载程序
				 * @method $.loader
				 * @since 1.0.0
				 * @param {object} fns 程序集合
				 * @param {bool} [onload=undefined] 默认页面onload完成后执行
				 * @return {object} fns
				 * @example $.loader(fns, onload);
				 */
				loader: function(fns, onload){
					//onload ? _loader() : $(_loader);

					return fns;

					function _loader(){
						if($.isFunction(fns)){
							fns();
						}else if($.isPlainObject(fns)){
							for(var name in fns)$.isFunction(fns[name]) && fns[name]();
						}
					}
				},
				
				/**
				 * 弹窗
				 * @method $.pop
				 * @since 1.0.0
				 * @param {object} prop 参数
				 * @param {string} prop.html 弹窗内容
				 * @param {string} [prop.parent='body'] dom父级
				 * @param {string} [prop.id='jq_x_pop'] id
				 * @param {string} [prop.close='jq_x_pop_c'] 关闭按钮类名
				 * @param {number} [prop.width=0] 弹窗宽度,默认auto
				 * @param {number} [prop.height=0] 弹窗高度,默认auto
				 * @param {string} [prop.position='fixed'] 定位方式
				 * @param {number} [prop.top=0] top值,默认为垂直居中
				 * @param {number} [prop.left=0] left值,默认为水平居中
				 * @param {bool} [prop.bg=true] 遮罩蒙板,默认显示,不显示则弹窗失去焦点即关闭
				 * @param {bool} [prop.bgclose=true] 默认点击遮罩蒙板即关闭弹窗
				 * @param {bool} [prop.bgcloser=true] 默认无遮罩蒙板情况下弹窗失去焦点即关闭
				 * @param {string} [prop.bgcolor='#000'] 遮罩蒙板底色,默认黑色
				 * @param {number} [prop.opacity=.5] 遮罩蒙板透明度,默认50%
				 * @param {number} [prop.zIndex=100] 弹窗层级,遮罩蒙板层级prop.zIndex-1
				 * @param {string} [prop.animation] 动画效果,支持'fade'
				 * @param {number} [prop.duration=400] 动画持续时间
				 * @param {number} [prop.adjust=20] 调整与边界的最小距离
				 * @param {string} [prop.drag] 触发拖曳选择器,默认不开启此功能
				 * @param {function} [prop.fn=false] 开启弹窗回调
				 * @param {function} [prop.fnC=false] 关闭弹窗回调
				 * @return {object} $(pop)
				 * @example $.pop(prop);
				 */
				pop: function(prop){
					var adjust, style, w, h, auto,
						config = {
							html		: '',
							parent		: 'body',
							id			: 'jq_x_pop',
							close		: '',
							width		: 0,
							height		: 0,
							position	: 'fixed',
							top			: 0,
							left		: 0,
							bg			: true,
							bgclose		: true,
							bgcloser	: true,
							bgcolor		: '#000',
							opacity		: .5,
							zIndex		: 100,
							animation	: '',
							duration	: 400,
							adjust		: 20,
							drag		: '',
							fn			: false,
							fnC			: false
						},
						doc_w	= $doc.width(),
						doc_h	= $doc.height();

					//重置参数
					$.extend(config, prop);

					//弹窗内容为空不运行
					if(!config.html)return;

					//关闭
					$.popClose(config.id);

					//开启蒙板
					config.bg &&
						$.popBg({
							parent		: config.parent,
							id			: config.id + '_bg',
							close		: config.bgclose ? config.close || (config.id + '_c') : '',
							bgcolor		: config.bgcolor,
							fade		: config.animation ? true : false,
							duration	: config.duration,
							opacity		: config.opacity,
							zIndex		: config.zIndex - 1
						});

					//组织样式
					style	=	'display:inline;position:' + config.position + ';z-index:' + config.zIndex + ';' +
								(config.animation && config.width && config.height ? 'display:none;' : '') +
								(config.width ? 'width:' + config.width + 'px;' : '') +
								(config.height ? 'height:' + config.height + 'px;' : '');

					//创建并获取对象
					config.$pop  = $('<div id="' + config.id + '" class="' + config.id + '" style="'+ style +'">' + config.html + '</div>').appendTo(config.parent);

					//计算值
					w		= config.width || config.$pop.width(),
					h		= config.height || config.$pop.height(),
					auto	= config.position == 'fixed' ? _auto() : _auto(1);

					(config.left || config.top) && config.position == 'absolute' && (adjust = _adjust());

					//定位
					config.$pop.css({
						'left'		: config.left ? config.position == 'fixed' ? config.left : adjust.left : '50%',
						'marginLeft': config.left ? '' : auto.marginLeft,
						'top'		: config.top ? config.position == 'fixed' ? config.top : adjust.top : '50%',
						'marginTop'	: config.top ? '' : auto.marginTop
					});

					//ie6兼容
					config.position == 'fixed' &&
						$.ie6(function(){
							var _fixed;
							config.$pop.css({'position' : 'absolute'});
							(_fixed = function(){
								auto = _auto(1);
								config.$pop.css({
									'left'		: config.left ? config.left + $win.scrollLeft() : '50%',
									'marginLeft': config.left ? '' : auto.marginLeft,
									'top'		: config.top ? config.top + $win.scrollTop() : '50%',
									'marginTop'	: config.top ? '' : auto.marginTop
								});
							})();
							$win.resize(_fixed).scroll(_fixed);
						});

					//有效果
					if(config.animation){
						(!config.width || !config.height) && config.$pop.hide();
						switch(config.animation){
							case 'fade':
								config.$pop.stop().fadeIn(config.duration);
								break;
						}
					}

					//设置关闭按钮
					config.close = '.' + (config.close || (config.id + '_c'));
					$(config.close).on('click', function(e){
						(config.fnC || Fn).call(config.$pop.get(0));
						$.popClose(config.id, config.animation);
						e.stopPropagation();
					});

					//无背景蒙板则定义document关闭
					if(!config.bg && config.bgcloser){
						$doc.on('click', function(){config.$pop.remove();});
						config.$pop.on('click', function(e){e.stopPropagation();});
					}

					//拖曳,暂不支持ie6
					config.drag && config.$pop.find(config.drag).mousedown(function(e){
						var e		= e || event,
							x		= e.clientX,
							y		= e.clientY,
							$pop	= config.$pop,
							ml		= parseInt($pop.css('marginLeft')),
							mt		= parseInt($pop.css('marginTop'));
						document.onmousemove = function(e){
							var e		= e || event;
							$pop.css({
								'marginLeft'	: ml + e.clientX - x,
								'marginTop'		: mt + e.clientY - y
							});
							return false;
						}
						document.onmouseup = function(){
							document.onmouseup = document.onmousemove = null;
							return false;
						}
						return false;
					});

					//执行回调
					(config.fn || Fn).call(config.$pop.get(0), {width: doc_w, height: doc_h, adjust: config.adjust});

					return config.$pop;

					//调整left和top值
					function _adjust(){
						var l_max	= doc_w - config.adjust - w,
							t_max	= doc_h - config.adjust -h;

						return {
							left	: l_max < config.left ? l_max < config.adjust ? config.adjust : l_max : config.left < config.adjust ? config.adjust : config.left,
							top		: t_max < config.top  ? t_max < config.adjust ? config.adjust : t_max : config.top < config.adjust ? config.adjust : config.top
						};
					}

					//计算left和top值
					function _auto(scroll){
						return {
							marginLeft	: (scroll ? $win.scrollLeft() : 0) - w / 2,
							marginTop	: (scroll ? $win.scrollTop() : 0) - h / 2
						};
					}

				},
				
				/**
				 * 关闭弹窗
				 * @method $.popClose
				 * @since 1.0.0
				 * @param {string} id 弹窗id
				 * @param {string} [animation=undefined] 动画,支持'fade'
				 * @param {number} [duration=400] 动画持续时间
				 * @return {none}
				 * @example $.popClose(id, animation, duration);
				 */
				popClose: function(id, animation, duration){
					var id	= '.' + id,
						bg	= id + '_bg',
						all	= id + ',' + bg;

					switch(animation){
						case 'fade':
							$(all).stop().fadeOut(duration || 400, _remove);
							break;
						default:
							_remove(all);
							break;
					}

					function _remove(all){
						$(all || this).remove();
					}
				},
				
				/**
				 * 开启遮罩蒙板
				 * @method $.popBg
				 * @since 1.0.0
				 * @param {object} [prop] 参数
				 * @param {string} [prop.parent='body'] dom父级
				 * @param {string} [prop.id='jq_x_pop_bg'] id
				 * @param {string} [prop.close='jq_x_pop_c'] 关闭按钮选择器
				 * @param {string} [prop.bgcolor='#000'] 遮罩蒙板底色,默认黑色
				 * @param {bool} [prop.fade=false] 是否淡入淡出
				 * @param {number} [prop.duration=400] 动画持续时间
				 * @param {number} [prop.opacity=.5] 遮罩蒙板透明度,默认50%
				 * @param {number} [prop.zIndex=99] 遮罩蒙板层级
				 * @return {object} $(bg)
				 * @example $.popBg(prop);
				 */
				popBg: function(prop){
					var opacity, $bg,
						config = {
							parent		: 'body',			//父级
							id			: 'jq_x_pop_bg',	//id
							close		: 'jq_x_pop_c',		//关闭按钮类
							bgcolor		: '#000',			//蒙板颜色,默认黑色
							fade		: false,			//是否淡入
							duration	: 400,				//动画持续时间
							opacity		: .5,				//蒙板透明度,默认50%
							zIndex		: 99				//层级
						};

					//重置参数
					$.extend(config, prop);

					//重置样式
					opacity	= config.fade ? 0 : config.opacity;

					//创建弹窗并获取对象
					$bg = $('.' + config.id).size() == 0 ? $('<div id="' + config.id + '" class="' + config.id + ' ' + config.close + '" style="position:fixed;width:100%;height:100%;left:0;top:0;background:' + config.bgcolor + ';opacity:' + opacity + ';filter:alpha(opacity=' + opacity * 100 + ');z-index:' + config.zIndex + ';"></div>').appendTo(config.parent) : $('#' + config.id);

					//是否淡入
					config.fade && $bg.stop().animate({opacity : config.opacity}, config.duration);
					
					//ie6兼容
					$.ie6(function(){
						var _fixed;
						(_fixed = function(){
							$bg.css({
								'position'	: 'absolute',
								'height'	: $win.height(),
								'marginTop'	: $win.scrollTop()
							});
						})();
						$win.resize(_fixed).scroll(_fixed);
					});

					//返回蒙板
					return $bg;
				},

				/**
				 * 返回字符串长度/截取字符串
				 * @method $.textSize
				 * @since 1.0.0
				 * @param {string} text 字符串
				 * @param {number} [cutout] 需要截取的字符串的长度,为空则返回字符串长度
				 * @return {number/string} length/text
				 * @example $.textSize(text, cutout);
				 */
				textSize: function(text, cutout){
					var length = text.match(/[^ -~]/g) == null ? text.length : text.length + text.match(/[^ -~]/g).length;

					//是否截取字符串
					if(cutout){
						if(length > cutout){
							for(var i=0, len = text.length; i <= len; i++){
								if($.textSize(text.substring(0, i+1)) > cutout)return text.substring(0, i);
							}
						}else return text;
					}else return length;

				},

				/**
				 * ie6检测
				 * @method $.ie6
				 * @since 1.0.0
				 * @param {function} [fn] 回调
				 * @return {bool}
				 * @example $.ie6(fn);
				 */
				ie6: function(fn){
					var tag;

					//判断是ie6则执行回调
					(tag = navigator.userAgent.indexOf('MSIE 6.0') > 0) && (fn || Fn)();

					return tag;
				},

				/**
				 * 低于指定版本ie检测
				 * @method $.ltie
				 * @since 1.0.0
				 * @param {string} [ver=9] 版本
				 * @param {function} [fn] 回调
				 * @return {bool}
				 * @example $.ltie(ver, fn);
				 */
				ltie: function(ver, fn){
					var index, tag, version,
						userAgent	= navigator.userAgent;

					//判断是否ie
					if(userAgent.indexOf('MSIE') == -1)return;

					ver === undefined && (ver = 9);
					typeof ver === 'function' && (fn = ver, ver = 9);

					//获取版本号
					index	= userAgent.indexOf('MSIE'),
					version	= parseInt(userAgent.slice(index + 5, index + 7));
					
					//判断版本低于version则执行回调
					(tag = version < ver) && (fn || Fn)();

					return tag;
				},

				/**
				 * 指定ie版本检测
				 * @method $.ie
				 * @since 1.0.0
				 * @param {function} [fn] 回调
				 * @return {bool}
				 * @example $.ie(ver, fn);
				 */
				ie: function(ver, fn){
					var tag,
						userAgent = navigator.userAgent;

					typeof ver === 'function' && (fn = ver, ver = undefined);

					//获取版本号
					index	= userAgent.indexOf('MSIE'),
					version	= parseInt(userAgent.slice(index + 5, index + 7));

					//判断是ie或匹配版本号后则执行回调
					(tag = (index > 0 && (!ver || ver == version))) && (fn || Fn)();

					return tag;
				}

			});

			/**
			 * jQuery原型方法
			 * @class $.fn.extend
			 * @since 1.0.0
			 */
			$.fn.extend({

				//jQuery X Version
				x: '1.0.0',

				/**
				 * 模拟滚动条
				 * @method $.fn.scrolls
				 * @since 1.0.0
				 * @param {function} [fn] 回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.scrolls(fn);
				 */
				scrolls: function(fn){
					return this.each(function(){
						var scroll, scroller, up, down, gotop, content, html,
							$this	= $(this),
							_this	= this;

						if($this.find('.scroll').size() == 0){
							html = _this.innerHTML;
							$this.html('<div class="scroll_c"></div><div class="scroll"><a href="javascript:;" class="up">▲</a><a href="javascript:;" class="scroller"></a><a href="javascript:;" class="down">▼</a></div><a href="javascript:;" class="gotop"></a>').find('.scroll_c').html(html);
						}

						scroll		= $this.find('.scroll'),
						scroller	= scroll.find('.scroller'),
						up			= scroll.find('.up'),
						down		= scroll.find('.down'),
						gotop		= $this.find('.gotop'),
						content		= $this.find('.scroll_c');

						//拖曳
						scroller.get(0).onmousedown = function(e){
							var e		= e || event,
								$$this	= $(this),
								disY	= e.clientY - $$this.position().top;

							document.onmousemove	= function(e){
								var e	= e || event,
									t	= e.clientY - disY,
									_h	= content.height(),
									max	= scroll.height() - (down.height() || 0) - $$this.height(),
									min	= up.height() || 0;

								t > max && (t = max);
								t < min && (t = min);
								$$this.css({top: t});
								content.css({top:  - ((t - min) / (max - min)) * (_h - $this.height())});
								gotop[t > 0 ? 'show' : 'hide']();
								(fn || Fn).call(_this, t >= max);

								return false;
							};

							document.onmouseup		= function(){
								document.onmousemove = document.onmouseup = null;
								return false;
							};

							return false;
						};

						//返回顶部
						gotop.on('click', function(){
							content.css({top: 0});
							scroller.css({top: up.height() || 0});
							touch(this).hide();
						});

						//上下按钮
						up.on('click', function(e){_wheel(e, 120);});
						down.on('click', function(e){_wheel(e, -120);});

						//鼠标滚动
						_this.onmouseover = function(){
							if('onmousewheel' in this){
								this.onmousewheel = _wheel;
							}else{
								this.removeEventListener('DOMMouseScroll', _wheel, false);
								this.addEventListener('DOMMouseScroll', _wheel, false);
							}
						};

						//鼠标滚动handler
						function _wheel(e, d){
							var e		= e || event,
								delta	= (d || (e.wheelDelta ? e.wheelDelta : - e.detail * 40)) / 2,
								t		= content.position().top + delta,
								max		= $this.height() - content.height(),
								h_up	= up.height() || 0,
								h_all	= scroll.height() - h_up - (down.height() || 0) - scroller.height();

							t < max && (t = max);
							t > 0 && (t = 0);
							content.css({top: t});
							scroller.css({top: (t / max) * h_all + h_up});
							gotop[t < 0 ? 'show' : 'hide']();
							(fn || Fn).call(_this, t >= max);
							e.preventDefault ? e.preventDefault() : (event.returnValue = false);
						}
					}).fixScrolls();
				},

				/**
				 * 设置模拟滚动条高度
				 * @method $.fn.fixScrolls
				 * @since 1.0.0
				 * @return {object} this
				 * @chainable
				 * @example $.fn.fixScrolls();
				 */
				fixScrolls: function(){
					return this.each(function(){
						var $this		= $(this),
							scroll		= $this.find('.scroll'),
							scroller	= scroll.find('.scroller'),
							h			= $this.height(),
							_h			= this.scrollHeight;

						scroller.height((scroll.height() - (scroll.find('.up').height() || 0) - (scroll.find('.down').height() || 0)) * h / _h);
						scroll[h < _h ? 'show' : 'hide']();

						if(h >= _h){
							scroller.css({'top': 0});
							$this.find('.scroll_c').css({'top': 0});
						}
					});
				},

				/**
				 * 复选全选
				 * @method $.fn.checkAll
				 * @since 1.0.0
				 * @param {string} selector 复选框
				 * @param {function} [fn] 全选回调
				 * @param {function} [fnC] 复选回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.checkAll(selector, fn, fnC);
				 */
				checkAll: function(selector, fn, fnC){
					var $cbs	= $(selector),
						all		= $(this.selector + ',' + selector),
						fn		= fn || Fn,
						fnC		= fnC || fn,
						$this	= this;

					//监测复选框
					$cbs.change(function(){
						var _checked = _check();
						$this.prop('checked', _checked);
						fnC.call(this, _checked);
					});

					//监测全选框
					return this.change(function(){
						var _checked = this.checked;
						all.prop('checked', _checked);
						fn.call(this, _checked);
					});

					//检测状态
					function _check(){
						var tag = true;
						$cbs.each(function(){
							!this.checked && (tag = false);
						});
						return tag;
					}

				},

				/**
				 * 模拟复选
				 * @method $.fn.checkboxs
				 * @since 1.0.0
				 * @param {string} [on='on'] 选中
				 * @param {function} [fn] 回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.checkboxs(on, fn);
				 */
				checkboxs: function(on, fn){
					on === undefined && (on = 'on');
					typeof on === 'function' && (fn = on, on = 'on');

					return this.on('click', function(){
						$(this).toggleClass(on);
						(fn || Fn).call(this);
					});
				},

				/**
				 * 模拟单选
				 * @method $.fn.radios
				 * @since 1.0.0
				 * @param {string} [on='on'] 选中
				 * @param {function} [fn] 回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.radios(on, fn);
				 */
				radios: function(on, fn){
					var $this = this;

					on === undefined && (on = 'on');
					typeof on === 'function' && (fn = on, on = 'on');

					return this.on('click', function(){
						$this.removeClass(on);
						$(this).addClass(on);
						(fn || Fn).call(this);
					});
				},

				/**
				 * 模拟列表框
				 * @method $.fn.selects
				 * @since 1.0.0
				 * @param {object} [prop] 参数
				 * @param {string} [prop.parent] 阻止冒泡的父级
				 * @param {string} [prop.disabled='disabled'] 禁用class
				 * @param {string} [prop.trigger] 触发按钮
				 * @param {string} [prop.span='span'] 存值器
				 * @param {string} [prop.p='p'] 弹出列表,默认为'p'
				 * @param {string} [prop.a='a'] 选项,默认为'a'
				 * @param {string} [prop.onW] 列表展开状态class
				 * @param {string} [prop.onS] 有值状态class
				 * @param {string} [prop.onA] 选项选中状态class
				 * @param {string} [prop.animation] 弹出动画,支持'silde/fade'
				 * @param {number} [prop.duration=100] 动画持续时间
				 * @param {bool} [prop.toggle=true] 是否点击切换显示,
				 * @param {function} [prop.fn=false] trigger回调
				 * @param {function} [prop.fnA=false] a回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.selects(prop);
				 */
				selects: function(prop){
					var p_all, hide_all,
						config	= {
							parent		: '',
							disabled	: 'disabled',
							trigger		: '',
							span		: 'span',
							p			: 'p',
							a			: 'a',
							onW			: '',
							onS			: '',
							onA			: '',
							animation	: '',
							duration	: 100,
							toggle		: true,
							fn			: false,
							fnA			: false
						},
						$this	= this;

					//重置参数
					$.extend(config, prop);
					
					//获取所有下拉
					p_all = $this.find(config.p);

					//document点击隐藏列表
					(config.parent ? $(config.parent) : $doc).on('click', (hide_all = function(){
						switch(config.animation){
							case 'slide':
								p_all.stop().slideUp(config.duration);
								break;
							case 'fade':
								p_all.stop().fadeOut(config.duration);
								break;
							default:
								p_all.hide();
								break;
						}
						config.onW && $this.removeClass(config.onW);
					}));

					return this.each(function(){
						var $$this	= $(this),
							trigger	= $$this.find(config.trigger || config.span),
							span	= $$this.find(config.span),
							p		= $$this.find(config.p),
							a		= p.find(config.a);

						//展开事件
						trigger.off().on('click', function(e){
							var _display;
							//禁用
							if($$this.hasClass(config.disabled))return;

							if(config.toggle && p.css('display') !== 'none')return;

							//隐藏其它列表
							hide_all();

							switch(config.animation){
								case 'slide':
									p.stop().slideDown(config.duration);
									break;
								case 'fade':
									p.stop().fadeIn(config.duration);
									break;
								default:
									p.show();
									break;
							}
							config.onW && $$this.addClass(config.onW);
							(config.fn || Fn).call($$this.get(0));

							e.stopPropagation();
						});

						//选项事件
						a.off().on('click', function(e){
							var $$this	= $(this),
								tagname	= span.get(0).tagName.toUpperCase(),
								text = (config.fnA || Fn).call(this);
							if(text === false){
								e.stopPropagation();
							}else{
								text === undefined && (text = $$this.text());
								tagname == 'INPUT' || tagname == 'TEXTAREA' ? span.val(text) : span.html(text);
								config.onS && span.addClass(config.onS);
								config.onA	&& (a.removeClass(config.onA), $$this.addClass(config.onA));
							}
						});

						//加载检测选项值
						config.onA &&
							a.each(function(){
								var $$this	= $(this),
									text	= $$this.text(),
									tagname	= span.get(0).tagName.toUpperCase(),
									_text	= tagname == 'INPUT' || tagname == 'TEXTAREA' ? span.val() : span.text();
								_text == text && $$this.addClass(config.onA);
							});
					});
				},

				/**
				 * tab切换
				 * @method $.fn.tabs
				 * @since 1.0.0
				 * @param {string} selector 切换页
				 * @param {string} [on='on'] tab按钮效果切换class
				 * @param {string} [type='click'] 事件类型,支持'click/hover'
				 * @param {number} [index=0] 默认索引
				 * @param {function} [fn] 回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.tabs(selector, on, type, index, fn);
				 */
				tabs: function(selector, on, type, index, fn){
					typeof on === 'function' && (fn = on, on = 'on');
					typeof type === 'function' && (fn = type, type = undefined);
					typeof index === 'function' && (fn = index, index = 0);
					!type && (on == 'click' || on == 'hover') && (type = on);
					index === undefined && (index = 0);

					var cutover,
						etype	= type == 'hover' ? 'mouseover' : 'click',
						$this	= this;

					(cutover = function(i){
						var $cons = $(selector);

						//添加class
						$this.removeClass(on).eq(i).addClass(on);

						//显示相应内容区域
						$cons.hide().eq(i).show();

						//执行回调
						(fn || Fn).call($this.get(i), i, $cons.get(i));

					})(index);
					
					return this.each(function(i){
						$(this).on(etype, function(){cutover(i);});
					});
				},

				/**
				 * 图片预加载
				 * @method $.fn.imgLoad
				 * @since 1.0.0
				 * @param {string} [attr='_src'] 属性名
				 * @param {function} [fn] 回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.imgLoad(attr, fn);
				 */
				imgLoad: function(attr, fn){
					attr === undefined && (attr = '_src');
					typeof attr === 'function' && (fn = attr, attr = '_src');

					return this.each(function(i){
						var img		= new Image(),
							src		= this.src || '',
							url		= this.getAttribute(attr),
							_this	= this;

						//排除异常
						if(this.tagName.toUpperCase() != 'IMG' || !url)return;

						img.onload	= function(){
							_this.src = this.src;
							_this.setAttribute(attr, src);
							(fn || Fn).call(_this, this, i);
						}

						img.src	= url;

					});
				},

				/**
				 * 文本输入区光标处插入
				 * @method $.fn.inputIn
				 * @since 1.0.0
				 * @param {string} txt 文本
				 * @param {array} [wrap] 两侧符号
				 * @return {object} this
				 * @chainable
				 * @example $.fn.inputIn(txt, wrap);
				 */
				inputIn: function(txt, wrap){

					//包裹字符串
					wrap && (txt = wrap[0] + txt + wrap[1]);

					return this.each(function(){
						var start, end, cursor, range, _range, value,
							ds = document.selection;

						//取值及长度
						this.focus();
						value	= this.value;
						
						//获取首尾值
						if(ds){
							_range	= (_range = this.getAttribute('_range')) ? _range.split('|') : [0, 0];
							start	= parseInt(_range[0]);
							end		= start + parseInt(_range[1]);
						}else{
							start	= this.selectionStart;
							end		= this.selectionEnd;
						}

						//设置新值
						cursor		= start + txt.length;
						this.value	= value.slice(0, start) + txt + value.slice(end);
						this.focus();

						//设置光标
						if(ds){
							this.setAttribute('_range', cursor + '|0');
							range = ds.createRange();
							range.moveStart('character', cursor - this.value.length);
							range.collapse(true);
							range.select();
						}else{
							this.setSelectionRange(cursor, cursor);
						}

					});
				},

				/**
				 * 限制字符
				 * @method $.fn.limit
				 * @since 1.0.0
				 * @param {number} limit 限制数
				 * @param {function} [fn] 回调
				 * @return {object} this
				 * @chainable
				 * @example $.fn.limit(limit, fn);
				 */
				limit: function(limit, fn){
					return this.each(function(){
						var $this	= $(this),
							_value	= $this.val(),
							size	= $.textSize(_value) / 2;
						
						//判断运行回调或直接截取字符串
						typeof fn === 'function' ? fn.call(this, Math.floor(limit - size)) : size > limit && $this.val($.textSize(_value, limit * 2));

					});
				},

				/**
				 * 文本输入控件
				 * @method $.fn.inputs
				 * @since 1.0.0
				 * @param {object} [prop] 参数
				 * @param {string} [prop.parent] 事件委托对象,默认不使用
				 * @param {array} [prop.values] 默认值数组,空数据则不匹配默认值
				 * @param {string} [prop.defV='_value'] 取默认值属性
				 * @param {string} [prop.onF] 获取焦点时交替css效果,多个class以空格隔开
				 * @param {string} [prop.onK] 输入内容时交替css效果,多个class以空格隔开
				 * @param {string/number} [prop.limit=false] 是否限制字符,默认不限制,或数字/属性值为字符串的限制长度
				 * @param {function} [prop.fn=false] 回调,默认截取字符串,否则将字符长度差值将作为参数传回
				 * @param {bool} [prop.range=false] 回是否记录光标位置,默认不记录
				 * @param {bool} [prop.events=true] 默认获取焦点和失去焦点的时候运行fn
				 * @return {object} this
				 * @chainable
				 * @example $.fn.inputs(prop);
				 */
				inputs: function(prop){
					var $parent, selector, ie,
						config	= {
							parent	: '',
							values	: [],
							defV	: '_value',
							onF		: '',
							onK		: '',
							limit	: false,
							fn		: false,
							range	: false,
							events	: true
						},
						ltie10	= $.ltie(10);

					//重置参数
					$.extend(config, prop);
					ie	= config.range && $.ie();

					//定义事件绑定对象
					$parent		= config.parent ? $(config.parent) : this,
					selector	= config.parent ? this.selector : undefined;

					//定义事件
					$parent.on('focus', selector, function(){
						var $this	= $(this),
							v_def	= config.defV && $this.attr(config.defV) || this.defaultValue;

						v_def && $this.val() == v_def && _check(v_def) && $this.val('');
						$this.addClass(config.onF);
						
						//字符限制
						config.events && config.limit && _limit.call(this);

					}).on('blur', selector, function(){
						var $this	= $(this),
							_value	= $this.val(),
							v_def	= config.defV && $this.attr(config.defV) || this.defaultValue;

						(_value == '' || _value == v_def) && _check(v_def) && $this.val(v_def).removeClass(config.onF + ' ' + config.onK);
						
						//字符限制
						config.events && config.limit && _limit.call(this);

					}).on(ltie10 ? 'keyup' : 'input', selector, function(){
						var $this	= $(this),
							_value	= $this.val(),
							v_def	= config.defV && $this.attr(config.defV) || this.defaultValue;

						$this[_value == '' || _value == v_def ? 'removeClass' : 'addClass'](config.onK);

						//记录光标位置
						ie && _range.call(this);
						
						//字符限制
						config.limit && _limit.call(this);

					});

					//字符限制
					if(config.limit) {
						this.each(_limit);
						ltie10 && this.on('paste', _limit);
					}
					
					//记录光标位置
					ie && $parent.on('mouseup', selector, _range);

					return this;

					//字符限制方法
					function _limit(){
						var limit,
							$this	= $(this),
							_value	= $this.val(),
							v_def	= config.defV && $this.attr(config.defV) || this.defaultValue,
							size	= $.textSize(_value) / 2;

						//默认值则不限制
						if(v_def && _value == v_def && _check(v_def))return;

						//获取限制字符长度
						limit = typeof config.limit === 'number' ? config.limit : $this.attr(config.limit) ? parseInt($this.attr(config.limit)) : 140;

						//判断运行回调或直接截取字符串
						typeof config.fn === 'function' ? config.fn.call(this, Math.floor(limit - size)) : size > limit && $this.val($.textSize(_value, limit * 2));

					}

					//记录光标位置
					function _range(){
						if(!document.selection)return;

						var _str, reg,
							range	= document.selection.createRange(),
							$this	= $(this),
							str		= this.value,
							l		= str.length,
							_l		= range.text.length,
							__l		= 0,
							ie8		= $.ie(8);

						range.moveStart('character', -l);
						_str	= range.text;

						//ie8 && (_str = _str.replace(/[\r]/g, ''));

						for(var i = 0, len = _str.length; i < len; i++){
							if(str.indexOf(_str.slice(-(i+1))) == -1)break;
						}

						//ie8 && (__l = (_str.slice(-i).match(/[\n]/g) || []).length);

						$this.attr('_range', (i - _l + __l) + '|' + _l);
					}

					//匹配defaultValue
					function _check(defaultValue){
						return config.values.length == 0 || $.inArray(defaultValue, config.values) >= 0;
					}

				}

			});

			return $;
		},
		document	= window.document,
		navigator	= window.navigator,
		jQuery		= window.jQuery,
		define		= window.define;

		jQuery && jQuery().jquery && jQueryX(jQuery);
		typeof define === 'function' && define.amd && define(['jquery'], jQueryX);

})(window);
