function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

document.addEventListener("DOMContentLoaded", () => {

  fetch("a.csv")
    .then(res => res.text())
    .then(text => {

      const lines = text.trim().split(/\r?\n/);
      const headers = lines[0].split(",");

      let nodes = lines.slice(1).map(line => {

        const cols = parseCSVLine(line);

        let row = {};
        headers.forEach((h, i) => {
          row[h.trim()] = cols[i] ? cols[i].trim() : "";
        });

        const id = Number(String(row.id).trim());

        const cleanFather = String(row.father)
          .replace(/[^\d]/g, "")
          .trim();

        const fid = cleanFather !== "" ? Number(cleanFather) : null;

        console.log("ID:", id, "FID:", fid);

        return {
          id: id,
          pid: fid,  // 親ID（最重要）

          name: row.name || "",
          desc: row.desc || "",
          img: row.img || ""   // ← 画像を追加
        };
      });

      nodes.sort((a, b) => a.id - b.id);

      new FamilyTree(document.getElementById("tree"), {
        template: "john",
      
        // ★ これを template の直後に置くと縦並びになる
        orientation: FamilyTree.orientation.top,
      
        layout: FamilyTree.layout.normal,
      
        nodeBinding: {
          field_0: "name",
          field_1: "desc",
          img_0: "img"
        },
      
        nodes: nodes
      });

    });

});
