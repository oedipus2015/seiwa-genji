document.addEventListener("DOMContentLoaded", () => {

  fetch("a.csv")
    .then(res => res.text())
    .then(text => {

      const lines = text.trim().split(/\r?\n/);

      const headers = lines[0].split(",");

      const nodes = lines.slice(1).map(line => {
        const cols = line.split(",");

        let row = {};
        headers.forEach((h, i) => {
          row[h.trim()] = cols[i] ? cols[i].trim() : "";
        });

        // ★ここを強化（原因対策）
        const id = Number(row.id.trim());
        const father = row.father.trim();

        const pid = father !== "" ? Number(father) : null;

        console.log("CHECK:", id, "→ parent:", pid); // ←確認用

        return {
          id: id,
          pid: pid,

          name: row.name || "",
          desc: row.desc || "",
          gender: row.gender || "",
          img: row.img || ""
        };
      });

      console.log("FINAL NODES:", nodes);

      new FamilyTree(document.getElementById("tree"), {
        orientation: FamilyTree.orientation.top,
        layout: FamilyTree.layout.normal,

        nodeBinding: {
          field_0: "name",
          field_1: "desc"
        },

        nodes: nodes
      });

    });

});
