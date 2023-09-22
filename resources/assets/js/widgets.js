var widgets = {
	options: {
		delay: 300
	},
	ajax: function(data, callback){
		core.callAjax({
			url: "?mod=widgets",
			data: data,
		}, function(response){
			if(typeof callback === "function") {
				callback(response);
			}
		});
	},
	sort: function(e, connectWith){
		$(e).each(function(){
			$(this).sortable({
				items: ".widget",
				connectWith: connectWith,
				placeholder: "widget-placeholder",
				start: function(event, ui){
					core.dd("widgets-sortables: start");
					$(ui.item).removeClass("open");
					$(ui.item).find(".widget-inside").hide();
					$("#widgets-right .widgets-sortables").each(function(){
						$(this.parentNode).addClass("widget-hover");
					});
				},
				update: function (event, ui) {
					core.dd("widgets-sortables: update");
					$(ui.item).addClass("open");
					$(this.parentNode).removeClass("widget-hover");
					$(ui.item).find(".widget-action").removeClass("up");
					$(this).find(".widget.open .widget-inside").stop().slideDown(widgets.options.delay, function(){
						$(this).find(".title").focus();
					});
				},
				stop: function(event, ui){
					core.dd("widgets-sortables: stop");
					let self = this;
					let node = $(ui.item).parents("#widget-list");
					if("widget-list" == node.attr("id")) {
						$(ui.item).remove();
						$(ui.placeholder).remove();
					}
					$("#widgets-right .widgets-sortables").each(function(){
						$(this.parentNode).removeClass("widget-hover");
					});
					var sidebar_id = self.id;
					var items = $(self).children(".widget").get().map(function(e){
						return Number(e.dataset.position);
					});
					widgets.ajax({
						widgets: items,
						sidebar_id: sidebar_id,
						action: "widgets-sortables"
					}, function(response){
						$(self).find(".widget").each(function(i, e){
							e.dataset.position = i;
							e.classList.remove("ui-sortable-handle");
							e.setAttribute("id", sidebar_id+"-"+e.dataset.widget_id+"-"+i);
						});
					});
				},
			});
		});
	},
	availableWidgets: {
		sitebarName: function(e){
			let node = e.parentNode;
			if(node.classList.contains("closed")) {
				node.classList.remove("closed");
				$(e).find(".handlediv").removeClass("up");
			}
			else {
				node.classList.add("closed");
				$(e).find(".handlediv").addClass("up");
			}
		},
		widgetTop: function(e){
			let widgetsLeft, widget = e.closest(".widget");
			widgetsLeft = document.getElementById("widgets-left");
			if(widget.classList.contains("widget-in-question")) {
				widgetsLeft.classList.remove("chooser");
				widget.classList.remove("widget-in-question");
				$(widget).find(".widget-action").addClass("up");
				$(widget).find(".widgets-chooser").stop().slideUp(widgets.options.delay);
			}
			else {
				widgetsLeft.classList.add("chooser");
				widget.classList.add("widget-in-question");
				$(widget).find(".widget-action").removeClass("up");
				$(widget).find(".widgets-chooser").stop().slideDown(widgets.options.delay);
			}
		},
		chooserCancel: function(e){
			let widgetsLeft, widget = e.closest(".widget");
			widgetsLeft = document.getElementById("widgets-left");
			widgetsLeft.classList.remove("chooser");
			widget.classList.remove("widget-in-question");
			$(widget).find(".widgets-chooser").stop().slideUp(widgets.options.delay);
		},
		chooserButton: function(e){
			let node = e.closest(".widgets-chooser-sidebars");
			$(node).find("li").removeAttr("class");
			$(e.parentNode).addClass("widgets-chooser-selected");
		},
		chooserAdd: function(e){
			var delay = widgets.options.delay;
			var sidebar, widgetsLeft, widget = e.closest(".widget");
			widgetsLeft = document.getElementById("widgets-left");
			widgetsLeft.classList.remove("chooser");
			widget.classList.remove("widget-in-question");
			$(widget).find(".widgets-chooser").stop().slideUp(delay);
			sidebar = $(widget).find(".widgets-chooser-selected button");
			$("#widgets-right .widgets-sortables").each(function(){
				var sidebar_name, self = this, sidebar_id = self.id;
				sidebar_name = $(self).find(".sidebar-name h2");
				if(sidebar_name.text() == sidebar.text()) {
					widgets.ajax({
						closed: 0,
						sidebar_id: sidebar_id,
						action: "sidebar-closed",
					}, function(){
						var form, new_widget, widget_id;
						self.parentNode.classList.remove("closed");
						$(self).find(".handlediv").removeClass("up");
						new_widget = $(widget).clone().appendTo($(self));
						widget_id = new_widget.attr("data-widget_id");
						new_widget.find("h3").append("<span>");
						new_widget.find("h3 span").addClass("in-widget-title");
						widgets.ajax({
							widget_id: widget_id,
							sidebar_id: sidebar_id,
							action: "widgets-chooser-add",
						}, function(response){
							new_widget.addClass("open");
							new_widget.find(".select2").remove();
							new_widget.find(".widgets-chooser").hide();
							new_widget.find("select").select2("destroy");
							$(self).find(".widget").each(function(i, e){
								form = e.querySelector("form");
								form.widget_position.value = i;
								form.sidebar_id.value = sidebar_id;
								widget_id = form.widget_id.value;
								$(e).attr("data-position", i);
								$(e).attr("id", sidebar_id+"-widget-"+widget_id+"-"+i);
								$(e).find(".form-field").each(function(i, e){
									$(e).find("input").attr("id", $(e).find("input").attr("id")+"-"+i);
									$(e).find("label").attr("for", $(e).find("label").attr("for")+"-"+i);
									$(e).find("select").each(function(){
										$(this).attr("id", $(this).attr("id")+"-"+i);
										ws.dropdown(this);
									});
								});
							});
							new_widget.find(".widget-inside").stop().slideDown(delay, function(){
								core.dd(response);
								new_widget.find(".title").focus();
							});
						});
					});
				}
			});
		}
	},
	sortableWidgets: {
		sitebarName: function(e){
			var area, closed, sidebar;
			area = e.closest(".widgets-holder-wrap");
			sidebar = e.closest(".widgets-sortables");
			closed = area.classList.contains("closed") ? 0 : 1;
			widgets.ajax({
				closed: closed,
				sidebar_id: sidebar.id,
				action: "sidebar-closed",
			}, function(response){
				if(closed) {
					area.classList.add("closed");
					$(e).find(".handlediv").addClass("up");
				}
				else {
					area.classList.remove("closed");
					$(e).find(".handlediv").removeClass("up");
				}
			});
		},
		widgetTop: function(e){
			let widget = e.closest(".widget");
			if(widget.classList.contains("open")) {
				widget.classList.remove("open");
				$(widget).find(".widget-action").addClass("up");
				$(widget).find(".widget-inside").stop().slideUp(widgets.options.delay);
			}
			else {
				widget.classList.add("open");
				$(widget).find(".widget-action").removeClass("up");
				$(widget).find(".widget-inside").stop().slideDown(widgets.options.delay);
			}
		},
		controlTitle: function(e){
			let widget = e.closest(".widget");
			widget.classList.add("widget-dirty");
			$(widget).find(".widget-control-save").val("Lưu thay đổi");
			$(widget).find(".widget-control-save").removeAttr("disabled");
		},
		controlClose: function(e){
			var title, form = e.form;
			var widget = e.closest(".widget");
			$(widget).removeAttr("style");
			widget.classList.remove("open");
			widget.classList.remove("widget-dirty");
			$(widget).find(".widget-action").addClass("up");
			$(widget).find(".widget-inside").stop().slideUp(widgets.options.delay, function(){
				if(title = form.title.value) {
					title = ": "+title;
				}
				$(widget).find(".in-widget-title").text(title);
			});
		},
		controlRemove: function(e){
			var delay, widget, form = e.form;
			form.action.value = "widget-control-remove";
			widgets.ajax($(form).serialize(), function(){
				delay = widgets.options.delay;
				widget = e.closest(".widget");
				$(widget).find(".widget-inside").stop().slideUp(delay);
				$(widget).fadeOut(delay, function(){
					$(widget).remove();
				});
			});
		},
		controlSave: function(e){
			let widget, data, form = e.form;
			widget = e.closest(".widget");
			data = $(form).serialize();
			$(widget).find(".widget-inside").addClass("box");
			widgets.ajax(data, function(response){
				let title;
				if(title = form.widget_title.value) {
					title = ": " + title;
				}
				$(e).val("Đã lưu");
				$(e).attr("disabled", true);
				widget.classList.remove("widget-dirty");
				$(widget).find(".in-widget-title").text(title);
				$(widget).find(".widget-inside").removeClass("box");
			});
		}
	},
	inactivewidgets: {
		controlRemove: function(e){
			var node = document.getElementById("inactive-widgets");
			$(node).find(".widget").remove();
			e.setAttribute("disabled", true);
		}
	},
	init: function(mod){
		
		core.dd(mod);

		// widgets-sortables
		widgets.sort(".widgets-sortables", "#widget-list, .widgets-sortables");

		$("#widget-list").sortable({
			items: ".widget",
			placeholder: "widget-placeholder",
			connectWith: "#widgets-right .widgets-sortables",
			helper: function(event, ui){
				core.dd("available-widgets: helper");
				ui.clone().insertAfter(ui);
				let clone = ui.clone();
				clone.addClass("ui-draggable ui-draggable-dragging");
				return clone;
			},
			start: function(event, ui){
				core.dd("available-widgets: start");
				$(ui.item).removeClass("ui-sortable-handle");
				$("#widgets-right .widgets-sortables").each(function(){
					$(this.parentNode).addClass("widget-hover");
				});
			},
			update: function(event, ui) {
				core.dd("available-widgets: update");
				$(ui.item).removeClass("ui-draggable-dragging");
			},
			stop: function(event, ui){
				core.dd("available-widgets: stop");
				$("#widgets-right .widgets-sortables").each(function(){
					$(this.parentNode).removeClass("widget-hover");
				});
				let self = $(ui.item).parents("#widget-list");
				if($(this).attr("id") == self.attr("id")) {
					$(ui.item).remove();
					$(ui.placeholder).remove();
					$(this).find(".widget").removeClass("ui-draggable");
					return;
				}
				var new_widget = $(ui.item);
				self = new_widget.parents(".widgets-sortables");
				var delay = widgets.options.delay;
				var widget_id, sidebar_id = self.attr("id");
				widget_id = new_widget.attr("data-widget_id");
				new_widget.find("h3").append("<span>");
				new_widget.find("h3 span").addClass("in-widget-title");
				widgets.ajax({
					closed: 0,
					sidebar_id: sidebar_id,
					action: "sidebar-closed",
				}, function(){
					self.parent().removeClass("closed");
					self.find(".handlediv").removeClass("up");
					widgets.ajax({
						widget_id: widget_id,
						sidebar_id: sidebar_id,
						action: "widgets-chooser-add",
					}, function(response){
						new_widget.addClass("open");
						new_widget.find(".select2").remove();
						new_widget.find(".widgets-chooser").hide();
						new_widget.find("select").select2("destroy");
						self.find(".widget").each(function(i, e){
							form = e.querySelector("form");
							form.widget_position.value = i;
							form.sidebar_id.value = sidebar_id;
							widget_id = form.widget_id.value;
							$(e).attr("data-position", i);
							$(e).attr("id", sidebar_id+"-widget-"+widget_id+"-"+i);
							$(e).find(".form-field").each(function(i, e){
								$(e).find("input").attr("id", $(e).find("input").attr("id")+"-"+i);
								$(e).find("label").attr("for", $(e).find("label").attr("for")+"-"+i);
								$(e).find("select").each(function(){
									$(this).attr("id", $(this).attr("id")+"-"+i);
									ws.dropdown(this);
								});
							});
						});
						new_widget.find(".widget-inside").stop().slideDown(delay, function(){
							core.dd(response);
							new_widget.find(".title").focus();
						});
					});
				});
			},
		});

		$(document).on("click", "#available-widgets .sidebar-name", function(){
			widgets.availableWidgets.sitebarName(this);
		});

		$(document).on("click", "#available-widgets .widget-top", function(){
			widgets.availableWidgets.widgetTop(this);
		});

		$(document).on("click", "#available-widgets .widgets-chooser-cancel", function(){
			widgets.availableWidgets.chooserCancel(this);
		});

		$(document).on("click", "#available-widgets .widgets-chooser-button", function(){
			widgets.availableWidgets.chooserButton(this);
		});

		$(document).on("click", "#available-widgets .widgets-chooser-add", function(){
			widgets.availableWidgets.chooserAdd(this);
		});

		$(document).on("click", ".widgets-sortables .sidebar-name", function(){
			widgets.sortableWidgets.sitebarName(this);
		});

		$(document).on("click", ".widgets-sortables .widget-top", function(e){
			widgets.sortableWidgets.widgetTop(this);
		});

		$(document).on("click", ".widgets-sortables .widget-control-close", function(){
			widgets.sortableWidgets.controlClose(this);
		});

		$(document).on("click", ".widgets-sortables .widget-control-remove", function(){
			widgets.sortableWidgets.controlRemove(this);
		});

		$(document).on("click", ".widgets-sortables .widget-control-save", function(e){
			widgets.sortableWidgets.controlSave(this);
		});

		$(document).on("click", "#inactive-widgets-control-remove", function(e){
			widgets.inactivewidgets.controlRemove(this);
		});

		$(document).on("keyup", ".widgets-sortables form input", function(){
			widgets.sortableWidgets.controlTitle(this);
		});
        $(document).on("change", ".widgets-sortables form input", function(){
			widgets.sortableWidgets.controlTitle(this);
		});
        $(document).on("change", ".widgets-sortables form select", function(){
			widgets.sortableWidgets.controlTitle(this);
		});
	}
};

$(function(){
	widgets.init(module);
});