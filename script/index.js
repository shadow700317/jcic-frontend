// JavaScript Document
$(document).ready(function(){
	// 取得待辦事項列表
	$('#todo_list').load('todo_list.html',function(){
		var sendData = '';
		$.ajax({
			type: 'GET',url:TODO_API+'/todo?is_done=0',dataType: "json",data: sendData
			,success: function (json) {
				var temp = '';
				for (var i=0;i<json.length;i++) {
					createTodo(json[i]);
				}

				$("#todo_item_list").sortable();
				$("#todo_item_list").disableSelection();
				countTodos();
				initAddTodo();
			}
			,error:function(err){ console.log(err); }
		});
	});
	// 取得完成事項列表
	$('#done_list').load('done_list.html',function(){
		var sendData = '';
		$.ajax({
			type: 'GET',url:TODO_API+'/todo?is_done=1',dataType: "json",data: sendData
			,success: function (json) {
				var temp = '';
				for (var i=0;i<json.length;i++) {
					doneTodo(json[i]);
				}
				initDoneTodo();
			}
			,error:function(err){ console.log(err); }
		});
	});
});

// 初始化待辦事項內容
function initAddTodo(){
	// 按下Enter鍵，建立待辦事項
	$('.add-todo').on('keypress',function (e) {
		e.preventDefault
		if (e.which == 13 && $(this).val() != '') {
			var item = $(this).val();
			var sendData=new Object();
			sendData.item = item;
			$.ajax({
				type: 'POST',url:TODO_API+'/todo',dataType:'json',contentType: 'application/json; charset=utf-8',processData:false,data: JSON.stringify(sendData)
				,success: function (json) {
					createTodo(json[0]); 
					countTodos();
				}
				,error:function(err){ console.log(err); }
			});
		}
	});
	// 點選Checkbox，變更待辦事項狀態
	$('.todolist')
	.on('change','#todo_item_list li input[type="checkbox"]',function(){
		if($(this).prop('checked')){
			var id = $(this).val();
			var name = $(this).data('name');
			$.ajax({
				type: 'PUT',url:TODO_API+'/todo',dataType:'json',contentType: 'application/json; charset=utf-8',processData:false,data:'{"id":'+id+'}'
				,success: function (json) {
					doneTodo(JSON.parse('{"ID":'+id+',"ITEM":"'+name+'"}'));
					countTodos();
				}
				,error:function(err){ console.log(err); }
			});
			var doneItem = $(this).parent().parent().find('label').text();
			$(this).parent().parent().parent().addClass('remove');
			
		}
	})
	// 點選 X 按鈕，刪除已完成事項
	.on('click','.remove-item',function(){
		var id = $(this).data('id');
		$.ajax({
			type: 'DELETE',url:TODO_API+'/todo',dataType:'json',contentType: 'application/json; charset=utf-8',processData:false,data:'{"id":'+id+'}'
			,success: function (json) {
				$(this).parent().remove();
			}
			,error:function(err){ console.log(err); }
		});
		
	});

}
// 初始化已完成列表
function initDoneTodo(){
	$('.todolist').on('click','.remove-item',function(){
		$(this).parent().remove();
	});
}
// 記算待辦事項數量
function countTodos(){
    var count = $("#todo_item_list li").length;
    $('.count-todos').html(count);
}
// 建立待辦事項(單項)
function createTodo(json){
	var item = $('#todo_list_temp').html()
					  .replace(/{id}/ig,json.ID)
					  .replace(/{item}/ig,json.ITEM);
	$('#todo_item_list').append(item);
	$('.add-todo').val('');
}
// 建立完成事項(單項)
function doneTodo(json){
	var item = $('#done_item_template').html()
					  .replace(/{id}/ig,json.ID)
					  .replace(/{item}/ig,json.ITEM);
	$('#done_items').append(item);
    $('.remove').remove();
}
