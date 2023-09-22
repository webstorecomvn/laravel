var profile = {
	password: function(btn, action){
		var node = btn.parentNode;
		switch(action) {
			default:
				$.ajax({
					type: "post",
					dataType: "json",
					url: ajaxUrl+"random_password",
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
	destroySession: function(el){
		core.callAjax({
			url: ajaxUrl+"destroy_sessions",
		}, function(response){
			$(el).attr('disabled', true);
			$(el).parent().prepend(response);
			$("#message").css("marginBottom", 15);
		});
	},
	init: function(){
		$(document).on("click", '#hide-pw', function(e){
			e.preventDefault();
			profile.password(this, "hide");
		});
		$(document).on("click", '#cancel-pw', function(e){
			e.preventDefault();
			profile.password(this, "cancel");
		});
		$(document).on("click", '#generate-pw', function(e){
			e.preventDefault();
			profile.password(this, "generate");
		});
		$(document).on("click", '#destroy_sessions', function(){
			profile.destroySession(this);
		});
	}
};

$(function(){
	profile.init();
});