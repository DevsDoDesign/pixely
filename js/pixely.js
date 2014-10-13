var colors = [
	'rgb(255,255,255)',
	'rgb(0,0,0)',
	'rgb(255,0,0)',
	'rgb(255,152,0)',
	'rgb(255,255,0)',
	'rgb(51,252,3)',
	'rgb(0,153,255)',
	'rgb(130,130,130)',
	'rgb(255,153,255)',
	'rgb(0,51,102)'
];

var size = 20;

// Render palette
for (var i = 0; i < colors.length; i++) {
	var palette = document.getElementById('colorshare');

	var input = document.createElement('input');
    input.type = 'radio';
    input.name = 'color';
    input.value = colors[i];
    input.id = 'color-'+i;
    if (i == 0) input.checked = 'checked';
    palette.appendChild(input);

    var label = document.createElement('label');
    label.setAttribute("for", 'color-'+i);
    label.style.background = colors[i];
    palette.appendChild(label);
};

// Render grid
for (var i = 0; i < size; i++) {
	var drawCanvas = document.getElementById('draw-canvas');

	var tr = document.createElement('tr');
	tr.id = 'tr-'+i;

	drawCanvas.appendChild(tr);

	for (var j = 0; j < size; j++) {
		var row = document.getElementById('tr-'+i);

		var td = document.createElement('td');
		td.className = 'drawable';

		row.appendChild(td);
	};

	fillTd = document.createElement('td');
	button = document.createElement('button');
	button.className = 'fill';
	button.innerHTML = 'Fill';
	fillTd.appendChild(button);
	row.appendChild(fillTd);
};

var colorMap = (function() {
	var map = JSON.stringify(colors);
	return {
		fromColor: function(color) {
			return map[color ? color : 'rgb(0,0,0)'];
		},
		getAll: function() {
			return map;
		}
	}
})();

var getColor = function() { return document.querySelector('[name=color]:checked').value; }

// nodelist to array
var nl2ar = function(nl) { return Array.prototype.slice.call(nl); };
// query selector string to array
var qs2ar = function(selector) { return nl2ar(document.querySelectorAll(selector)); };

var cells = qs2ar('td.drawable');

var drawing = false;
document.addEventListener('mousedown', function() { drawing = true; });
document.addEventListener('mouseup', function() { drawing = false; });

var fillCell = function(cell) { cell.style.background = getColor(); }

cells.forEach(function(cell) {
	cell.addEventListener('mousedown', function() {
		fillCell(cell);
	});
	cell.addEventListener('mouseover', function() {
		if ( ! drawing) return;
		fillCell(cell);
	});
});

qs2ar('button.fill').forEach(function(btn) {
	btn.addEventListener('click', function() {
		nl2ar(btn.parentNode.parentNode.querySelectorAll('td.drawable')).forEach(function(cell) {
			fillCell(cell);
		});
	});
});

var downloadCanvas = function(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}

document.querySelector('#generate').addEventListener('click', function(btn) {
	document.getElementById('draw-canvas').className = 'hidden';
	var oldCanvas = document.getElementById('draw-canvas');

	html2canvas(oldCanvas, {
		onrendered: function(canvas) {
			canvas.id = 'download-canvas';
			canvas.style.display = 'none';
			document.body.appendChild(canvas);
			var url = document.getElementById('download-canvas').toDataURL();
			oldCanvas.className = oldCanvas.className.replace( /(?:^|\s)hidden(?!\S)/ , '' );
			window.open(url);
		}
	});
});