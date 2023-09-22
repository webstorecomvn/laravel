var dashboard = {
	ajaxurl: function(action){
		return ajaxurl+"&action="+action;
	},
	addCommas: function(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
	chartHits: function(id, days){
		core.ajax({
			url: dashboard.ajaxurl("chartHits"),
			data: {days: days, _token: _token},
			beforeSend: function(){
				$("#box-chart .overlay").fadeOut();
			}
		}, function(response){
			var ctx = document.getElementById(id).getContext("2d");
			window.myLine = new Chart(ctx, {
				type: "line",
				data: response.results.data,
				options: {
					responsive: true,
					title:{
						display: true,
						text: response.results.options.title.text,
					},
					tooltips: {
						mode: 'index',
						callbacks: {
							label: function(t, d) {
								let xLabel = d.datasets[t.datasetIndex].label;
								let yLabel = dashboard.addCommas(t.yLabel);
								return xLabel + ': ' + yLabel;
							}
						}
					},
					hover: {
						mode: 'index'
					},
					scales: {
						xAxes: response.results.options.scales.xAxes,
						yAxes: response.results.options.scales.yAxes,
					}
				}
			});
		});
	},
	init: function(){
		dashboard.chartHits("areaChartHits", 28);
	},
};

$(function(){
	dashboard.init();
});