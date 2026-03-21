document.addEventListener("DOMContentLoaded", () => {

  fetch("a.csv")
    .then(res => res.text())
    .then(text => {

      // ==========================
      // 改行コード対策（Windows/Unix両対応）
      // ==========================
      const lines = text.trim().split(/\r?\n/);

      // ==========================
      // ヘッダー取得
      // ==========================
      const headers = lines[0].split(",");

      // ==========================
      // ノード生成
      // ==========================
      const nodes = lines.slice(1).map(line => {

        const cols = line.split(",");

        let row = {};
        headers.forEach((h, i) => {
          row[h.trim()] = cols[i] ? cols[i].trim() : "";
        });

        // ==========================
        // ★ 超重要：型を完全に統一
        // ==========================
        const id = parseInt(row.id);

        // fatherが「1.0」「1」「空」全部対応
        let pid = null;
        if (row.father !== "") {
          pid = parseInt(row.father); // ←ここが決定打
        }

        // デバッグ（必要ならF12で確認）
        console.log(`ID:${id} → PID:${pid}`);

        return {
          id: id,
          pid: pid,

          name: row.name || "",
          desc: row.desc || "",
          gender: row.gender || "",
          img: row.img || ""
        };
      });

      console.log("NODES:", nodes);

      // ==========================
      // ツリー生成
      // ==========================
      new FamilyTree(document.getElementById("tree"), {

        // ★ 縦ツリー強制
        orientation: FamilyTree.orientation.top,

        // ★ 横崩れ防止
        layout: FamilyTree.layout.normal,

        // 表示内容
        nodeBinding: {
          field_0: "name",
          field_1: "desc",
          img_0: "img"
        },

        // 操作性
        scaleInitial: 0.8,
        mouseScrool: FamilyTree.action.zoom,

        nodes: nodes
      });

    })
    .catch(err => {
      console.error("CSV読み込みエラー:", err);
    });

});
