var options = {
	select2: function(sel){		
		if(sel.length < 10) {
			$(sel).select2({
				width: 'resolve',
				dropdownAutoWidth: true,
				minimumResultsForSearch: Infinity,
			});
		}
		else {
			$(sel).select2({
				width: 'resolve',
				dropdownAutoWidth: true,
			});
		}
	},
	init: function(mod){
		core.dd(mod);
		$('select').each(function(){
			options.select2(this);
		});
	},
};

$(function(){
	options.init(module);
});