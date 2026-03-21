document.addEventListener("DOMContentLoaded", () => {

    fetch("a.csv")
        .then(res => res.text())
        .then(text => {

            const lines = text.trim().split(/\r?\n/);
            const headers = lines[0].split(",");

            const nodes = [];

            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(",");

                let row = {};
                headers.forEach((h, idx) => {
                    row[h.trim()] = cols[idx] ? cols[idx].trim() : "";
                });

                nodes.push({
                    id: Number(row.id),
                    pid: row.pid ? Number(row.pid) : null,
                    name: row.name,
                    title: row.title,
                    img: row.img
                });
            }

            /* ★ OrgChart 初期化（標準ポップアップを使う） */
            new OrgChart(document.getElementById("tree"), {
                template: "olivia",
                nodeBinding: {
                    field_0: "name",
                    field_1: "title",
                    field_2: "desc",
                    img_0: "img"
                }
                nodes: nodes
            });

        });
});
