// JavaScript Document
const MENU_API='http://jcic-resource-menu-jcic-demo.apps.example.com/v1/jcic';
const TODO_API='http://jcic-resource-todo-jcic-demo.apps.example.com/v1/jcic';

$(window).resize(function() {
	var path = $(this);
	var contW = path.width();
	if(contW >= 751){
		document.getElementsByClassName("sidebar-toggle")[0].style.left="200px";
	}else{
		document.getElementsByClassName("sidebar-toggle")[0].style.left="-200px";
	}
});

$(document).ready(function(){
	// 取得左方選單(區塊存在)
	if ($('#navibar').length) {
		var sendData = '';
		$.ajax({
			type: 'GET',url:MENU_API+'/menu',dataType: "json",data: sendData
			,success: function (json) {
//				console.log(json);
				$('#navibar').load('sidebar.html',function(){
					var temp = '';
					for (var i=0;i<json.length;i++) {
						temp+=$('#sidebar_template').html()
							  .replace(/{name}/ig,json[i].name);
					}
					$('.sidebar-nav').html(temp);
					$('.dropdown').on('show.bs.dropdown', function(e){
						$(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
					});
					$('.dropdown').on('hide.bs.dropdown', function(e){
						$(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
					});
					$("#menu-toggle").click(function(e) {
						e.preventDefault();
						var elem = document.getElementById("sidebar-wrapper");
						left = window.getComputedStyle(elem,null).getPropertyValue("left");
						if(left == "200px"){
							document.getElementsByClassName("sidebar-toggle")[0].style.left="-200px";
						}
						else if(left == "-200px"){
							document.getElementsByClassName("sidebar-toggle")[0].style.left="200px";
						}
					});

				});
			}
			,error:function(err){ console.log(err); }
		});

	}

});