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

        // ★ここだけにする（重複禁止）
        const id = parseInt(row.id);
        const pid = row.father ? parseInt(row.father) : null;
        
        console.log("RAW father:", row.father);
        console.log("PID:", pid);

        return {
          id: id,
          pid: pid,
          name: row.name || "",
          desc: row.desc || "",
          gender: row.gender || "",
          img: row.img || ""
        };
      });

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
