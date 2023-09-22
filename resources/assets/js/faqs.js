var faqs = {
	catChange: function(cat_id = 0){
		if(! cat_id) {
			var cats = [];
			var node = document.getElementById("field-cat_id");
			$(node).find("input:checked").each(function(){
				cats.push(this.value);
			});
			cat_id = (cats) ? cats.join(",") : 0;
		}
		core.modAjax("cat_change", {
			data: {
				cat_id: cat_id,
			}
		}, function(response){
			let list_brand, list_series;
			list_brand = response.results.list_brand;
			list_series = response.results.list_series;
			$("#field-brand_id td").html(list_brand);
			$("#field-brand_id td").append(list_series);
			$("#field-brand_id select").each(function(){
				ws.dropdown(this);
			});
		});
	},
	brandChange: function(brand_id = 0){
		var cat_id, cats = [];
		var node = document.getElementById("field-cat_id");
		$(node).find("input:checked").each(function(){
			cats.push(this.value);
		});
		cat_id = (cats) ? cats.join(",") : 0;
		core.modAjax("brand_change", {
			data: {
				cat_id: cat_id,
				brand_id: brand_id,
			}
		}, function(response){
			let list_brand, list_series;
			list_brand = response.results.list_brand;
			list_series = response.results.list_series;
			$("#field-brand_id td").html(list_brand);
			$("#field-brand_id td").append(list_series);
			$("#field-brand_id select").each(function(){
				ws.dropdown(this);
			});
		});
	},
	init: function(){
		$(document).on("change", "#field-cat_id input", function(){
			if(this.checked) {
				faqs.catChange(this.value);
			}
			else {
				faqs.catChange(0);
			}
		});
		$(document).on("change", "#brand_id", function(){
			faqs.brandChange(this.value);
		});
	}
};

$(function(){	
	faqs.init();	
});