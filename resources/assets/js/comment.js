var comment = {
	switchDisplay: function(el, id, type = ""){
		var node = el.closest("tr"),
			display = (el.checked) ? 1 : 0,
			action = (type) ? type : module;
		core.modAjax('switch_display', {
			data: {
				id: id,
				action: action,
				display: display,
			}
		}, function(response){
			if(document.getElementById("message")) {
				$("#message").fadeOut(function(){
					$(this).remove();
					$(el.form).prepend(response.results.message);
					if($(".subsubsub").length) {
						$(".subsubsub").replaceWith(response.results.subsubsub);
					}
				});
			}
			else {
				$(el.form).prepend(response.results.message);
				if($(".subsubsub").length) {
					$(".subsubsub").replaceWith(response.results.subsubsub);
				}
			}
		});
	},
	replyto: function(e){
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		var replyrow = document.getElementById("replyrow");
		$.ajax({
			url: e.href,
			method: "post",
			dataType: "json",
			beforeSend: function(){
				if(replyrow) {
					$(replyrow).remove();
				}
				core.loader(300);
				$([document.documentElement, document.body]).animate({
					scrollTop: $("#row_"+rowid).offset().top - 40,
				});
			},
			success: function(response){
				rowid = $("#row_"+response.id);
				rowid.after(response.html);
				$("#replyrow").fadeIn(300);
			}
		});
	},
	editjs: function(e){
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		var replyrow = document.getElementById("replyrow");
		$.ajax({
			url: e.href,
			method: "post",
			dataType: "json",
			beforeSend: function(){
				if(replyrow) {
					$(replyrow).remove();
				}
				core.loader(300);
				$([document.documentElement, document.body]).animate({
					scrollTop: $("#row_"+rowid).offset().top - 40,
				});
			},
			success: function(response){
				rowid = $("#row_"+response.id);
				rowid.after(response.html);
				$("#replyrow").fadeIn(300);
			}
		});
	},
	spam: function(e){
		var form = e.closest("form");
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		$.ajax({
			url: e.href,
			method: "post",
			dataType: "json",
			data: {
				rowid: rowid,
				status: core.request("status"),
			},
			success: function(response){
				$(rowitem).replaceWith(response.html);
				$("#row_"+rowid).fadeIn(300);
				$(form).find(".subsubsub").replaceWith(response.subsubsub);
			}
		});
	},
	unspam: function(e){
		var form = e.closest("form");
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		$.ajax({
			url: e.href,
			method: "post",
			dataType: "json",
			data: {
				rowid: rowid,
				status: core.request("status"),
			},
			success: function(response){
				$(rowitem).replaceWith(response.html);
				$("#row_"+rowid).fadeIn(300);
				$(form).find(".subsubsub").replaceWith(response.subsubsub);
			}
		});
	},
	approved: function(e){
		var form = e.closest("form");
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		$.ajax({
			url: e.href,
			method: "post",
			dataType: "json",
			data: {
				rowid: rowid,
				status: core.request("status"),
			},
			success: function(response){
				$(rowitem).replaceWith(response.html);
				$("#row_"+rowid).fadeIn(300);
				$(form).find(".subsubsub").replaceWith(response.subsubsub);
			}
		});
	},
	unapproved: function(e){
		var form = e.closest("form");
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		$.ajax({
			url: e.href,
			method: "post",
			dataType: "json",
			data: {
				rowid: rowid,
				status: core.request("status"),
			},
			success: function(response){
				$(rowitem).replaceWith(response.html);
				$("#row_"+rowid).fadeIn(300);
				$(form).find(".subsubsub").replaceWith(response.subsubsub);
			}
		});
	},
	delete: function(e){
		var form = e.closest("form");
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		if(do_delete(rowid)) {
			$.ajax({
				url: e.href,
				method: "post",
				dataType: "json",
				data: {
					rowid: rowid,
					status: core.request("status"),
				},
				success: function(response){
					$(rowitem).fadeOut(300);
					$(form).find(".subsubsub").replaceWith(response);
				}
			});
		}
	},
	init: function(){
		
		$('#is_email').on('change', (e) => {
			var el = e.currentTarget;
			if(Number(el.value)) {
				$('#field-mailtmp').removeClass('hide');
			} else {
				$('#field-mailtmp').addClass('hide');
			}
		});

		$(document).on("click", "a.row-action-replyto", function(e){
			e.preventDefault();
			var self = this;
			var replyrow = document.getElementById("replyrow");
			if(replyrow) {
				var notice = "Bạn chắc chắn làm điều này?";
				notice += "\nNhững bình luận mà bạn thay đổi sẽ bị mất.";
				if(! confirm(notice)) {
					return false;
				}
			}
			return comment.replyto(self);
		});

		$(document).on("click", "a.row-action-editjs", function(e){
			e.preventDefault();
			return comment.editjs(this);
		});

		$(document).on("click", "a.row-action-approved", function(e){
			e.preventDefault();
			return comment.approved(this);
		});

		$(document).on("click", "a.row-action-unapproved", function(e){
			e.preventDefault();
			return comment.unapproved(this);
		});

		$(document).on("click", "a.row-action-spam", function(e){
			e.preventDefault();
			return comment.spam(this);
		});

		$(document).on("click", "a.row-action-unspam", function(e){
			e.preventDefault();
			return comment.unspam(this);
		});

		$(document).on("click", "a.row-action-delete", function(e){
			e.preventDefault();
			return comment.delete(this);
		});

		// datepicker
		$('.field-date>input').each(function(){
			$(this).datepicker({
				dateFormat: 'dd/mm/yy',
				onSelect: function(datetext){
					var d = new Date(); // for now
					var h = d.getHours();
					h = (h < 10) ? ("0" + h) : h ;
					var m = d.getMinutes();
					m = (m < 10) ? ("0" + m) : m ;
					var s = d.getSeconds();
					s = (s < 10) ? ("0" + s) : s ;
					// date = h + ":" + m + ", " + datetext;
					date = datetext;
					this.value = date;
				}
			});
		});

		$("thead .manage-column.column-content").each(function(){
			$(this).html($(this).text());
		});
		$("tfoot .manage-column.column-content").each(function(){
			$(this).html($(this).text());
		});
	},
};

$(function(){
	comment.init();
});