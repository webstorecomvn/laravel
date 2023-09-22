var internal_link = 
{
	chart: function(el, num){
		if(! document.getElementById(el)) {
			return false;
		}
		core.callAjax({
			data: {numDay: num},
			url: ajaxUrl+'chartHits',
		}, function(response){
			var ctx = document.getElementById(el).getContext('2d');
			new Chart(ctx, {
				type: "line",
				data: {
					labels: response.results.days,
					datasets: [{
						lineTension: 0,
						label: "Lượt nhấp",
						borderColor: "rgba(191, 208, 12, 1)",
						backgroundColor: "rgba(191, 208, 12, 0.4)",
						borderWidth: 3,
						data: response.results.item.clicks
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false,
					},
					title:{
						display: true,
						text: "Số liệu thống kê lượt nhấp trong %u ngày gần nhất".replace(/%u/g, num),
					},
					tooltips: {
						mode: "index",
					},
					hover: {
						mode: "index"
					},
					scales: {
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: "Thời gian"
							}
						}],
						yAxes: [{
							ticks: {
								precision: 0
							},
							scaleLabel: {
								display: true,
								labelString: "Lượt nhấp"
							}
						}]
					}
				}
			});
		});
	},
	doExport: function(e){
		var form = e.form;
		var mode = form.export.value;
		const mimetype = (mode === "csv") ? "text/csv" : "application/json";
		core.modAjax("export", {
			data: {
				mode: mode
			}
		}, function(response){
			var blob = new Blob([
				new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
				response.results,
			  ],
			  { type: mimetype + ";charset=utf-8" }
			);
			download(blob, "mbw-internal-link." + mode, mimetype);
		});
	},
	init: function(){
		this.chart("areaChart", 20);
		$(document).on("click", ".numToUnlimited", function(){
			document.getElementById("num_of_links").value = -1;
		});
	},
};

$(function(){
	internal_link.init();
});