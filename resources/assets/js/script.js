var POST = {
	permalink: function(str_slug){
		var EXT = '.html';
		str_slug = POST.slugStr(str_slug);
		var url = ROOT + str_slug + EXT;
		return url;
	},
	slugStr: function(str) {
		var slug; 
		slug = str.toLowerCase();	 
		slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
		slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
		slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
		slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
		slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
		slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
		slug = slug.replace(/đ/gi, 'd');
		slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
		slug = slug.replace(/ /gi, "-");
		slug = slug.replace(/\-\-\-\-\-/gi, '-');
		slug = slug.replace(/\-\-\-\-/gi, '-');
		slug = slug.replace(/\-\-\-/gi, '-');
		slug = slug.replace(/\-\-/gi, '-');
		slug = '@' + slug + '@';
		slug = slug.replace(/\@\-|\-\@|\@/gi, '');
		return slug;
	},
	slugEdit: function(){
		$(document).on('click', '.edit-slug', function(e){
			$(this).text('Ok');
			$(this).attr('class', 'save button');
			var box = $('#edit-slug-box');
			var input = box.find('input');
			input.focus();
			var val = input.val();
			box.attr('data-slug', val);

			//edit-slug-buttons
			box.find('#edit-slug-buttons').append('<button/>');
			box.find('button:last').text('Hủy');
			box.find('button:last').attr('type', 'button');
			box.find('button:last').attr('class', 'cancel button');

			//editable-post-name
			box.find('#editable-post-name').html(input);
			
			//sample-permalink
			box.find('#sample-permalink').html($('#editable-post-name'));
			box.find('#sample-permalink').prepend(ROOT);

			box.find('input').attr('type', 'text');
			box.find('input').focus();
		});
	},
	slugCancel: function(){
		$(document).on('click', '.cancel', function(e){
			$(this).remove();
			var box = $('#edit-slug-box');
			var input = box.find('input');
			var slug = box.data('slug');
			var href = POST.permalink(slug);
			box.removeAttr('data-slug');
			box.find('.save').text('Chỉnh sửa');
			box.find('.save').attr('class', 'edit-slug button');

			//sample-permalink
			box.find('#sample-permalink').wrapInner('<a/>');
			box.find('a').attr('href', href);
			box.find('a').attr('target', '_blank');
			box.find('#sample-permalink').append(input);
			box.find('input').val(slug);
			box.find('input').attr('type', 'hidden');

			//editable-post-name
			box.find('#editable-post-name').text(slug);
		});
	},
	slugSave: function(){
		$(document).on('click', '.save', function(e){
			var box = $('#edit-slug-box');
			var input = box.find('input');
			var new_slug = input.val();
			var old_slug = box.data('slug');
			var slug = new_slug ? new_slug : old_slug;
			slug = POST.slugStr(slug);
			var href = POST.permalink(slug);
			//sample-permalink
			box.find('#sample-permalink').wrapInner('<a/>');
			box.find('a').attr('href', href);
			box.find('a').attr('target', '_blank');
			box.find('#sample-permalink').append(input);
			box.find('input').val(slug);
			box.find('input').attr('type', 'hidden');
			box.find('.save').text('Chỉnh sửa');
			box.find('.save').attr('class', 'edit-slug button');
			//editable-post-name
			box.find('#editable-post-name').text(slug);
			box.find('.cancel').remove();
			box.removeAttr('data-slug');
			$(this).text('Chỉnh sửa');
			$(this).attr('class', 'edit-slug button');
		});
		//check keyup keypress ENTER
		$(document).on('keyup keypress', '.post-slug', function(e) {
			var keyCode = e.keyCode || e.which;
			var box = $('#edit-slug-box');
			switch(keyCode)
			{
				case 13:
					box.find('.save').click();
					e.preventDefault();
					return false;
				break;
				case 27:
					box.find('.cancel').click();
					e.preventDefault();
					return false;
				break;
			}
		});
	},
	slugAdd: function(){
		if((typeof sub !== 'undefined') && sub != 'edit') {
			$(document).on('keyup', '#title', function(){
				var val = $(this).val();
				var slug = POST.slugStr(val);
				var href = POST.permalink(slug);
				var box = $('#edit-slug-box');
				if(val) {
					box.removeAttr('style');
				} else {
					box.css('z-index', -1);
				}
				if(box.find('.save').length>0) {
					box.find('.save').click();
				}
				box.find('input').val(slug);
				box.find('a').attr('href', href);
				box.find('#editable-post-name').text(slug);
			});
		}
	},
	init: function(module){
		core.init(module, function(){
			POST.slugAdd();
			POST.slugEdit();
			POST.slugSave();
			POST.slugCancel();
		});
	}
}


