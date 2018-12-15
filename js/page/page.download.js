/**   2017/10/2   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('download');
    
    self.cache = {
    	timeId: null,
        percent: 0,
        waiting: false,
        running: false
    };
    
	self.onEnter =function (){
		self.flying();
		//首屏晃动
		window.setTimeout(function(){
			$('.title').addClass('title-ing');
			$('.device').addClass('device-ing');
			$('.mobile').addClass('mobile-ing');
			$('.fk').addClass('fk-ing');
			$('.mhead').addClass('mhead-ing');
		},100);
		
		$(window).scroll(function () {
	        var sTop = $(window).scrollTop();
	        if(sTop>480){
	        	//第二屏首次加载晃动
	            setTimeout(function () {
					$('.mtbody').addClass('mtbody-ing');
					$('.tip01').addClass('tip01-ing');
					$('.tip02').addClass('tip02-ing');
					$('.tip03').addClass('tip03-ing');
					$('.tip04').addClass('tip04-ing');
	            },100);
	            if(!self.cache.running){
	            	self.running();
	            }
	        }
	        if(sTop>1000){
	        	$('.text01').addClass('text01-ing');
	        	$('.text02').addClass('text02-ing');
	        	$('.text03').addClass('text03-ing');
	        }
	    });
		
		
		$('.ios').mouseover(function(){
			$('.ios-qc').toggle();
		});
		$('.ios').mouseleave(function(){
			$('.ios-qc').toggle();
		});
		$('.android').mouseover(function(){
			$('.android-qc').toggle();
		});
		$('.android').mouseleave(function(){
			$('.android-qc').toggle();
		});
		
	};
	
	self.onExit = function () {
        window.clearInterval(self.cache.timeId);
        this.copy('onExit');
    };
	
	//进度条
	self.running =function (){
		self.cache.running =true;
		var tt =$('.mview');
		var obj =$('.runing');
		self.cache.timeId =window.setInterval(function(){
			self.cache.percent=self.cache.percent*1+10;
			if(self.cache.percent==1010){
				self.cache.waiting=true;
				tt.hide();
				$('.mtitle').text('模拟页面');
				tt.eq(2).show();
			}
			if(self.cache.percent==1500){
				self.cache.waiting=false;
				self.cache.percent =0;
				tt.hide();
				$('.mtitle').text('首页');
				tt.eq(0).show();
			}
			if(!self.cache.waiting){
				if(self.cache.percent<500){
					$('.two').removeClass('red').addClass('gray');
					$('.three').removeClass('red').addClass('gray');
				}
				if(self.cache.percent>=500){
					$('.two').removeClass('gray').addClass('red');
					tt.hide();
					$('.mtitle').text('角模式');
					tt.eq(1).show();
				}
				if(self.cache.percent>=990){
					$('.three').removeClass('gray').addClass('red');
				}
				$('.runing .before').css('width',self.cache.percent+'px');
				$('.runing .last').css('width',(1000-self.cache.percent)+'px');
			}
			
		},50);
	};
	
	//小球无规则碰撞动画
	self.flying =function (){
	    var getFlag=function (id) {
	        return document.getElementById(id);   //获取元素引用
	    }
	    var extend=function(des, src) {
	        for (p in src) {
	            des[p]=src[p];
	        }
	        return des;
	    }
	    var clss=['a','b','c','d','e','f'];
	    var Ball=function (diameter,classn) {
	        var ball=document.createElement("div");
	        ball.className=classn;
			ball.style.width=ball.style.height=diameter+'px';
			ball.style.position='absolute';
	        return ball;
	    }
	    var Screen=function (cid,config) {
	        //先创建类的属性
	        var self=this;
	        if (!(self instanceof Screen)) {
	            return new Screen(cid,config)
	        }
	        config=extend(Screen.Config, config);  //configj是extend类的实例    self.container=getFlag(cid);            //窗口对象
	        self.container=getFlag(cid);
	        self.ballsnum=config.ballsnum;
	        self.diameter=200;                       //球的直径
	        self.radius=self.diameter/2;
	        self.spring=config.spring;              //球相碰后的反弹力
	        self.bounce=config.bounce;              //球碰到窗口边界后的反弹力
	        self.gravity=config.gravity;            //球的重力
	        self.balls=[];                          //把创建的球置于该数组变量
	        self.timer=null;                       //调用函数产生的时间id
	        self.L_bound=0;                       //container的边界
	        self.R_bound=self.container.clientWidth;  //document.documentElement.clientWidth || document.body.clientWidth 兼容性
	        self.T_bound=0;
	        self.B_bound=self.container.clientHeight;
	    };
	    Screen.Config={                         //为属性赋初值
	        ballsnum:10,
	        spring:0.8,
	        bounce:-0.9,
	        gravity:0.05
	    };
	    Screen.prototype={
	        initialize:function () {
	            var self=this;
	            self.createBalls();
	            self.timer=setInterval(function (){self.hitBalls()}, 30)
	        },
	        createBalls:function () {
	            var self=this,
	                num=self.ballsnum;
	            var frag=document.createDocumentFragment();    //创建文档碎片，避免多次刷新
	            for (i=0;i<num;i++) {
	                var ball=new Ball(self.diameter,clss[i]);
	                //var ball=new Ball(self.diameter,clss[ Math.floor(Math.random()* num )]);//这里是随机的10个小球的碰撞效果
	                ball.diameter=self.diameter;
	                ball.radius=self.radius;
	                ball.style.left=(Math.random()*self.R_bound)+'px';  //球的初始位置，
	                ball.style.top=(Math.random()*self.B_bound)+'px';
	                ball.vx=Math.random() * 6 -3;
	                ball.vy=Math.random() * 6 -3;
	                frag.appendChild(ball);
	                self.balls[i]=ball;
	            }
	            self.container.appendChild(frag);
	        },
	        hitBalls:function () {
	            var self=this,
	                num=self.ballsnum,
	                balls=self.balls;
	            for (i=0;i<num-1;i++) {
	                var ball1=self.balls[i];
	                ball1.x=ball1.offsetLeft+ball1.radius;      //小球圆心坐标
	                ball1.y=ball1.offsetTop+ball1.radius;
	                for (j=i+1;j<num;j++) {
	                    var ball2=self.balls[j];
	                    ball2.x=ball2.offsetLeft+ball2.radius;
	                    ball2.y=ball2.offsetTop+ball2.radius;
	                    dx=ball2.x-ball1.x;                      //两小球圆心距对应的两条直角边
	                    dy=ball2.y-ball1.y;
	                    var dist=Math.sqrt(dx*dx + dy*dy);       //两直角边求圆心距
	                    var misDist=ball1.radius+ball2.radius;   //圆心距最小值
	                    if(dist < misDist) {
	                        //假设碰撞后球会按原方向继续做一定的运动，将其定义为运动A
	                        var angle=Math.atan2(dy,dx);
	                        //当刚好相碰，即dist=misDist时，tx=ballb.x, ty=ballb.y
	                        tx=ball1.x+Math.cos(angle) * misDist;
	                        ty=ball1.y+Math.sin(angle) * misDist;
	                        //产生运动A后，tx > ballb.x, ty > ballb.y,所以用ax、ay记录的是运动A的值
	                        ax=(tx-ball2.x) * self.spring;
	                        ay=(ty-ball2.y) * self.spring;
	                        //一个球减去ax、ay，另一个加上它，则实现反弹
	                        ball1.vx-=ax;
	                        ball1.vy-=ay;
	                        ball2.vx+=ax;
	                        ball2.vy+=ay;
	                    }
	                }
	            }
	            for (i=0;i<num;i++) {
	                self.moveBalls(balls[i]);
	            }
	        },
	        moveBalls:function (ball) {
	            var self=this;
	            ball.vy+=self.gravity;
	            ball.style.left=(ball.offsetLeft+ball.vx)+'px';
	            ball.style.top=(ball.offsetTop+ball.vy)+'px';
	            //判断球与窗口边界相碰，把变量名简化一下
	            var L=self.L_bound, R=self.R_bound, T=self.T_bound, B=self.B_bound, BC=self.bounce;
	            if (ball.offsetLeft < L) {
	                ball.style.left=L;
	                ball.vx*=BC;
	            }
	            else if (ball.offsetLeft + ball.diameter > R) {
	                ball.style.left=(R-ball.diameter)+'px';
	                ball.vx*=BC;
	            }
	            else if (ball.offsetTop < T) {
	                ball.style.top=T;
	                ball.vy*=BC;
	            }
	            if (ball.offsetTop + ball.diameter > B) {
	                ball.style.top=(B-ball.diameter)+'px';
	                ball.vy*=BC;
	            }
	        }
	    };
	    //执行动画
	    var sc=new Screen('inner',{ballsnum:6, spring:0.3, bounce:-0.9, gravity:0.01});
	    sc.initialize();
	}
	
	
    return self;
});