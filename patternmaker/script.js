var canvas = document.getElementById("workarea");
var context = canvas.getContext("2d");

var m = 10; // Margin to canvas border
var s = 3;  // Size of cube
var r = 15; // Circle radius
var p = 10; // Padding between circles
var l = 25; // Padding between layers



var strokeWidth = 2; // Line width of circle border and lines

// Create a temprary storage for current pattern
var leds;

// Container for the generated gif url
var gifUrl;

// Id elements
var add = document.getElementById('add');
var byteSize = document.getElementById('byteSize');
var clear = document.getElementById('clear');
var clearListBtn = document.getElementById('clearListBtn');
var closeCode = document.getElementById('closeCode');
var closePreview = document.getElementById('closePreview');
var codemodal = document.getElementById('codemodal');
var count = document.getElementById('count');
var generate = document.getElementById('generate');
var previewmodal = document.getElementById('previewmodal');
var listwrapper = document.getElementById("listwrapper");
var modalText = document.getElementById('modalText');
var patternList = document.getElementById('patternList');
var previewBtn = document.getElementById('previewBtn');
var previewGif = document.getElementById('previewGif');
var sizeInput = document.getElementById('sizeInput');
var snackbar = document.getElementById('snackbar');
var timeInput = document.getElementById('timeInput');

var shiftUpBtn = document.getElementById('shiftUpBtn');
var shiftDownBtn = document.getElementById('shiftDownBtn');
var shiftLeftBtn = document.getElementById('shiftLeftBtn');
var shiftRightBtn = document.getElementById('shiftRightBtn');
var shiftForthBtn = document.getElementById('shiftForthBtn');
var shiftBackBtn = document.getElementById('shiftBackBtn');


// Change the canvas/cube size
changeSize = function(newSize = s) {
  s = newSize;

  var width = m + s*s*(2*r + p) - p + m;
  var height = m + s*s*(2*r + p) - p + (s-1)*l + m; // FIXME What is wrong here?
  canvas.width = width;
  canvas.height = height;

  leds = Array.apply(null, Array(s)).map(function () { 
    return Array.apply(null, Array(s*s)).map(function () { 
      return 0;
    });
  });

  clearList();

  redraw();
}

// Get x and y coordinates of the center of an orthographic rendering of the cube
flattenPoint = function(a, b, c) {
  var layerOffset = (c-1)*(s*2*r + (s-1)*p + l);
  var x = (s-1)*(2*r + p) - (b-1)*(2*r + p) + s*(a-1)*(2*r + p) + r + m;
  var y = 2*r*(b-1) + p*(b-1) + layerOffset + r + m;
  
  return {x, y};
}

// Draw a circle, two styles active/deactivated
drawCircle = function(a, b, c, active = false) {
  var point = flattenPoint(a,b,c);

  context.beginPath();
  context.arc(point.x, point.y, r, 0, 2 * Math.PI, false);
  if (active) {
    context.fillStyle = '#51FF54'; // "Active" color (green)
  } else {
    context.fillStyle = 'grey';  // Disabled color
  }
  context.fill();
  context.lineWidth = strokeWidth;
  context.strokeStyle = '#003300'; // Dark green
  context.stroke();
}

drawLine = function(p1, p2) {
  var p1r = flattenPoint(p1.a, p1.b, p1.c);
  var p2r = flattenPoint(p2.a, p2.b, p2.c);
  
  context.beginPath();
  context.moveTo(p1r.x, p1r.y);
  context.lineTo(p2r.x, p2r.y);
  context.lineWidth = strokeWidth;
  context.strokeStyle = '#003300'; // dark green
  context.stroke();
}

drawDashedLine = function(p1, p2) {
  var p1r = flattenPoint(p1.a, p1.b, p1.c);
  var p2r = flattenPoint(p2.a, p2.b, p2.c);
  
  context.setLineDash([12, 15]); // Activate line dashing
  context.beginPath();
  context.moveTo(p1r.x, p1r.y);
  context.lineTo(p2r.x, p2r.y);
  context.lineWidth = strokeWidth;
  context.strokeStyle = '#5162ff'; // Blue-violet
  context.stroke();
  context.setLineDash([1,0]); // Reset lines to solid
}

// Click handler for the circles on the canvas
canvasClickHandler = function(e) {
  var x = e.clientX ;
  var y = e.clientY ;
  
  for (layer = 1; layer <= s; layer++) {
    for (row = 1; row <= s; row++) {
      for (col = 1; col <= s; col++) {
        var pos = flattenPoint(col, row, layer);
        
        // Get distance from mouse click to center of circle
        var dist = Math.sqrt((pos.x - x)*(pos.x - x) + (pos.y - y)*(pos.y - y));
        
        // If dist <= radius then the click hit a point
        if (dist <= r) {
          // Clicked stuff here TODO
          
          var currentVal = leds[layer-1][col  + s  * (row - 1) - 1];
          var newVal = 1 - currentVal; // Invert the value 1 => 0 and 0 => 1
          
          // Save the new value
          leds[layer-1][col  + s  * (row - 1) - 1] = newVal;
          
          // Make the changes appear
          redraw();

          return;
        }
      }
    }
  }
}


