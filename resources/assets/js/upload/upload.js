$(function(){
	UPLOAD.init();
});
var UPLOAD = 
{
	box: function(name){
		return $('#gallery-box-'+name);
	},
	popup: function(name){
		var box = UPLOAD.box(name);
		var btn = box.find('.btn-popup');
		btn.fancybox({
			'width'	: '90%',
			'height' : '90%',
			'padding' : 0,
			'type' : 'iframe',
			'autoScale' : false,
			fitToView: false,
            autoSize: false,
            autoDimensions: false,
		});
	},
	change: function(name){
		var arr = [];
		var input = $('#'+name);
		var str = input.val();
		if(str.substr(0,1)==='[') {
			var arr = JSON.parse(str);
		} else {
			arr.push(str);
		}
		UPLOAD.html(name, arr);
		UPLOAD.sort(name);
		UPLOAD.setVal(name);
	},
	html: function(name, arr){
		var box = UPLOAD.box(name);
		if(!box.find('.galleries').length) {
			box.prepend('<div class="galleries">');
		}
		var items = box.find('.galleries');
		var count = items.find('.gallery-item').length;
		$.each(arr, function(i, v) {
			i += count;
			var val = v.replace(UPLOAD_URL, '');
			var cls = 'gallery-item gallery-item-'+i;
			items.append('<div class="'+cls+'">');
			var item = items.find('.gallery-item-'+i);
			var title = v.replace( /^.*?([^\/]+)\..+?$/, '$1' );				
			item.append('<div class="inner">');
			item.find('.inner').append('<img>');
			item.find('img').attr('src', v);
			item.find('.inner').append('<button>');
			item.find('button').addClass('del button');
			item.find('button').attr('onclick', "UPLOAD.del('"+name+"',"+i+");");
			item.find('.inner').append('<input>');
			item.find('.inner').append('<input>');
			item.find('input:first').val(title);
			item.find('input:first').attr('name',name+'['+i+'][title]');
			item.find('input:last').val(val);
			item.find('input:first').attr('name',name+'['+i+'][value]');
			item.find('input').attr('type', 'hidden');
		});
	},
	del: function(name, id){
		var box = UPLOAD.box(name);
		if(id!='all') {
			box.find('.gallery-item-'+id).remove();
		} else {
			box.find('.galleries').remove();
		}
		UPLOAD.setVal(name);
	},
	sort: function(name){
		var box = UPLOAD.box(name);
		box.find('.galleries').sortable({
			start: function(e, ui){
				var h = ui.item.height();
				ui.placeholder.height(h);
			},
			update: function (event, ui) {
				UPLOAD.setVal(name);
			}
		});
	},
	setVal: function(name){
		var box = UPLOAD.box(name);
		var items = box.find('.gallery-item');
		var input = box.find('#'+name);
		if(items.length) {
			var arr = [];
			items.each(function(i,e){
				var onclick = "UPLOAD.del('"+name+"',"+i+");";
				$(e).find('img').attr('onclick', "UPLOAD.editName('"+name+"',"+i+");");
				$(e).find('.button').attr('onclick', onclick);
				$(e).attr('class', 'gallery-item gallery-item-'+i);
				$(e).find('input:first').attr('name', 'gallery['+i+'][title]');
				$(e).find('input:last').attr('name', 'gallery['+i+'][value]');				
				var src = $(e).find('img').attr('src');
				var picture = src.replace(UPLOAD_URL, '');
				arr.push(picture);
			});
			input.val( arr.join() );
		} else {
			input.val( '' );
			box.find('.galleries').remove();
		}
		UPLOAD.setBtn(name);
	},
	setBtn: function(name){
		var box = UPLOAD.box(name);
		var btn = box.find('.btn-submit');
		if(box.find('.gallery-item').length) {
			var btnDelAll;
			if(box.find('.btn-del-all').length==0) {
				btnDelAll = btn.clone().appendTo(box.find('.upload-btn'));
				btnDelAll.html('Xoá tất cả ảnh');
				btnDelAll.attr('href', 'javascript:void(0);');
				btnDelAll.attr('class', 'button btn-del-all');
				btnDelAll.attr('onclick', "UPLOAD.del('"+name+"','all');");
			}
		} else {
			box.find('.btn-del-all').remove();
		}
	},
	setName: function(f, name, id){
		var box = UPLOAD.box(name);
		var item = box.find('.gallery-item-'+id);
		item.find('input:first').val(f.value);
		parent.$.fancybox.close();
	},
	editName: function(name, id){
		var box = UPLOAD.box(name);
		var item = box.find('.gallery-item-'+id).clone();
		item.removeAttr('onclick');
		item.find('.del').remove();
		item.find('input.edit-name').remove();
		item.removeClass('ui-sortable-handle');
		item.append('<div class="input-group"><input class="edit-name"><label class="input-group-addon bg-gray">Tiêu đề</label>');
		var title = item.find('input:first').val();
		var input = item.find('.edit-name');
		input.addClass('form-control');
		input.attr('type', 'text');
		input.attr('onchange', "UPLOAD.setName(this,'"+name+"',"+id+")");
		input.val(title);
		$.fancybox.open({
			width : 400,
			height : 400,
			autoSize : 0,
			autoScale: 0,
			content : item,
			transitionIn: 'elastic',
		});
	},
	init: function(){
		$('.gallery-box').each(function(i,e){
			var name = $(e).attr('id');
			name = name.substr(12);
			UPLOAD.setVal(name);
			UPLOAD.sort(name);
		});
	}
}