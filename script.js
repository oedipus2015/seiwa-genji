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
  const treeLayout = d3.tree().size([width - 100, height - 100]);
  treeLayout(root);

  // 線
  svg.selectAll("line")
    .data(root.links())
    .enter()
    .append("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke", "#000");

  // ノード
  svg.selectAll("rect")
    .data(root.descendants())
    .enter()
    .append("rect")
    .attr("x", d => d.x - 50)
    .attr("y", d => d.y - 20)
    .attr("width", 100)
    .attr("height", 40)
    .attr("fill", "#fff")
    .attr("stroke", "#000");

  // テキスト
  svg.selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 5)
    .attr("text-anchor", "middle")
    .text(d => d.data.name);
}
