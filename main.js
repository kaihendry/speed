function setGet() {
	var devices = document.getElementById("devices").value;
	window.location = '//' + window.location.host + '?' + devices;
}

function drawChart() {
	// Source: https://en.wikipedia.org/wiki/List_of_device_bandwidths
	d = decodeURI(window.location.search.substr(1));
	if (! d) { console.log("d is empty"); setGet(); } else {
	document.getElementById("devices").value = d;
	}
	d = JSON.parse(d);
	console.log(d);
	// If I don't parse twice, it doesn't seem to work!
	// d = JSON.parse(d);
	// console.log(d);
	a = [["Device","Download","Upload"]];
	var data = google.visualization.arrayToDataTable(a.concat(d));

	// insert dummy rows to push the bars inwards after we convert over to a numeric vAxis
	data.insertRows(0, [['', null, null]]);
	data.addRow(['', null, null]);

	var ticks = [];
	for (var i = 0, length = data.getNumberOfRows(); i < length; i++) {
		// build a list of labels to use for the vAxis
		ticks.push({
			v: i,
			f: data.getValue(i, 0)
		});
	}

	var view = new google.visualization.DataView(data);
	view.setColumns([{
		type: 'number',
		label: data.getColumnLabel(0),
		calc: function(dt, row) {
			// convert the strings to numbers with formatted values
			return {
				v: row,
				f: dt.getValue(row, 0)
			};
		}
	},
	1, 2, {
		type: 'number',
		label: 'Audio Streaming',
		calc: function() {
			return 0.2;
		}
	},
	{
		type: 'string',
		role: 'tooltip',
		calc: function(dt, row) {
			return 'Audio Streaming (200 kB/s)';
		}
	},
	{
		type: 'number',
		label: 'Video Streaming',
		calc: function() {
			return 2;
		}
	},
	{
		type: 'string',
		role: 'tooltip',
		calc: function(dt, row) {
			return 'Video Streaming (2 MB/s)';
		}
	}]);

	var options = {
		// title: 'Speeds compared',
		vAxis: {
			title: 'Technology at theoretical limits',
			ticks: ticks
		},
		hAxis: {
			title: 'Megabyte per second'
		},
		orientation: 'vertical',
		series: {
			0: {
				// Download speed
				type: 'bars'
			},
			1: {
				// Upload speed
				type: 'bars'
			},
			3: {
				// Audio streaming speed
				type: 'line'
			},
			4: {
				// Video streaming speed
				type: 'line'
			}
		}
	};

	// https://google-developers.appspot.com/chart/interactive/docs/gallery/barchart
	var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
	chart.draw(view, options);
}
google.load("visualization", "1", {
	packages: ["corechart"],
	callback: drawChart
});

