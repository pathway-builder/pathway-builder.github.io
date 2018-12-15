// Quadrants
var quadrants = [
  {val:.25, lbl:"A", name:'Verbal/Concrete (A)'},
  {val:.12, lbl:"B",  name:'Verbal/Abstract (B)'},
  {val:.43, lbl:"C",  name:'Graphic/Concrete (C)'},
  {val:.20, lbl:"D",  name:'Graphic/Abstract (D)'}
];

// Modules
var modules = [
  {num:1, name:'Smarter Learning'},
  {num:2, name:'Stratefic Thinking'},
  {num:3, name:'Selfwork'},
  {num:4, name:'Teamwork'},
  {num:5, name:'Communication & Networking'},
  {num:6, name:'Design & Innovation'},
  {num:7, name:'Information Management'}
];

// Quad-to-Module Relevance Mapping
var qmMap = [
  // 1    2    3    4    5    6    7
  [.20, .10, .50, .30, .50, .50, .30],  // 1
  [.30, .60, .50, .10, .30, .20, .40],  // 2
  [.50, .30, .10, .60, .40, .30, .20],  // 3
  [.30, .30, .30, .40, .20, .40, .50]   // 4
];

// Load up all of the sliders
qmMap.forEach((quad, r) => {
  var qm = document.createElement('div');
  qm.classList.add('one-q');
  var labelsM = "<div></div>", labelsQ = "", sliders = "";

  quad.forEach((mod, c) => {
    labelsM += `<div class="lbl-m">${modules[c].num}</div>`;
    labelsQ += `<label data-quad="${r}" data-mod="${c}">${qmMap[r][c]}</label>`
    sliders += `<input type="range" list="tickmarks" class="map" data-quad="${r}" data-mod="${c}" step="0.1" min="0" max="1" value="${qmMap[r][c]}">`
  });

  // Create the first row label
  if (r == 0) {
    var lblM = document.createElement('div');
    lblM.classList.add('one-q');
    lblM.innerHTML = labelsM;
    document.getElementById('mapping').appendChild(lblM);
  }

  qm.innerHTML += `<div class="lbl-q">${quadrants[r].lbl}</div>`;
  qm.innerHTML += labelsQ;

  qm.innerHTML += sliders;

  document.getElementById('mapping').appendChild(qm);
});

// If a slider is changed, update the label for it
document.querySelectorAll('.map').forEach(map => {
  map.addEventListener('change', event => {
    var m = event.target.dataset.mod;
    var q = event.target.dataset.quad;
    qmMap[q][m] = parseFloat(event.target.value);
    document.querySelector(`label[data-quad="${q}"][data-mod="${m}"]`).innerHTML = event.target.value;
    computeModules();
  })
});

// Recompute all factors and output a path
var computeModules = function() {
  // Compute the value of the module weight vs quadrant weight
  var vals = new Array();
  modules.forEach((mod, num) => {
    let val = 0;
    quadrants.forEach((quad, n) => {
      val += (quad.val * qmMap[n][num]);
    })
    vals[num] = {module:{num:mod.num, name:mod.name}, val:val}
  });
  // Sort the values so the most weighted module goes first
  vals.sort(function (a, b) {
    return b.val - a.val;
  });
  console.table(vals);

  // Ouput the pathway
  //document.getElementById('modules').innerHTML = ''; // Uncomment to prevent pathway history
  var path = document.createElement('ul');
  path.classList.add('pathway');
  vals.forEach(mod => {
    var m = document.createElement('li');
    m.innerHTML = `<h3 class="mod">${mod.module.num}</h3>`;
    path.appendChild(m);
  });
  document.getElementById('modules').prepend(path);
};

// Create the four quadrants and make them editable (edits trigger a new pathway)
quadrants.forEach((quad, n) => {
  var q = document.createElement('div');
  q.innerHTML = `<h2 class="quad-name">${quad.name}</h2>`;
  q.classList.add('quadrant');
  var i = document.createElement('input');
  i.setAttribute('type', 'text');
  i.setAttribute('value', quad.val * 100);
  i.classList.add('quad-val');
  i.id = 'q' + n;
  i.addEventListener('change', event => {
    var newval = parseInt(event.target.value);
    event.target.setAttribute('value', newval);
    var i = 0;
    var modcell = event.target.parentNode;
    while((modcell=modcell.previousSibling) != null) ++i;
    quadrants[i].val = newval/100;
    computeModules();
  });
  q.appendChild(i);
  document.getElementById('quadrants').appendChild(q);
});

// Randomize quadrants
function randomQuadrants() {
  var seedmax = 60, seedmin = 15;
  var qAr = new Array();
  var factor = 0, total = 0;

  for (var i = 0; i < 4; i++) {
    factor += qAr[i] = Math.floor(Math.random() * (seedmax - seedmin) + seedmin);
  }

  factor = 100 / factor;

  for (var i = 0; i < 4; i++) {
    var _val;
    if (i == quadrants.length - 1)
      _val = 100 - total;
    else
      _val = Math.round(qAr[i] * factor);

    quadrants[i].val = _val / 100;
    total += _val;
    document.getElementById('q'+i).value = _val;
  }

  computeModules();
}
document.getElementById('randQ').addEventListener('click', randomQuadrants);


// Kickoff with the first pathway
window.onload = () => {
  randomQuadrants();
}