cnTMXH = 
{
	setFormActionFilter: function(){
		var action = $('form[name=manage]').attr('action');
		$('#posts-filter').find('form').attr('action', action);
	},
	
	setTitle:function(title)
	{
		var slug; 
		slug = title.toLowerCase();	 
		slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
		slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
		slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
		slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
		slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
		slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
		slug = slug.replace(/đ/gi, 'd');
		slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
		slug = slug.replace(/ /gi, "-");
		slug = slug.replace(/\-\-\-\-\-/gi, '-');
		slug = slug.replace(/\-\-\-\-/gi, '-');
		slug = slug.replace(/\-\-\-/gi, '-');
		slug = slug.replace(/\-\-/gi, '-');
		slug = '@' + slug + '@';
		slug = slug.replace(/\@\-|\-\@|\@/gi, '');
		document.getElementById('friendly_url').value = slug;
		document.getElementById('friendly_title').value = title;
	},
	sortable: function(elm, act){
		elm.sortable({
			update: function (event, ui) {
				var data = $(this).sortable('serialize');
				$.ajax({
					data: data,
					type: 'POST',
					url: ajaxUrl + act
				});
			},
			start: function(e, ui){
				ui.placeholder.height(ui.item.height());
			}
		});
	},
	elmCheck: function(elm){
		return $('body, html').find(elm).length;
	},
	autoLoad: function(){
		cnTMXH.setFormActionFilter();
	}
}

// removeMetabox
function removeMetabox() 
{
	$(".metabox").each(function(i, e){
		if($.trim($(e).find(".inside").text()).length=='') {
			$(e).remove();
		}
	});
}

// changeUpload
function changeUpload(field_id, type = "picture")
{
	var _parent, _pic_wrap;
	var obj = $(field_id);
	_parent = obj.parent();
	_parent.find('.picture-wrap').remove();
	_parent.prepend('<div class="picture-wrap">');
	_pic_wrap = _parent.find('.picture-wrap');
	_pic_wrap.css({marginBottom: 10});
	switch(type) {
		case "video":
			_pic_wrap.append('<div class="embed-video embed-responsive embed-responsive-16by9"><video controls="controls" preload="metadata"></video>');
			src = obj.val();
			_pic_wrap.find('video').attr('src', src);
			new_src = src.replace(UPLOAD_URL, '');
			obj.val(new_src);
		break;
		default:
			_pic_wrap.append('<img>');
			src = obj.val();
			_pic_wrap.find('img').attr('src', src);
			new_src = src.replace(UPLOAD_URL, '');
			obj.val(new_src);
		break;
	}
	_parent.find('.set-thumbnail').addClass('hide');
	_parent.find('.remove-thumbnail').removeClass('hide');
}

