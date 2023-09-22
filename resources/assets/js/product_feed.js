var product_feed = 
{
	feedFieldType: function(e){
		var type = e.value;
		var rowtr = e.closest("tr");
		var rowid = Number((rowtr.id).substr(6));
		core.modAjax("feedFieldType", {
			data: {
				type: type,
				rowid: rowid,
			}
		}, function(response){
			$(rowtr).find(".feed_field_product").each(function(){
				$(this).html(response);
				switch(type) {
					case "meta":
						$(this).find("select").each(function(){
							ws.dropdown(this);
							$(this).focus();
						});
					break;
					default:
						$(this).find(".form-control").focus();
					break;
				}
			});
		});
	},
	init: function(){
		$(document).on("change", ".field-type", function(){
			product_feed.feedFieldType(this);
		});
		$(document).on("click", "#rex-pr-filter-btn", function(e){
			e.preventDefault();
			$('#rex_feed_product_filters').addClass('show-filters');
			$("#post-left-content").append("<div id='body-overlay'>");
		});
		$(document).on("click", "#rex_feed_filter_modal_close_btn", function(e){
			e.preventDefault();
			$("#body-overlay").remove();
			$('#rex_feed_product_filters').removeClass('show-filters');
		});
		$(document).on("click", "#rex-feed-settings-btn", function(e){
			e.preventDefault();
			$('#rex_feed_product_settings').addClass('show-settings');
			$("#post-left-content").append("<div id='body-overlay'>");
		});
		$(document).on("click", "#rex-contnet-setting__close-icon", function(e){
			e.preventDefault();
			$("#body-overlay").remove();
			$('#rex_feed_product_settings').removeClass('show-settings');
		});
		$(document).on("change", "#feed_products", function(){
			$(".feed-terms").hide();
			switch(this.value) {
				case "product_cat":
					$(".feed-"+this.value).show();
				break;
				case "product_tag":
					$(".feed-"+this.value).show();
				break;
				case "product_brand":
					$(".feed-"+this.value).show();
				break;
				case "product_status":
					$(".feed-"+this.value).show();
				break;
			}
		});
		$(document).on("click", "a.btn-download", function(){
			core.loader(2000);
		});
		$(document).on("click", "#send-to-google", function(){
			core.loader(2000);
		});
	},
};

$(function(){
	product_feed.init();
});