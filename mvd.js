// k - node  | o - options | c - children | n - DOM node
function VNode(k, o, c) {
  if (!(this instanceof VNode)) return new VNode(k, o, c);
  this.k = k, this.o = o, this.c = c, this.n = null;
}

const np = VNode.prototype;

np.create = function(p) {
  const { k, o, c } = this;
  const e = document.createElement(k);
  for (let ch of c) { ch.create(e); }
  p.appendChild(e);
  this.n = e;
}

np.update = function(b, p) {
  if (!b) p.removeChild(this.n);
  else {
    const { k, o, c, n } = this;
    let cs = patchList(c, b.c, n);
    this.c = cs;
  }
}

// s - text
// n - DOM node
function VNodeText(s) {
  if (!(this instanceof VNodeText)) return new VNodeText(s);
  this.s = s, this.n = null;
}

const tp = VNodeText.prototype;

tp.create = function(p) {
  const c = document.createTextNode(this.s);
  p.appendChild(c);
  this.n = c;
}

tp.update = function(b, p) {
  !b ? p.removeChild(this.n) : (this.n.textContent = b.s);
}

// a, b - Node | p - DOM parent
function patch(a, b, p) {
  return a && b ?
    (
      a.update(b, p),
      a.k !== b.k && (b.create(p), b) || a
    ) :
  a ?
    a.update(b, p):
    (b.create(p), b);
}

function patchList(a, b, p) {
  let inner = Math.max(a.length, b.length);
  const cs = [];
  for (let i = 0; i < inner; i++) {
    const u = patch(a[i], b[i], p);
    u && cs.push(u);
  }
  return cs;
}