// number_format
function number_format( number, decimals, dec_point, thousands_sep ) 
{    
	var number = number.split(',').join('');
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 0 : decimals;
    var d = dec_point == undefined ? "." : dec_point;
    var t = thousands_sep == undefined ? "," : thousands_sep, s = n < 0 ? "-" : "";
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

// do_delete
function do_delete(id)
{
	let notice;
	notice = "Bạn có chắc chắn xóa ID: "+id;
	notice += '\n\n"Hủy bỏ" để dừng lại. "OK" để tiếp tục?';
	let ok = confirm(notice);
	return ok ? true : false;
}

// is_num
function is_num(event,f){
	if (event.srcElement) {kc =  event.keyCode;} else {kc =  event.which;}
	if ((kc < 47 || kc > 57) && kc != 8 && kc != 0) return false;
	return true;
}

// do_check
function do_check(id)
{
	$('#row_'+id).find('.checkbox').prop("checked", true);
	$('#row_'+id).addClass("checked");
	$('#row_'+id).addClass("checked");
	allCheck($('#row_'+id));
}

// do_submit
var do_submit = function(action, mess = "") {
	document.manage.action.value = action;
	if(selected_item()){
		if(action=="delete" || action=="del") {
			if(! mess) {
				mess = "Bạn có chắc chắn xóa dữ liệu?";
				mess += '\n\n"Hủy bỏ" để dừng lại. "OK" để tiếp tục?';
			}
			_confirm = confirm(mess);
			if(!_confirm) return false;
		}
		document.manage.submit(function(e) {
			e.preventDefault();
		});
	}
};

// selected_item
var selected_item = function() {
	var ok = 0 ;
	$("table.table-list tbody input.checkbox").each( function(){
		var c = this.checked;
		if (c){
			ok = 1;
		}
	});
	if(ok) {
		return true;	
	} else {
		alert('Hãy chọn ít nhất 1 record.');
		return false ;
	}
};

// checkAll
var checkAll = function(){
	$('input[name=checkall]').on("change", function(e){
		event.preventDefault();
		var self = this, table = self.closest('table');
		if(this.checked){
			$(table).find("input[name=checkall]").prop("checked", true);
			$(table).find('input.checkbox').each(function(){
				$(this).prop('checked', true);
				$(this).parents("tr").addClass("checked");
			});
		} else {
			$(table).find("input[name=checkall]").prop("checked", false);
			$(table).find('input.checkbox').each(function(){
				$(this).prop('checked', false);
				$(this).parents("tr").removeClass("checked");
			})
		}
		return false;
	});
};

// chkClick
function chkClick()
{
	$("input.checkbox").on("click", function(){
		if($(this).is(':checked')) {
			$(this).parents("tr").addClass("checked");
		} else {
			$(this).parents("tr").removeClass("checked");
		}
		allCheck($(this));
	});
}

// allCheck
function allCheck(obj)
{
	parents = obj.parents('.table-list');
	length = parents.find("tbody>tr").length;
	if(parents.find("tbody>tr.checked").length==length) {
		parents.find("input[name=checkall]").prop("checked", true);
	} else {
		parents.find("input[name=checkall]").prop("checked", false);
	}
}

// setFocus
function setFocus(id, bool)
{
	$.ajax({
		async: true,
		type: "POST",
		url: window.location.href+'/ajax',
		dataType: 'json',
		data: {id: id, bool: bool},
		success: function(data) {
			//$('#message').remove();
			//$('form[name=manage]').prepend(data);
		}
	});
}

// tagAdd
function tagAdd(act)
{
	$(document).on("click", ".tagadd", function(){
		var ok = 1;
		var input_tag = $("input[name=post_tag]"); 
		var post_tag = input_tag.val();
		if(post_tag=="")
		{
			ok = 0;
			input_tag.focus();
		}
		if(ok)
		{
			$.ajax({
				async: true,
				type: "POST",
				url: ajaxUrl + act,
				dataType: 'json',
				data: {
					lang: lang,
					post_tag: post_tag, 
					module: module,
				},
				success: function(data) {
					var c = $(".tagchecklist");
					c.append(data);
					input_tag.val('');
					input_tag.focus();
				}
			});
		}
	});
}

// tagDel
function tagDel()
{
	$(document).on("click", ".tagchecklist>span", function(){
		$(this).remove();
	});
}

// changeImgSvg
function changeImgSvg()
{
	$('body').find('img.svg').each(function(){
		$(this).hide();
		var $img = $(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');
		$.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var $svg = $(data).find('svg');
			// Add replaced image's ID to the new SVG
			if(typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass+' replaced-svg');
			}
			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');
			// Replace image with new SVG
			$img.replaceWith($svg);
		}, 'xml');
	});
}

