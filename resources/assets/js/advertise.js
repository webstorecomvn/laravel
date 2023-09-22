var advertise = {
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
		advertise.callAjax({
			url: ajaxUrl+doaction,
			data: data,
			beforeSend: beforeSend,
		}, (response) => {
			callback(response);
		});
	},
	formSelect: function(name){
		$(name).select2({
			language: {
				noResults: () => {
					return 'Không tìm thấy kết quả nào.';
				},
			},
		});
	},
	changePos: function(pos) {
		advertise.modAjax('changePos', {
			data: {
				pos: pos
			},
		}, (response) => {
			newPos = response.results.pos;
			newWidth = response.results.width;
			newHeight = response.results.height;
			if(pos != newPos) {
				elWidth = document.getElementById('width');
				elHeight = document.getElementById('height');
				if(elWidth.width != newWidth) {
					elWidth.value = newWidth;
				}
				if(elHeight.value != newHeight) {
					elHeight.value = newHeight;
				}
			}
		});
	},
	init: function(){		
		if(method == 'add') {
			if(pos = document.getElementById('pos')) {
				advertise.changePos(pos.value);
			}
		}
	}
};

$(function(){	
	advertise.init();	
});