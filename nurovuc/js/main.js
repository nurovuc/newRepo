$(function(){
	$el_dil = $('.dil');
	$el_slider = $('#slider');
	$el_topfotos = $('#topfotos');
	$el_menu = $('#mainnav ul');
	$el_menubtn = $('#mainnav .menu-btn');
	$el_packages = $('#packages');
	$el_contactform = $('#contactform');
	$el_navcont = $('#navcontainer');

	$mainnav_pos = '';
	$dil_pos = '';

	$el_menubtn.click(function(e){
		e.preventDefault();
		if($el_navcont.hasClass('open')){
			$el_navcont.removeClass('open');
			$('body').css('overflow', 'auto');
			$('#mainnav').css('position', $mainnav_pos);
			$el_dil.css('position', $dil_pos);
			//$('#mobile-home,#content, #footer').show();
		}else{
			$('body').css('overflow', 'hidden');
			$mainnav_pos = $('#mainnav').css('position');
			$dil_pos = $el_dil.css('position');
			$('#mainnav, .dil').css('position', 'fixed');
			$el_navcont.addClass('open');
			//$('#mobile-home,#content, #footer').hide();
		}
	});

	$el_dil.hover(function(){
		$el_dil.find('li').show();
	}, function(){
		$el_dil.find('li:not(.active)').hide();
	});

	$(window).load(function() {
	    $('.flexslider').flexslider({
	    	controlNav: false, 
	    	directionNav: true
	    });
	});
	/*if($el_topfotos.length>0){
		$img1 = $el_topfotos.find('.fig1 img');
		var img1_ratio = $img1.width()/$img1.height();

		$img2 = $el_topfotos.find('.fig2 img');
		var img2_ratio = $img2.width()/$img2.height();

		resizeTopFotos();
		$(window).resize(function(){
			resizeTopFotos();
		});

		function resizeTopFotos(){
			var img1_newratio = $img1.width()/$img1.height();
			if(img1_newratio!=img1_ratio){
				$img1.css('min-width', $el_topfotos.height()*img1_ratio+'px');
			}
			var img2_newratio = $img2.width()/$img2.height();
			if(img2_newratio!=img2_ratio){
				$img2.css('min-width', $el_topfotos.height()*img2_ratio+'px');
			}
		}
	}*/


	if($('#mapcontact').length>0){
		var geo = new google.maps.LatLng(50.938368,4.306279);
        var mapOptions = {
			center: geo,
			zoom:13,
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	    
        //var myIcon = new google.maps.MarkerImage("/img/marker.png", null, null, null, new google.maps.Size(80,66));
		var marker = new google.maps.Marker({position: geo, map: map, title: ''});	
	}

	$el_packages.on('click', 'a', function(e){
		e.preventDefault();
		$(this).next('.desc').slideToggle('fast');
	});


	$el_contactform.on('submit', function(e){
		e.preventDefault();
	});

	$el_contactform.find('.submit').click(function(e){
		e.preventDefault();
		$.ajax({
			url: '/inc/contactform.php',
			type: 'post',
			data: $el_contactform.serialize(),
			dataType: 'json',
			success: function (data) {
				$el_contactform.find('label').removeClass('error');
				if(data.status=='success'){
					$el_contactform.addClass('success');
					$el_contactform.find('.feedback').text(data.message);
				}else{
					if(data.status=='errors'){
						$el_contactform.find('.feedback').text(data.message).show();
						$(data.errors).each(function(i, val){
							$el_contactform.find('input[name='+val+'], textarea[name='+val+']').parents('label').addClass('error');
						});
					}
				}
			}
		});
	});

	$('.fancybox').fancybox();

	$el_blog = $('#blog');

	if($(document).width()>1024){
		$el_blog.imagesLoaded( function(){
			$('#blog').masonry({
				// options
				itemSelector : '.post',
				columnWidth : 350,
				gutterWidth : 30
			});
		});
	}else{
		if($(document).width()>768){
			$el_blog.imagesLoaded( function(){
				$('#blog').masonry({
					// options
					itemSelector : '.post',
					columnWidth : 320,
					gutterWidth : 30
				});
			});
		}
	}
	
	if($('#hoteliers_form').length==1){
        $('#hoteliers_form').hc_calendar({
            hotelID : 2598,
            frameWidth: 920
        });
        $('#hoteliers_form .datepicker').click(function(e){
        	e.preventDefault();
	        $(this).prev('input').focus();
        });
	}
});