function colorpicker(input)
{
	if(cnTMXH.elmCheck(input)>0)
	{
		$(input).css('color', '#FFFFFF');
		$(input).css('background', '#' + $(input).val());
		$(input).ColorPicker({
			onSubmit: function(hsb, hex, rgb, el) {
				$(el).val(hex);
				$(el).ColorPickerHide();
			},
			onBeforeShow: function () {
				$(this).ColorPickerSetColor(this.value);
			},
			onChange: function (hsb, hex, rgb) {
				$(input).val(hex);
				$(input).css('background', '#' + hex);
			}
		})
		.bind('keyup', function(){
			$(this).ColorPickerSetColor(this.value);
			$(input).val(this.value);
			$(input).css('background', '#' + this.value);
		});
	}
}

//==========
$(function(){
	
	colorpicker('#color');

	// Upload button fancybox
	if($('body, html').find('.btn-upload').length)
	{
		$('.btn-upload').fancybox({
			padding : 0,
			type: 'iframe',
            autoSize: false,
			fitToView: false,
			autoScale: false,
            autoDimensions: false,
			width: $(window).width() - 80,
			height: $(window).height() - 80,
		});
	}
	
	// Remove thumbnail click
	$(document).on('click', '.remove-thumbnail', function(){
		var _parent = $(this).parent();
		$(this).addClass('hide');
		_parent.find('input').val('');
		_parent.find('div:first').remove();
		_parent.find('.set-thumbnail').removeClass('hide');
		return false;
	});
	
	// sticky published box
	$("#post-right-content").each(function(){
		$(this).wrapInner("<div class=sticky>");
		$(this).find(".sticky").sticky({
			topSpacing: 60,
			bottomSpacing: 90,
		});
	});
	
	// collapse menu
	var collapse;
	$('*[data-toggle="offcanvas"]').on('click', function(){
		if(document.body.classList.contains('sidebar-collapse')) {
			collapse = 0;
		}
		else {
			collapse = 1;
		}
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: '?act=admin_ajax&do=collapse',
			data: {collapse: collapse},
			success: function(){
				APP.scrollMenu($(".main-header").height());
			}
		});
	});
	
	$(document).on('click', '.picture-wrap', function(){
		var btn = $(this).parent().find('.btn-upload');
		btn.click();
	});
	
	tagDel();
	tagAdd('addtag');
	checkAll();
	chkClick();
	changeImgSvg();
	cnTMXH.autoLoad();
	
	//edit slug post
	POST.init();
	
	// scrollMenu
	APP.scrollMenu(40);
	
	// message close
	$(document).on('click', 'button.notice-dismiss', function(){
		$(this.parentNode).fadeOut(400, function(){
			this.remove();
		});
	});
	
	$(document).on("click", ".metabox > .handlediv", function(){
		let self = this,
		node = self.parentNode;
		if(node.classList.contains("open")) {
			self.classList.add("down");
			self.classList.remove("up");
			node.classList.remove("open");
			$(node).find(".inside").show();
		} else {
			self.classList.add("up");
			node.classList.add("open");
			self.classList.remove("down");
			$(node).find(".inside").hide();
		}
	});
});