// Redraw the canvas
redraw = function() {
  // Clear canvas for redrawing
  context.clearRect(0, 0, canvas.width, canvas.height); // Neccesary?
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw vertical line to appear behind the others
  drawDashedLine({a: 1, b: 1, c: 1}, {a: 1, b: 1, c: s});
  
  // Draw horizontal lines
  for (layer = 1; layer <= s; layer++) {
    for (row = 1; row <= s; row++) {
      var p1 = {a: 1, b: row, c: layer};
      var p2 = {a: s, b: row, c: layer};
      drawLine(p1, p2);
    }
  }
  
  // Draw angled lines
  for (layer = 1; layer <= s; layer++) {
    for (col = 1; col <= s; col++) {
      var p1 = {a: col, b: 1, c: layer};
      var p2 = {a: col, b: s, c: layer};
      drawLine(p1, p2);
    }
  }
  
  // Draw the three other vertical lines
  drawDashedLine({a: s, b: 1, c: 1}, {a: s, b: 1, c: s}); // Back-right
  drawDashedLine({a: 1, b: s, c: 1}, {a: 1, b: s, c: s}); // Front-left
  drawDashedLine({a: s, b: s, c: 1}, {a: s, b: s, c: s}); // Front-right
  
  // Draw initial circles
  for (layer = 1; layer <= s; layer++) {
    for (row = 1; row <= s; row++) {
      for (col = 1; col <= s; col++) {
        // Get if the circle should be filled
        var active = (leds[layer-1][col  + s  * (row - 1) - 1]) == 1 ? true : false;
        drawCircle(col, row, layer, active);
      }
    }
  } 
}

// Clear all leds
clearCube = function() {
  for (layer = 1; layer <= s; layer++) {
    for (row = 1; row <= s; row++) {
      for (col = 1; col <= s; col++) {
        leds[layer-1][col  + s  * (row - 1) - 1] = 0;
      }
    }
  } 
  redraw();
}

// Add the current pattern to the list
addCurrent = function() {
  // Gather data
  var data = canvas.toDataURL();
  data = resizeImage(data, (s == 4) ? 0.35:0.25); // If s == 4 shrink to 35%, else 25% (visible lines)
  

  var onTime = timeInput.value;
  
  var patternData = cubeToPattern();
  
  
  // Create elements
  var li = document.createElement('li');
  var div = document.createElement('div');
  var rm = document.createElement('button');
  var img = document.createElement('img');
  var txt = document.createElement('p');
  
  
  // Config elements
  rm.appendChild(document.createTextNode('Remove'));
  rm.className = 'js-remove';
  
  img.src = data;
  
  txt.appendChild(document.createTextNode(onTime));
  
  div.className = 'f';
  div.appendChild(rm);
  div.appendChild(img);
  div.appendChild(txt);
  
  li.appendChild(div);
  li.dataset.pattern = patternData;
  
  
  // Add the new item to the list
  patternList.appendChild(li);

  // Update count
  count.innerHTML = 'Count: ' + patternList.children.length;

  // Scroll down if not manually scrolling
  listwrapper.scrollTop = listwrapper.scrollHeight;

}

// Resize an image (default shrinks to 25%)
resizeImage = function(data, size = 0.25) {
  var img = new Image();
  img.src = data;

  cv = document.createElement('canvas');
  cx = cv.getContext('2d');

  w = canvas.width * size;
  h = canvas.height * size;

  cv.width = w;
  cv.height = h;

  cx.drawImage(img, 0, 0, w, h);

  return cv.toDataURL();

}

// Clear the patternList
clearList = function() {
  patternList.innerHTML = '';

  count.innerHTML = 'Count: ' + patternList.children.length;
}

// Translate the current editing pattern to a pattern string
cubeToPattern = function() {
  pattern = "{";

  // For size, add each layer as an unsigned int
  leds.forEach(function(layer){
    var part = '(UINT) 0b'; // Using UINT to shorten down code and for readability, defined in arduino code
    part += layer.join('');
    part += ', ';

    pattern += part;
  });

  var onTime = timeInput.value;

  pattern += onTime + '}';
  return pattern;
}

