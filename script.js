// SVG サイズなどの設定
const width = 1000;
const dx = 20;
const dy = 200;

const tree = d3.tree().nodeSize([40, 200]);

const diagonal = d3.linkVertical()
  .x(d => d.x)
  .y(d => d.y);

let i = 0;
let root;

// JSON を読み込む
fetch("seiwa-genji.json")
  .then(res => res.json())
  .then(data => {
    const treeData = buildHierarchy(data);

    root = d3.hierarchy(treeData);
    root.x0 = 0;
    root.y0 = 0;

    // ★ 最初から全部展開するので collapse は使わない
    // if (root.children) root.children.forEach(collapse);

    const svg = d3.select("#tree").append("svg")
      .attr("width", width)
      .attr("height", 800)
      .append("g")
      .attr("transform", "translate(40,40)");

    update(root, svg);
  });

// フラット配列 → 階層構造に変換する関数
function buildHierarchy(list) {
  const map = new Map();
  let root = null;

  list.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  list.forEach(item => {
    const node = map.get(item.id);

    if (item.pid === null || item.pid === "null" || item.pid === 0 || item.pid === "0" || item.pid === undefined) {
      root = node;
    } else {
      const parent = map.get(Number(item.pid));
      if (parent) parent.children.push(node);
    }
  });

  return root;
}

// 子を折りたたむ（今回は使わない）
function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function update(source, svg) {
  const nodes = root.descendants();
  const links = root.links();

  tree(root);

  let node = svg.selectAll("g.node")
    .data(nodes, d => d.id || (d.id = ++i));

  // ノードの enter
  let nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${source.x0},${source.y0})`)
    .on("click", (event, d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d, svg);
    });

  // ★ 名前（先に描く）
  nodeEnter.append("text")
    .attr("dy", "0.31em")
    .attr("x", 120)
    .text(d => d.data.name);
  
  // ★ 画像（後に描く＝前面に来る）
  nodeEnter.append("image")
    .attr("class", "node-image")
    .attr("href", d => d.data.img || "img/dummy.png")
    .attr("x", -100)
    .attr("y", -100)
    .attr("width", 200)
    .attr("height", 200);

  let nodeUpdate = nodeEnter.merge(node);

  // ★ 縦ツリー用 transform
  nodeUpdate.transition()
    .duration(300)
    .attr("transform", d => `translate(${d.x},${d.y})`);

  let link = svg.selectAll("path.link")
    .data(links, d => d.target.id);

  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", d => diagonal({ source: source, target: source }))
    .merge(link)
    .transition()
    .duration(300)
    .attr("d", diagonal);

  nodes.forEach(d => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