var APP = {
	scrollMenu: function(h){
		var h = $(window).height() - h;
		// slimScroll menu
		if($('html').find('.sidebar-collapse').length) {
			$('.scroll-menu').removeAttr('style');
			$('.main-sidebar').removeClass('slimScroll');
			$('div.scroll-menu').slimScroll({destroy: true});
		} else {
			if($('html').find('.scroll-menu').length) {
				$('.main-sidebar').addClass('slimScroll');
				$('div.scroll-menu').slimScroll({
					size: 8,
					height: h,
					color: '#bbb',
					alwaysVisible: true,
				});
			}
		}
	}
};

$(window).resize(function(){
	APP.scrollMenu(40);
});

var ws = {
	dropdown: function(sel){
		var width = sel.offsetWidth;
		width = (width > 85) ? 'auto' : 'resolve';
		if(sel.length < 10) {
			$(sel).select2({
				width: width,
				dropdownAutoWidth: true,
				minimumResultsForSearch: Infinity,
			});
		}
		else {
			$(sel).select2({
				width: width,
				dropdownAutoWidth: true,
			});
		}
	},
	autoResize: function(e){
		e.style.height = "auto"; 
        e.style.overflow = "hidden"; 
        e.style.height = e.scrollHeight+2+"px"; 
	},
	bulkActions: function(doactionTopId = "doaction", doactionBottomId = "doaction2"){
		var doactionTopId = document.getElementById(doactionTopId);
		var doactionBottomId = document.getElementById(doactionBottomId);
		var form = doactionTopId.form;
		$(doactionTopId).on("change", function(){
			this.form.action.value = this.value;
			$(doactionBottomId).select2("destroy");
			$(doactionBottomId).val(this.value);
			ws.dropdown(doactionBottomId);
		});
		$(doactionBottomId).on("change", function(){
			this.form.action.value = this.value;
			$(doactionTopId).select2("destroy");
			$(doactionTopId).val(this.value);
			ws.dropdown(doactionTopId);
		});
		$(form).find(".bulkactions input[type=submit]").on("click", function(e){
			let action = form.action.value;
			if(action) {
				e.preventDefault();
				$(form).submit();
			}
			form.action.value = "search";
		});
	},
	init: function(){
		$("#doaction").each(function(){
			ws.bulkActions("doaction", "doaction2");
		});
		$("select").each(function(){
			ws.dropdown(this);
		});
		$("textarea").each(function(){
			ws.autoResize(this);
		});
		$(document).on("keyup", "textarea", function(){
			ws.autoResize(this);
		});
		$(document).on("click", "a.preview-link", function(){
			let tr = this.closest("tr.row_item"),
				rowid = (tr.id).substr(4);
			do_check(rowid);
		});
		// setInterval(function(){
		// 	$.ajax({
		// 		type: 'POST',
		// 		url: "?act=admin_ajax&do=notice",
		// 		dataType: 'json',
		// 		data: {
		// 			lang: lang
		// 		},
		// 		success: function(response) {
		// 			var app = document.getElementById("app");
		// 			if(response.num) {
		// 				if(! app.dataset.title) {
		// 					$(app).attr("data-title", document.title);
		// 				}
		// 				document.title = response.notice;
		// 				$.each(response.hooks, function(index, obj){
		// 					var hook = obj.hook,
		// 						notice = obj.notice,
		// 						node = document.getElementById("menu-"+hook);
		// 					if($(node).find("small").length == 0) {
		// 						$(node).find("a:first").append(notice);
		// 					}
		// 					else {
		// 						$(node).find("small").replaceWith(notice);
		// 					}
		// 				});
		// 			}
		// 			else {
		// 				if(app.dataset.title) {
		// 					document.title = app.dataset.title;
		// 					$(app).removeAttr("data-title");
		// 				}
		// 				$.each(response.hooks, function(index, obj){
		// 					var hook = obj.hook,
		// 						node = document.getElementById("menu-"+hook);
		// 					if($(node).find("small").length) {
		// 						$(node).find("small").remove();
		// 					}
		// 				});
		// 			}
		// 		}
		// 	});
		// }, 5000);
	}
};

$(function(){
	ws.init();
});