// Generate the copy/paste ready code and display it)
generatePattern = function(){
  var rows = [...document.getElementsByTagName('li')];

  // Extract the pattern string from each row and add to array
  rowTemp = [];
  rows.forEach(function(row){
    rowTemp.push(row.dataset.pattern);
  });

  // Join all pattern strings and add the head and tail
  pattern = '#define SIZE ' + s + '\n';
  pattern += 'unsigned int pattern[][SIZE+1] = {\n    ';
  pattern += rowTemp.join(',\n    ');
  pattern += '\n  };'

  // Set the calculated size
  var size = patternList.children.length * 2 * (s+1);
  byteSize.innerHTML = '(' + size + ' bytes)';

  // Set the text to the generated code
  modalText.innerHTML = pattern;

  // Show the modal
  codemodal.style.display = 'flex';
}

changeSizeHandler = function() {
  changeSize(parseInt(sizeInput.options[sizeInput.selectedIndex].value));
}

// Shift the cube up
shiftUp = function() {
  var first = leds.shift();
  leds.push(first);
  redraw();
}

// Shift the cube down
shiftDown = function() {
  var last = leds.pop();
  leds.unshift(last);
  redraw();
}

// Shift the cube left
shiftLeft = function() {
  for (layer = 1; layer <= s; layer++) {
    var temp = [];

    for(n = 1; n <= s*s; n++) {
      var k = (n % s == 0) ? (1-s) : 1;
      temp.push(leds[layer - 1][(n-1) + k]);
    }

    leds[layer-1] = temp;
  }

  redraw();
}

// Shift the cube right
shiftRight = function() {
  for (layer = 1; layer <= s; layer++) {
    var temp = [];

    for(n = 0; n < s*s; n++) {
      var k = (n % s == 0) ? (s-1) : -1;
      temp.push(leds[layer - 1][n + k]);
    }

    leds[layer-1] = temp;
  }

  redraw();
}

// Shift the cube forth
shiftForth = function() {
  for (layer = 1; layer <= s; layer++) {
    var temp = leds[layer-1].slice(-s).concat(leds[layer-1].slice(0, -s));
    leds[layer-1] = temp;
  }
  redraw();
}

// Shift the cube back
shiftBack = function() {
  for (layer = 1; layer <= s; layer++) {
    var temp = leds[layer-1].slice(s).concat(leds[layer-1].slice(0, s));
    leds[layer-1] = temp;
  }
  redraw();
}


var rendering = false;
// Show a preview of the pattern in list
showPreview = function() {
  if (rendering) return; // Prevent multiple instances
  rendering = true;

  // Create a gif to add frames to
  var gif = new GIF({
    workers: 2,
    quality: 10,
  });

  // Add all frames to the gif
  var rows = [...document.querySelectorAll('#patternList li')];
  rows.forEach(function(row){
    var img = row.querySelector('img');
    var delay = parseInt(row.querySelector('p').innerHTML);
    gif.addFrame(img, {delay: delay});
  });

  // Prepare what to do when rendering done
  gif.on('finished', function(blob) {
    rendering = false;

    // Release previous resources
    if (gifUrl != undefined) {
      URL.revokeObjectURL(gifUrl);
    }

    // Create a local url from the blob
    gifUrl = URL.createObjectURL(blob);

    // Set the image to the one we generated and show the modal
    previewGif.src = gifUrl;
    previewmodal.style.display = 'flex';
  });

  // Start the actual rendering
  gif.render();
}

closeModal = function(modal) {
  modal.style.display = 'none';
}

// Attach listeners
canvas.addEventListener('click', canvasClickHandler);
clear.addEventListener('click', clearCube);
add.addEventListener('click', addCurrent);
generate.addEventListener('click', generatePattern);
closeCode.addEventListener('click', function() { codemodal.style.display = 'none'; });
codemodal.addEventListener('click', function(e) {
  if (e.srcElement.className == 'modal') { closeModal(codemodal); }});
clearListBtn.addEventListener('click', clearList);
sizeInput.addEventListener('change', changeSizeHandler);
previewBtn.addEventListener('click', showPreview);
closePreview.addEventListener('click', function() {closeModal(previewmodal)});
previewmodal.addEventListener('click', function(e) {
  if (e.srcElement.className == 'modal') { closeModal(previewmodal); }});

shiftUpBtn.addEventListener('click', shiftUp);
shiftDownBtn.addEventListener('click', shiftDown);
shiftLeftBtn.addEventListener('click', shiftLeft);
shiftRightBtn.addEventListener('click', shiftRight);
shiftForthBtn.addEventListener('click', shiftForth);
shiftBackBtn.addEventListener('click', shiftBack);

// Init canvas size
changeSize();

// Attach list functionallity
var editableList = Sortable.create(patternList, {
  filter: '.js-remove',
  onFilter: function (evt) {
    var el = editableList.closest(evt.item); // get dragged item
    el && el.parentNode.removeChild(el);
  }
});

// Init copying of code
var clip = new Clipboard('#copyBtn');

clip.on('success', function(e) {
  e.clearSelection();
  snackbar.className = 'show';

  // Remove the class name so we can show again later
  setTimeout(function() {snackbar.className = '';}, 3000);
});