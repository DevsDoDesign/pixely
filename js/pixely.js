var colors = [
	'#FFFFFF',
	'#000000',
	'#FF0000',
	'#FF9800',
	'#FFFF00',
	'#33FC03',
	'#0099FF',
	'#828282',
	'#FF99FF',
	'#003366'
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

	drawCanvas.appendChild(tr);

	for (var j = 0; j < size; j++) {
		var td = document.createElement('td');
		td.className = 'drawable';
		tr.appendChild(td);
	};

	fillTd = document.createElement('td');
	button = document.createElement('button');
	button.className = 'fill';
	button.innerHTML = 'Fill';
	fillTd.appendChild(button);
	tr.appendChild(fillTd);
};

// Add a row of fill buttons to the bottom
var tr = document.createElement('tr');
drawCanvas.appendChild(tr);
for (var j = 0; j < size; j++) {
	fillTd = document.createElement('td');
	button = document.createElement('button');
	button.className = 'fillUp';
	button.innerHTML = 'Fill';
	button.dataset.count = j;
	fillTd.appendChild(button);
	tr.appendChild(fillTd);
};

var getColor = function() { return document.querySelector('[name=color]:checked').value; }

// nodelist to array
var nl2ar = function(nl) { return Array.prototype.slice.call(nl); };
// query selector string to array
var qs2ar = function(selector) { return nl2ar(document.querySelectorAll(selector)); };

// Generate the image from canvas
var generateImage = function() {
	var canvas = document.createElement('canvas');
	var scale = 20;
	var width = size * scale;
	var ctx = canvas.getContext('2d');
	canvas.width = canvas.height = width;
	canvas.style.width = canvas.style.height = width + 'px';

	var x = y = 0;
	cells.forEach(function(cell) {
		if (x == 20) {
			y++;
			x = 0;
		}

		ctx.fillStyle = cell.style.background || '#000000';
		ctx.fillRect(x * scale, y * scale, 1 * scale, 1 * scale);

		x++;
	});

	return canvas.toDataURL('image/png');
}

// Generate the favicon
var generateFavicon = function() {
	var head = document.getElementsByTagName("head")[0];
	var img = document.createElement('img');
	var favicon = document.getElementById('favicon');
	var link = favicon.cloneNode(true);

	head.removeChild(favicon);
	link.href = generateImage();
	head.appendChild(link);
}

var cells = qs2ar('td.drawable');

var drawing = false;
document.addEventListener('mousedown', function() { drawing = true; });
document.addEventListener('mouseup', function() { drawing = false; });

var fillCell = function(cell) { cell.style.background = getColor(); }

cells.forEach(function(cell) {
	cell.addEventListener('mousedown', function() {
		fillCell(cell);
		generateFavicon();
	});
	cell.addEventListener('mouseover', function() {
		if ( ! drawing) return;
		fillCell(cell);
		generateFavicon();
	});
});

qs2ar('button.fill').forEach(function(btn) {
	btn.addEventListener('click', function() {
		nl2ar(btn.parentNode.parentNode.querySelectorAll('td.drawable')).forEach(function(cell) {
			fillCell(cell);
			generateFavicon();
		});
	});
});
// Add listener to the fillUp buttons to fill the columns
qs2ar('button.fillUp').forEach(function(btn) {
	btn.addEventListener('click', function() {
		var column = (parseInt(this.dataset.count) + 1);
		nl2ar(document.querySelectorAll('td.drawable:nth-child(' + column + ')')).forEach(function(cell) {
			fillCell(cell);
			generateFavicon();
		});
	});
});

document.querySelector('#generate').addEventListener('click', function(btn) {
	var canvas = generateImage();
	window.open(canvas, '_blank');
});
