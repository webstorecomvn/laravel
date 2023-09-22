var contact = {
	formSelect: function(name){
		$(name).select2({
			language: {
				noResults: () => {
					return 'Không tìm thấy kết quả nào.';
				},
			},
		});
	},
	init: function(){		
		$('.select2').each((i, e) => {
			contact.formSelect(e);
		});
	}
};

$(function(){	
	contact.init();	
});