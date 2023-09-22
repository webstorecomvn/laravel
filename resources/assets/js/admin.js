var MODULE = 
{
	check: function(elm){
		return $('body, html').find(elm).length;
	},
	checkAll: function(){
		var metabox = $('#capacity .metabox');
		metabox.each(function(i,e){
			$(e).find('.inside').addClass('pd0');
			$(e).find('.form-label').click(function(){
				$(this).parent().find('input').prop('checked', true);
			});
		});
	},
	destroySessions: function(){
		if(MODULE.check('#destroy-sessions'))
		{
			$('#destroy-sessions').on('click', function(e){
				$.ajax({
					type: 'POST',
					url: ajaxUrl + 'destroySessions',
					dataType: 'json',
					success: function(data) {
						$('#destroy-sessions').attr('disabled', true);
					}
				});
			});
		}
	},
	generatePassword: function(){
		$('#generate-pw').on('click', function(){
			var btn = $(this);
			var form_field = $('#user-pass-wrap');
			$.ajax({
				type: 'POST',
				url: ajaxUrl + 'randomPassword',
				dataType: 'json',
				success: function(data) {
					btn.hide();
					form_field.find('.form-input').append(data);
				}
			});
		});
	},
	hidePassword: function(){
		var is_hide = true;
		$(document).on('click', '#hide-pw', function(){
			var btn = $(this);
			if(is_hide)
			{
				is_hide = false;
				btn.attr('class', 'button fa-eye');
				$('#password').attr('type', 'password');
			}
			else
			{
				is_hide = true;
				btn.attr('class', 'button fa-eye-slash');
				$('#password').attr('type', 'text');
			}
			txt_data = btn.attr('data-text');
			txt = btn.text();
			btn.attr('data-text', txt);
			btn.text(txt_data);
		});
	},
	cancelPassword: function(){
		$(document).on('click', '#cancel-pw', function(){
			$(this).remove();
			$('#hide-pw').remove();
			$('#password').remove();
			$('#generate-pw').show();
		});
	},
	dateMin: function(elm){
		if(MODULE.check(elm))
		{
			$(elm).datepicker({
				minDate:0,
				dateFormat: 'dd/mm/yy',
				changeMonth: true,
				changeYear: true,
			});
		}
	},
	dateMax: function(elm){
		if(MODULE.check(elm))
		{
			$(elm).datepicker({
				maxDate:0,
				dateFormat: 'dd/mm/yy',
				changeMonth: true,
				changeYear: true,
			});
		}
	},
	init: function(){
		MODULE.checkAll();
		MODULE.hidePassword();
		MODULE.cancelPassword();		
		MODULE.generatePassword();
		MODULE.destroySessions($(this));
		MODULE.dateMax('#date_from');
		MODULE.dateMax('#date_to');
	}
}

$(function(){
	MODULE.init();
});