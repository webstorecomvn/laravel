$(function(){
	MODULE.init();
});

var MODULE =  {
	check: function(elm){
		return $('body, html').find(elm).length;
	},
	chosen: function(el){
		if(MODULE.check(el))
		{
			$(el).find('option:first').remove();
			$(el).chosen({
				width: '25em',
				disable_search_threshold: 10,
			});
		}
	},
	catChange: function(cat_id, pid){
		$.ajax({
			type: 'POST',
			url: ajaxUrl + 'catChange',
			dataType: 'json',
			data: {
				cat_id: cat_id,
				pid: pid,
			},
			success: function(response) {
				// list_brand
				$('#brand_id').parent().html(response.list_brand);
				
				// list_op_search
				$('.post-op_search').html(response.list_op_search);
			}
		});
	},
	dateDeal: function(el){
		$(el).datepicker({
			minDate:0,
			dateFormat: 'yy-mm-dd',
			onSelect: function(datetext){
				var d = new Date(); // for now
				var h = d.getHours();
				h = (h < 10) ? ("0" + h) : h ;
				var m = d.getMinutes();
				m = (m < 10) ? ("0" + m) : m ;
				var s = d.getSeconds();
				s = (s < 10) ? ("0" + s) : s ;
				date = datetext  + ", " + h + ":" + m + ":" + s;
				this.value = date;
				var rowid = this.dataset.rowid;
				do_check(rowid);
			}
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
	}
}

// getParam
var getParam = function(sParam){
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
			
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	}

// checkTitle
var checkTitle = function(f){
	$.ajax({
		type: f.method,
		url: ajaxUrl+'checkTitle',
		dataType: 'json',
		data: {
			title: f.title.value,
			pid: (getParam('id') != undefined) ? getParam('id') : 0,
		},
		success: function(response) {
			if(! response.success) {
				alert(response.message);
				f.title.focus();
				return false;
			}
			f.submit();
		}
	});
	return false;
}

// product
var product = {
	editjs: function(e){
		var rowitem = e.closest("tr.row_item");
		var rowid = Number((rowitem.id).substr(4));
		var editjs = document.getElementById("editjs");
		$.ajax({
			url: e.href,
			method: "post",
			dataType: "json",
			success: function(response){
				if(editjs) {
					$("tr.checked").each(function(){
						$(this).removeClass("hide");
						$(this).removeClass("checked");
						$(this).find(".checkbox").prop("checked", false);
					});
					$(editjs).remove();
				}
				do_check(response.id);
				rowid = $("#row_"+response.id);
				rowid.after(response.html);
				$("#editjs select").each(function(){
					ws.dropdown(this);
				});
				rowid.addClass("hide");
			}
		});
	},
	doExport: function(type){
		var status = core.request('status'),
		stock = core.request('stock'),
		author = core.request('author'),
		filter_date = core.request('filter_date'),
		post_status = core.request('post_status', 'all'),
		cat_id = core.request('cat_id'),
		brand_id = core.request('brand_id'),
		keyword = core.request('keyword'),
		search = core.request('search');
		product.modAjax('export', {
			data: {
				type: type,
				stock: stock,
				status: status,
				search: search,
				cat_id: cat_id,
				keyword: keyword,
				brand_id: brand_id,
				post_status: post_status,
				orderby: core.request("orderby", "date"),
				order: core.request("order", "desc"),
			},
			beforeSend: function(){
				core.loader(3000);
			},
		}, (response) => {
			content = response.content;
			content = encodeURIComponent(content);
			btn = document.createElement('a');
			btn.download = response.filename;
			dataType = 'application/vnd.ms-excel;charset=UTF-8';
			btn.href = 'data:'+dataType+','+content;
			btn.click();
			$(".action-export").each(function(){
				$(this).select2("destroy");
				$(this).val(0);
				ws.dropdown(this);
			});
		});
	},
	dateDeal: function(el){
		$(el).datepicker({
			minDate:0,
			dateFormat: 'dd/mm/yy',
			onSelect: function(datetext){
				var d = new Date(); // for now
				var h = d.getHours();
				h = (h < 10) ? ("0" + h) : h ;
				var m = d.getMinutes();
				m = (m < 10) ? ("0" + m) : m ;
				var s = d.getSeconds();
				s = (s < 10) ? ("0" + s) : s ;
				date =   h + ":" + m + ", " + datetext;
				this.value = date;
				var rowid = this.dataset.rowid;
				do_check(rowid);
			}
		});
	},
	callAjax: function({url, data, beforeSend}, callback){
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
			beforeSend: beforeSend,
			success: (response) => {
				callback(response);
			}
		});
	},
	modAjax: function(doaction, {data, beforeSend}, callback){
		product.callAjax({
			url: ajaxUrl+doaction,
			data: data,
			beforeSend: beforeSend,
		}, (response) => {
			callback(response);
		});
	},
	catChange: function(catid, pid){
		elBrand = document.getElementById('brand_id');
		product.modAjax('catChange', {
			data: {
				pid: pid,
				catid: catid,
			},
		}, (response) => {
			$(elBrand).select2('destroy');
			listBrand = response.results.listBrand;
			$(elBrand).replaceWith(listBrand);
		});
	},
	attributeChange: function(self, cat_id){
		this.modAjax("attribute_change", {
			data: {
				cat_id: cat_id,
				pa_id: self.value,
			}
		}, function(response){
			$("#id").select2("destroy");
			$("#id").replaceWith(response);
			$("#id").each(function(){
				ws.dropdown(this);
			});
		});
	},
	advertise_cat: function(cat_id){
		product.modAjax('advertise_cat', {
			data: {
				cat_id: cat_id,
			},
		}, (response) => {
			$("#brand_id").select2('destroy');
			$("#brand_id").replaceWith(response.results);
			$("#brand_id").each(function(){
				ws.dropdown(this);
			});
		});
	},
	loadModal: function(args, cb){
		if(document.getElementById('iziModal')) {
			$('#iziModal').remove();
		};
		$('body').append('<div id="iziModal">');
		$("#iziModal").each(function(){
			var self = this;
			$(self).iziModal({
				width: args.width,
				theme: 'light',
				padding: 0,
				radius: 0,
				title: args.title,
				headerColor: 'var(--cnT)',
				closeButton: true,
				fullscreen: true,
				navigateArrows: true,
				navigateCaption: true,
				arrowKeys: true,
				overlay: true,
				overlayColor: 'rgba(0, 0, 0, 0.4)',
				overlayClose: false,
				restoreDefaultContent: true,
				loop: true,
				bodyOverflow: false,
			});
			
			$(self).iziModal('setContent', '<div style="height:100px">');
            $(self).iziModal('startLoading');
            $(self).iziModal('open');
			product.callAjax({
                url: args.url,
                data: args.data,
                beforeSend: args.beforeSend,
            }, (response) => {
				if (response){
					$(self).iziModal('setContent', response);
					$(self).iziModal('stopLoading');
				} else {
					$(self).iziModal('close');
				}
				if (cb && typeof cb === "function"){
					cb(response, self);
				}
			});
		});
	},
	closeModal: function(name){
		var modal = document.getElementById(name);
		$('#iziModal').iziModal('close');
	},
	addBrand: function(el, cat_id = 0){
		if(cat_id) {
			product.loadModal({
				width: 500,
				title: "Thêm thương hiệu",
				url: ajaxUrl+"add_brand",
				data: {
					cat_id: cat_id,
					type: "showModal",
					post_id: core.request('id', 0),
				},
			}, function(response){
				$("#name").focus();
			});
		}
		else {
			product.modAjax("add_brand", {
				data: $(el).serialize(),
				beforeSend: function(){
					
				}
			}, function(response){
				if(document.getElementById("post-options")) {
					$(".options-brand li").removeClass("check-1");
					$(".options-brand .add-item").clone().appendTo($(".options-brand ul"));
					$(".options-brand .add-item:first").replaceWith(response.brand_check);
				}
				else {
					$("#brand_id").select2("destroy");
					$("#brand_id").replaceWith(response.brand_sel);
					$("#brand_id").each(function(){
						ws.dropdown(this);
					});
				}
				product.closeModal("iziModal");
			});
			return false;
		}
	},
	addOption: function(el, post_id, pa_id){
		if(el.dataset.label) {
			product.loadModal({
				width: 500,
				title: el.dataset.label,
				url: ajaxUrl+"add_option",
				data: {
					pa_id: pa_id,
					post_id: post_id,
					type: "showModal",
					label: el.dataset.label,
				},
			}, function(response){
				$("#name").focus();
			});
		}
		else {
			product.modAjax("add_option", {
				data: $(el).serialize(),
				beforeSend: function(){
					
				}
			}, function(response){
				// core.dd(response);
				if(document.getElementById("post-options")) {
					let pa_id = response.pa_id,
						field_id = "field-attribute-"+pa_id,
						option_multi = response.option_multi,
						node = document.getElementById(field_id),
						li = document.getElementById("option-"+response.id);
					if(option_multi) {
						if(response.isNew) {
							$(node).find(".add-item").clone().appendTo($(node).find("ul"));
							$(node).find(".add-item:first").replaceWith(response.option_check);
						}
						else {
							if(li) {
								$(li).replaceWith(response.option_check);
							}
							else {
								$(node).find(".list-check-search").append(response.option_check);
								$(node).find(".list-check-search").append($(node).find(".list-check-search .add-item"));
							}
						}
						$(node).find(".list-check-search").each(function(){
							product.sort(this);
						});
					}
					else {
						$(node).find("li").addClass("check-0");
						$(node).find("li").removeClass("check-1");
						$(node).find("input[type=radio]").prop("checked", false);
						if(response.isNew) {
							$(node).find(".add-item").clone().appendTo($(node).find("ul"));
							$(node).find(".add-item:first").replaceWith(response.option_check);
						}
						else {
							if(li) {
								$(li).replaceWith(response.option_check);
							}
							else {
								$(node).find(".list-check-search").prepend(response.option_check);
							}
						}
					}
					$(node).find("textarea").val(response.name);
				}
				else {
					$("#options"+post_id).select2("destroy");
					$("#options"+post_id).replaceWith(response.option_sel);
					$("#options"+post_id).each(function(){
						ws.dropdown(this);
					});
					do_check(post_id);
				}
				product.closeModal("iziModal");
			});
		}
		return false;
	},
	addAttribute: function(el, cat_id){
		event.preventDefault();
		if(cat_id) {
			product.loadModal({
				width: 500,
				title: "Thêm thuộc tính",
				url: ajaxUrl+"add_attribute",
				data: {
					cat_id: cat_id,
					type: "showModal",
				},
			}, function(response){
				$("#name").focus();
			});
		}
		else {
			product.modAjax("add_attribute", {
				data: $(el).serialize(),
				beforeSend: function(){
					
				}
			}, function(response){
				if(document.getElementById("post-options")) {
					if(response.isNew) {
						let field = document.getElementById("add-attribute")
							node = field.parentNode;
						$(node).append(response.field);
						$(node).find("li:last").addClass("add-item");
						$(node).append($(field));
					}
					else {
						$("#op-search-"+response.id).focus();
					}
				}
				else {
					$("#message").replaceWith(response.message);
					setTimeout(function(){
						window.location.reload();
					}, 3000);
				}
				product.closeModal("iziModal");
			});
		}
		return false;
	},
	addSeries: function(el, cat_id = 0, brand_id = 0){
		if(cat_id) {
			if(! Number(brand_id)) {
				alert("Hãy chọn ít nhất 1 thương hiệu. Trước khi thêm Dòng máy.");
				return false;
			}
			product.loadModal({
				width: 500,
				title: "Thêm Dòng máy",
				url: ajaxUrl+"add_series",
				data: {
					cat_id: cat_id,
					brand_id: brand_id,
					type: "showModal",
				},
			}, function(response){
				$("#name").focus();
			});
		}
		else {
			product.modAjax("add_series", {
				data: $(el).serialize(),
				beforeSend: function(){
					
				}
			}, function(response){
				if(document.getElementById("post-options")) {
					$(".options-series li").removeClass("check-1");
					let count = $(".options-series li input").length;
					if(response.isnew || count == 0) {
						$(".options-series .add-item").clone().appendTo($(".options-series ul"));
						$(".options-series .add-item:first").replaceWith(response.term_check);
					}
					else {
						$(".options-series li input").each(function(){
							if(this.value === response.id) {
								this.checked = true;
								document.getElementById("series-check-"+response.id).classList.add("check-1");
							}
							else {
								this.checked = false;
								$(".options-series .add-item").clone().appendTo($(".options-series ul"));
								$(".options-series .add-item:first").replaceWith(response.term_check);
							}
						});
					}
				}
				product.closeModal("iziModal");
			});
			return false;
		}
		return false;
	},
	addCategory: function(el, taxonomy){
		if(taxonomy) {
			var box = document.getElementById("post-"+taxonomy);
			product.loadModal({
				width: 500,
				title: "Thêm danh mục",
				url: ajaxUrl+"add_category",
				data: {
					type: "showModal",
					taxonomy: taxonomy,
				},
				beforeSend: function(){
					document.getElementById("tax-search-category").value = "";
				}
			}, function(response){
				$("#name").focus();
				$("#parentid").each(function(){
					ws.dropdown(this);
				})
			});
		}
		else {
			product.modAjax("add_category", {
				data: $(el).serialize(),
				beforeSend: function(){
					$(el).find("button").append('<i class="fa fa-spin fa-spinner">');
					$(el).find("button .fa").css({marginLeft: 5});
				}
			}, function(response){
				$("#post-category .inside").html(response);
				product.closeModal("iziModal");
			});
		}
		return false;
	},
	taxSearch: function(el, taxonomy){
		var id = el.id,
			value = el.value,
			node = el.parentNode,
			post_id = core.request('id', 0),
			search = '<i class="fa fa-plus">',
			loading = '<i class="fa fa-spin fa-spinner">',
			box = document.getElementById('post-category');
		product.modAjax("tax_search", {
			data: {
				post_id: post_id,
				taxonomy: taxonomy,
				tax_search_query: value,
			},
			beforeSend: function(){
				$(node).find("label").html(loading);
			}
		}, function(response){
			$(node).find("label").html(search);
			if(value) {
				if($(box).find(".div-select").length) {
						$(box).find(".div-select").replaceWith(response);
				}
				else {
					$(box).find(".inside").append(response);
				}
			}
			else {
				$(box).find(".inside").html(response);
				document.getElementById(id).focus();
			}
		});
	},
	removeSortColumn: function(node, colname){
		$(node).find(".column-"+colname+" a.sorted").each(function(){
			$(this.parentNode).html(this.innerHTML);
		});
	},
	message: function(type, notice){
		if(type == 'confirm') {
			notice += '\n\n"Hủy bỏ" để dừng lại. "OK" để tiếp tục?';
			return confirm(notice);
		}
		else {
			return alert(notice);
		}
	},
	variation: function(self = NULL, post_id = 0, attribute_id = 0, option_id = 0){
		switch(self) {
			default:
				var title = "Biến thể %s %s";
				var node = self.closest("li");
				var field = node.closest(".form-field");
				var pa_name = $(field).find(".form-label>label").text();
				var op_name = $(node).find(".input-group>label").text();
				title = title.replace("%s", pa_name.toLowerCase());
				title = title.replace("%s", op_name.toLowerCase());
				product.loadModal({
					width: 600,
					title: title,
					url: ajaxUrl+"variation",
					data: {
						post_id: post_id,
						attribute_id: attribute_id,
						option_id: option_id,
					},
				});
			break;
			case "update":
				var form = post_id;
				product.modAjax("variation", {
					data: $(form).serialize(),
				}, function(response){
					if(confirm(response.message)) {
						product.closeModal("iziModal");
					}
				});
			break;
		}
		return false;
	},
	sort: function(name){
		$(name).sortable({
			start: function(e, ui){
				var h = ui.item.height();
				ui.placeholder.height(h);
			}
		});
	},
	init: function(){
		$(document).on("click", ".datatypes a", function(e){
			e.preventDefault();
			var self = this;
			var type = self.dataset.key;
			var node = self.closest(".form-field");
			var label = node.querySelector("label");
			var rowid = label.getAttribute("for");
			var rowid = Number(rowid.substr(8));
			var parent = self.closest(".datatypes");
			if(parent.dataset.current != type) {
				switch(parent.dataset.current) {
					case "editor":
						var value = CKEDITOR.instances["editor-digitals"+rowid].getData();
					break;
					default:
						var value = document.getElementById("digital-"+rowid).value;
					break;
				}
				$.ajax({
					method: "post",
					dataType: "json",
					url: ajaxUrl+"digital_change",
					data: {
						type: type,
						rowid: rowid,
						value: value,
					},
					beforeSend: function(){
						$(node).find(".actived").removeClass("actived");
					},
					success: function(response){
						self.classList.add("actived");
						parent.dataset.current = type;
						$(node).find(".field-wrap").html(response);
						if(type == "editor") {
							$(node).find(".field-wrap").css({margin: "-11px"});
						}
						else {
							$(node).find(".field-wrap").removeAttr("style");
						}
					}
				});
			}
		});
		$(".list-check-search").each(function(){
			product.sort(this);
		});
		$(document).on("click", "a.row-action-editjs", function(e){
			e.preventDefault();
			return product.editjs(this);
		});
		$(document).on("change", ".options-brand input", function(){
			let node = this.closest("li");
			let brand_id = Number(this.value);
			let cat_id = Number(node.dataset.catid);
			let attr = "product.addSeries(this, "+cat_id+", "+brand_id+")";
			$(".options-series .add-item label").each(function(){
				$(this).attr("onclick", attr);
			});
		});

		product.removeSortColumn(".page-product", "focus");
		product.removeSortColumn(".page-product", "stock");
		product.removeSortColumn(".page-product", "picture");
		product.removeSortColumn(".page-product", "product_cat");
		product.removeSortColumn(".page-product", "product_brand");
		product.removeSortColumn(".page-product", "product_group");
		product.removeSortColumn(".content-category.manage", "digital");
		$(".content-advertise #cat_id").on("change", function(){
			product.advertise_cat(this.value);
		});
		$(document).on("keyup", "#tax-search-category", function(){
			product.taxSearch(this, "category");
		});
		
		$(document).on("click", ".tax-add-ajax", function(){
			product.addCategory(this, "category");
		});
		$(document).on("change", "#price_old", function(){
			var price_old = Number(this.value),
				price = document.getElementById("price").value,
				box = this.closest("#post-prices");
			core.dd(price_old);
		});
		
		$(document).on("change", "ul.list-check-search input", function(){
			var self = this,
				li = self.closest("li"),
				ul = self.closest("ul"),
				node = ul.closest(".field-wrap");
			if(ul.classList.contains("options-0")) {
				let value = (li.textContent).trim();
				$(node).find("textarea").val(value);
				$(ul).find("li").addClass("check-0");
				$(ul).find("li").removeClass("check-1");
				li.classList.add("check-1");
			}
			else {
				let values = [];
				if(self.checked) {
					$(li).addClass("check-1");
					$(li).removeClass("check-0");
				}
				else {
					$(li).addClass("check-0");
					$(li).removeClass("check-1");
				}
				$(node).find(".check-1").each(function(){
					values.push((this.textContent).trim());
				});
				if(values.length > 1) {
					values = values.join(", ");
				}
				else {
					values = values.join("");
				}
				$(node).find("textarea").val(values);
			}
		});
		
		$(document).on("change", "#post-category .ul-select input", function(){
			var cat_id = 0;
			if(this.checked) {
				cat_id = this.value;
			}
			else {
				cat_id = [];
				$("#post-category input").each(function(){
					if(this.checked) {
						cat_id.push(this.value);
					}
				});
				if(cat_id.length) {
					cat_id = cat_id[cat_id.length-1];
				}
			}
			
			core.modAjax("category_change", {
				data: {
					post_id: core.request('id', 0),
					cat_id: cat_id,
				}
			}, function(response){
				$("#post-options").replaceWith(response.list_options);
				$("#post-digitals .metabox").each(function(){
					$(this).addClass("open");
					$(this).find(".inside").hide();
					$(this).find(".handlediv").addClass("up");
					$(this).find(".handlediv").removeClass("down");
				});
			});
		});

		$("#post-digitals .metabox").each(function(){
			$(this).addClass("open");
			$(this).find(".inside").hide();
			$(this).find(".handlediv").addClass("up");
			$(this).find(".handlediv").removeClass("down");
		});

		$(document).on("click", "#post-digitals h3", function(){
			var node = this.closest(".post-digitals");
			var postbox = this.closest(".metabox");
			if(postbox.classList.contains("open")) {
				$(node).find(".metabox").each(function(){
					$(this).addClass("open");
					$(this).removeClass("actived");
					$(this).find(".inside").hide();
					$(this).find(".handlediv").addClass("up");
					$(this).find(".handlediv").removeClass("down");
				});
				postbox.classList.remove("open");
				postbox.classList.add("actived");
				$(postbox).find(".handlediv").addClass("down");
				$(postbox).find(".handlediv").removeClass("up");
				$(postbox).find(".inside").stop().slideDown(300, function(){
					$([document.documentElement, document.body]).animate({
						scrollTop: $(postbox).offset().top - 40,
					});
				});
			}
			else {
				postbox.classList.add("open");
				postbox.classList.remove("actived");
				$(postbox).find(".handlediv").addClass("up");
				$(postbox).find(".handlediv").removeClass("down");
				$(postbox).find(".inside").stop().slideUp(300);
			}
		});

		$(document).on("click", ".btn-export", function(e){
			product.doExport(this.value);
		});
	}
};

$(function(){
	product.init();
});