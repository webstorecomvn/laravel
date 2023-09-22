var main = {
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
	chartHits: function(num){
		config = {
			type: 'line',
			data: {
				labels: [],
				datasets: [{
					data: [],
					fill: false,
					borderWidth: 2,
					lineTension: 0,
					label: 'Khách',
					borderColor: 'rgba(0,156,226,1)',
				}, {
					data: [],
					fill: false,
					borderWidth: 2,
					lineTension: 0,
					label: 'Lượt truy cập',
					borderColor: 'rgba(255,111,3,1)',
				}]
			},
			options: {
				responsive: true,
				title:{
					display: true,
					text: 'Số liệu thống kê truy cập trong %u ngày gần nhất'.replace(/%u/g, num),
				},
				tooltips: {
					mode: 'index',
					callbacks: {
						label: function(t, d) {
							var xLabel = d.datasets[t.datasetIndex].label;
							var yLabel = main.addCommas(t.yLabel);
							return xLabel + ': ' + yLabel;
						}
					},
				},
				hover: {
					mode: 'index'
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Ngày'
						}
					}],
					yAxes: [{
						stacked: true,
						scaleLabel: {
							display: true,
							labelString: 'Lượt truy cập'
						},
						ticks: {
							callback: function(value) {
								return main.addCommas(value);
							}
						}
					}]
				}
			}
		};
		core.callAjax({
			data: {numDay: num},
			url: ajaxUrl+'chartHits',
		}, function(response){
			var ctx, data = response.results;
			config.data.labels = data.label;
			$("#box-chart .overlay").fadeOut();
			config.data.datasets[0].data = data.item.visitors;
			config.data.datasets[1].data = data.item.visits;
			ctx = document.getElementById('areaChartHits').getContext('2d');
			window.myLine = new Chart(ctx, config);
		});
	},
	getIpInfo: function(ip, callback){
		$.get("https://api.ipdata.co/"+ip+"?api-key=test", function (response) {
			callback(response);
		}, "jsonp");
	},
	init: function(module){
		main.chartHits(28);
	},
};

$(function(){
	main.init(module);
});