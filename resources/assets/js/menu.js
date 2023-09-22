var menu = {
	callAjax: function({url, data, beforeSend}, callback){
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
			beforeSend: beforeSend,
			success: (response) => {
				callback(response);
			}
		});
	},
	modAjax: function(doaction, {data, beforeSend}, callback){
		menu.callAjax({
			url: ajaxUrl+doaction,
			data: data,
			beforeSend: beforeSend,
		}, (response) => {
			callback(response);
		});
	},
	changePos: function(pos){
		menu.modAjax('changePos', {
			data: {
				pos: pos,
			},
		}, (response) => {
			$('#parentid').select2("destroy");
			$('#parentid').replaceWith(response.results);
			$('#parentid').each(function(){
				ws.dropdown(this);
			});
		});
	},
	sortable: function(el, act){
		$(el).sortable({
			// axis: "y",
			// cancel: ".metabox",
			start: function(e, ui){
				ui.placeholder.height(ui.item.height());
			},
			update: function (event, ui) {
				// var data = $(this).sortable('serialize');
				// $.ajax({
				// 	type: 'POST',
				// 	url: ajaxUrl + act + '&page=' + action,
				// 	data: data,
				// 	dataType: 'json',
				// 	success: function(response) {
				// 		$.each( response.list, function( id, value ) {
				// 			$('#'+response.field+'-'+id).val(value);
				// 		});
				// 	}
				// });
			}
		});
	},
	textChange: function(e){
		var metabox = e.closest(".metabox");
		var label = (e.value) ? e.value : "Liên kết tự tạo";
		$(metabox).find("h3").html(label);
	},
	init: function(){
		core.dd(module);
	},	
};

$(function(){
	menu.init();
});