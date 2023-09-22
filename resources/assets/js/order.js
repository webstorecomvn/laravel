var order = {
	dd: function(params){
		console.clear();
		console.log(params);
	},
	request: function(sParam){
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
		for(i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
			
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	},
	toObject: function(array){
		return Object.assign({}, array);
	},
	addNode: function(tag, options, callback){
		node = document.createElement(tag);
		if(options && typeof options.content != 'undefined') {
			node.innerHTML = options.content;
			delete options.content;
		}
		if(options && typeof options === 'object') {
			$.each(options, (name, value) => {
				node.setAttribute(name, value);
			});
		}
		if(options && typeof options === 'function') {
			options(node);
		}
		if(callback && typeof callback === 'function') {
			callback(node);
		}
		 return node;
	},
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
		order.callAjax({
			url: ajaxUrl+doaction,
			data: data,
			beforeSend: beforeSend,
		}, (response) => {
			callback(response);
		});
	},
	dateMin: function(elm){
		$(elm).datepicker({
			minDate:0,
			dateFormat: 'dd/mm/yy',
			changeMonth: true,
			changeYear: true,
		});
	},
	dateMax: function(elm){
		$(elm).datepicker({
			maxDate:0,
			dateFormat: 'dd/mm/yy',
			changeMonth: true,
			changeYear: true,
		});
	},
	dateChoose: function(elm){
		$(elm).datepicker({
			dateFormat: 'dd/mm/yy',
			changeMonth: true,
			changeYear: true,
		});
	},
	doExport: function(type){
		this.modAjax("export", {
			data: {
				type: type,
				userid: core.request("userid"),
				search: core.request("search"),
				keyword: core.request("keyword"),
				order: core.request("order", "desc"),
				status: core.request("status", "all"),
				order_type: core.request("order_type"),
				filter_date: core.request("filter_date"),
				customer_type: core.request("customer_type"),
				orderby: core.request("orderby", "date_order"),
			},
			beforeSend: function(){
				core.loader(3000);
			},
		}, (response) => {
			content = response.results.content;
			content = encodeURIComponent(content);
			btn = document.createElement('a');
			btn.download = response.results.filename;
			dataType = 'application/vnd.ms-excel;charset=UTF-8';
			btn.href = 'data:'+dataType+','+content;
			btn.click();
		});
	},
	init: function(){
		$('#ship_date').each(function(){
			order.dateChoose(this);
		});
		$(document).on("click", ".btn-export", function(e){
			e.preventDefault();
			order.doExport(this.value);
		});
		$(document).on("click", "a.row-action-delete", function(e){
			e.preventDefault();
			var rowitem = this.closest("tr.row_item");
			var rowid = Number((rowitem.id).substr(4));
			if(! do_delete(rowid)) {
				return false;
			}
			window.location.href = e.href;
		});
	}
};

$(function(){
	order.init();
});