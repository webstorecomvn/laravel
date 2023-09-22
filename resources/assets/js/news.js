var news = {
	datetime: function(el){
		$(el).datepicker({
			dateFormat: 'dd/mm/yy',
			onSelect: function(datetext){
				var d = new Date(); // for now
				var h = d.getHours();
				h = (h < 10) ? ("0" + h) : h ;
				var m = d.getMinutes();
				m = (m < 10) ? ("0" + m) : m ;
				var s = d.getSeconds();
				s = (s < 10) ? ("0" + s) : s ;
				date = `${h}:${m}, ${datetext}`;
				this.value = date;
			}
		});
	},
	datetimepicker: function(el){
		$(el).datetimepicker({
			format: 'hh:ii, dd/mm/yyyy',
			autoclose: true,
			todayBtn: true,
			pickerPosition: "bottom-left",
			minuteStep: 10,
			// showMeridian: true,
		});
	},
	init: function(){
		// datepicker
		$('.field-date>input').each(function(){
			$(this).datepicker({
				dateFormat: this.dataset.format,
				changeMonth: true,
				changeYear: true,
			});
		});
		
		$('.input-color').each(function(){
			colorpicker(this);
		});
		
		$("input.datetime").each(function(){
			news.datetimepicker(this);
		});
		
		$("a.show-datetime").on("click", function(){
			var self = this;
			var node = self.closest(".form-field");
			$(self).hide();
			$(node).find(".timestamp-wrap").stop().slideDown("fast", function(){
				var input = $(node).find("input");
				if(! input.attr("data-val")) {
					input.attr("data-val", input.val());
				}
			});
		});
		
		$("a.save-timestamp").on("click", function(){
			event.preventDefault();
			var self = this;
			var node = self.closest(".form-field");
			$(node).find("a.show-datetime").show();
			$(node).find(".timestamp-wrap").stop().slideUp("fast", function(){
				var timeold = $(node).find("input").attr("data-val");
				var timenew = $(node).find("input").val();
				if(timeold != timenew) {
					var html = `Đã lên lịch cho: <b>${timenew}</b>`;
					$(node).find("span").html(html);
				}
			});
		});
		
		$("a.cancel-timestamp").on("click", function(){
			event.preventDefault();
			var self = this;
			var node = self.closest(".form-field");
			$(node).find("a.show-datetime").show();
			var time = $(node).find("input").attr("data-val");
			$(node).find(".timestamp-wrap").stop().slideUp("fast", function(){
				$(node).find("input").val(time);
				$(node).find("input").removeAttr("data-val");
				$(node).find("span").removeAttr("style");
				if(method=="add") {
					$(node).find("span").html(`Đăng <b>ngay lập tức</b>`);
				}
				else {
					$(node).find("span b").html(time);
				}
			});
		});
	},
};

$(function(){	
	news.init();	
});