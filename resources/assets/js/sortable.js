$(function(){
	SORT.sortable($('#manage>tbody'), 'sortTableList');
});
var SORT = 
{
	sortable: function(elm, act){
		if($('body, html').find(elm).length>0)
		{
			elm.sortable({
				axis: 'y',
				cancel: '.manage-column',
				start: function(e, ui){
					ui.placeholder.height(ui.item.height());
				},
				update: function (event, ui) {
					var data = $(this).sortable('serialize');
					$.ajax({
						type: 'POST',
						url: ajaxUrl + act + '&page=' + action,
						data: data,
						dataType: 'json',
						success: function(response) {
							$.each( response.list, function( id, value ) {
								$('#'+response.field+'-'+id).val(value);
							});
						}
					});
				}
			});
		}
	}
}