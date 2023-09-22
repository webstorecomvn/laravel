var users = {
	password: function(btn, action){
		var node = btn.parentNode;
		switch(action) {
			default:
				$.ajax({
					type: "post",
					dataType: "json",
					url: ajaxUrl+"randomPassword",
					success: function(response) {
						$(btn).hide();
						if(! document.getElementById("password")) {
							$(node).append(response);
						}
						$(document.getElementById("password")).focus();
					}
				});
			break;
			case "cancel":
				$(btn).remove();
				$(document.getElementById("hide-pw")).remove();
				$(document.getElementById("password")).remove();
				$(document.getElementById("generate-pw")).show();
			break;
			case "hide":
				let text = btn.textContent;
				let label = btn.dataset.text;
				let pw = document.getElementById("password");
				btn.dataset.text = text;
				btn.textContent = label;
				if(btn.classList.contains("fa-eye")) {
					btn.classList.remove("fa-eye");
					btn.classList.add("fa-eye-slash");
					pw.setAttribute("type", "text");
				}
				else {
					btn.classList.add("fa-eye");
					btn.classList.remove("fa-eye-slash");
					pw.setAttribute("type", "password");
				}
			break;
		}
	},
	rowActions: function(action){
		$(document).on("click", ".row-action-"+action, function(){
			var row = this.closest("tr.row_item");
			var rowid = Number((row.id).substr(4));
			if(action == "delete" && (! confirm(jLang.user_delete_mess))) {
				return false;
			}
			return rowid;
		});
	},
	bulkActions: function(tag, action = false){
		var form = tag.form;
		var name = tag.name;
		var selected = tag.value;
		if(name.indexOf("2") == -1) {
			name += "2";
		}
		else {
			name = name.replace("2", "");
		}
		if(sel = document.getElementById(name)) {
			$(sel).each(function(){
				$(this).select2("destroy");
				$(this).val(selected);
				ws.dropdown(this);
			});
		}
		form.action.value = action;
	},
	init: function(){
		$(document).on("click", '#hide-pw', function(e){
			e.preventDefault();
			users.password(this, "hide");
		});
		$(document).on("click", '#cancel-pw', function(e){
			e.preventDefault();
			users.password(this, "cancel");
		});
		$(document).on("click", '#generate-pw', function(e){
			e.preventDefault();
			users.password(this, "generate");
		});
		$(".row-actions li").each(function(){
			$(this).find(".row-action").on("click", function(){
				var row = this.closest("tr.row_item");
				var rowid = Number((row.id).substr(4));
				if(this.classList.contains("row-action-delete")) {
					if(! confirm(jLang.user_delete_mess)) {
						return false;
					}
				}
				return rowid;
			});
		});
		$(document).on("click", ".btn-search", function(){
			users.bulkActions(this, "search");
		});
		$(document).on("keyup", ".text-search", function(){
			users.bulkActions(this, "search");
		});
		$(document).on("change", ".bulkactions select", function(){
			users.bulkActions(this, this.value);
		});
		$(document).on("click", ".bulkactions input", function(){
			var action, node = this.parentNode;
			action = $(node).find("select").val();
			users.bulkActions(this, action);
		});
		$(document).on("change", ".bulknewrole select", function(){
			users.bulkActions(this, "new_role");
		});
		$(document).on("click", ".bulknewrole input", function(){
			users.bulkActions(this, "new_role");
		});
	}
};

$(function(){
	users.init();
});