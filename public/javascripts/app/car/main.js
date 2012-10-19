
KISSY.add(function(){	
	var S = KISSY, DOM = S.DOM, Event = S.Event;
	return car ={
				init: function(){
							var SubmitHandle = function(o) {
								var o = o.data;
								var str = '';
								KISSY.use('template',function(){
									var temp= KISSY.Template(DOM.html(DOM.get('#J_Temple')));
									var rnum = parseInt(Math.random()*12+1);
									KISSY.each(o.car,function(data,index){
										data.index = index;
										if(index == rnum){
											data.current = 'large';
										}else{
											data.current = '';
										}
										str +=temp.render(data);
									 })
									 
									 str +=  '<div class="element corner-stamp1 col1" >   <div class="aaa"> 再来一些  </div>  </div><div class="element corner-stamp2 col1" >    <p class="number">下一页</p>    </div> '; 
									 var $newEls = $(str)
									  var $container = $('#contact-content');
									// $newEls.insertBefore('#aaa');
									//$container.prepend( $newEls).isotope( 'appended', $newEls);
									 //$container.isotope( 'appended', $newEls ); 
								
									$container.prepend( $newEls ).isotope('reloadItems').isotope({ sortBy: 'original-order' }); 
									
								
									
									//$container.prepend( $newEls ).isotope('insert', $newEls);
									 
								})
								 
					 	    };
					 	    var ErrorHandle = function(o){
								alert('服务器出错！！请稍后再试')
						 	};
					 	    var data = "car_id=1&contry=all";
					 	    new H.widget.asyncRequest().setURI(getCarUrl).setMethod("GET").setHandle(SubmitHandle).setErrorHandle(ErrorHandle).setData(data).setDataType('json').send();
					 	   
					 	  Event.delegate(document ,'click','.aaa',function(){
					 		  alert('a');
					 		 var SubmitHandle = function(o) {
									var o = o.data;
									var str = '';
									KISSY.use('template',function(){
										var temp= KISSY.Template(DOM.html(DOM.get('#J_Temple')));
										var rnum = parseInt(Math.random()*12+1);
										KISSY.each(o.car,function(data,index){
											data.index = index;
											if(index == rnum){
												data.current = 'large';
											}else{
												data.current = '';
											}
											str +=temp.render(data);
										 })
										str +=  '<div class="element corner-stamp1 col1" >   <a id="aaa"> <p class="number">上一页</p>  </a>  </div><div class="element corner-stamp2 col1" >    <p class="number">下一页</p>    </div> '; 
									    var $newEls = $(str)
										  var $container = $('#contact-content');
										// $newEls.insertBefore('#aaa');
										//$container.prepend( $newEls).isotope( 'appended', $newEls);
										 //$container.isotope( 'appended', $newEls ); 
									
										$container.html( $newEls ).isotope('reloadItems').isotope({ sortBy: 'original-order' }); 
										
									})
									 
						 	    };
						 	    var ErrorHandle = function(o){
									alert('服务器出错！！请稍后再试')
							 	};
						 	    var data = "car_id=2";
						 	    new H.widget.asyncRequest().setURI(getCarUrl).setMethod("GET").setHandle(SubmitHandle).setErrorHandle(ErrorHandle).setData(data).setDataType('json').send();
					 		  
					 	  })
	
				}
			
		};
});
