// JSON を読み込む
fetch("seiwa-genji.json")
  .then(res => res.json())
  .then(data => {
    // id/pid 形式 → 階層構造に変換
    const map = {};
    data.forEach(d => map[d.id] = { ...d, children: [] });

    let root = null;
    data.forEach(d => {
      if (d.pid) {
        map[d.pid].children.push(map[d.id]);
      } else {
        root = map[d.id];
      }
    });

    drawTree(root);
  });

function drawTree(data) {
  const svg = d3.select("#tree");
  const width = window.innerWidth;
  const height = window.innerHeight;

  const root = d3.hierarchy(data);
  const treeLayout = d3.tree().nodeSize([120, 80]);
  treeLayout(root);

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, 50)`);


  // 線
  svg.selectAll("line")
    .data(root.links())
    .enter()
    .append("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke", "#555");

  // ノードグループ
  const node = svg.selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x - 60}, ${d.y - 40})`);

  // ノード背景
  node.append("rect")
    .attr("width", 120)
    .attr("height", 80)
    .attr("rx", 10)
    .attr("fill", "#fff")
    .attr("stroke", "#333");

  // 画像
  node.append("image")
    .attr("href", d => d.data.img)
    .attr("x", 5)
    .attr("y", 5)
    .attr("width", 40)
    .attr("height", 40);

  // 名前
  node.append("text")
    .attr("x", 55)
    .attr("y", 25)
    .attr("font-size", "14px")
    .text(d => d.data.name);

  // タイトル
  node.append("text")
    .attr("x", 55)
    .attr("y", 45)
    .attr("font-size", "12px")
    .attr("fill", "#555")
    .text(d => d.data.title);

  // Wikipedia ボタン
  node.append("text")
    .attr("x", 55)
    .attr("y", 65)
    .attr("font-size", "12px")
    .attr("fill", "blue")
    .style("cursor", "pointer")
    .text("Wikipedia")
    .on("click", (e, d) => {
      window.open(d.data.wiki, "_blank");
    });
}
