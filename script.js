document.addEventListener("DOMContentLoaded", () => {

    fetch("a.csv")
        .then(res => res.text())
        .then(text => {

            const lines = text.trim().split(/\r?\n/);
            const headers = lines[0].split(",");

            const myData = {};
            const nodes = [];

            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(",");

                let row = {};
                headers.forEach((h, idx) => {
                    row[h.trim()] = cols[idx] ? cols[idx].trim() : "";
                });

                const id = Number(row.id);
                const pid = row.pid ? Number(row.pid) : null;

                myData[id] = row;

                nodes.push({
                    id: id,
                    pid: pid,
                    name: row.name,
                    title: row.title,
                    img: row.img
                });
            }

            /* ★ OrgChart 初期化（align は使わない） */
            const chart = new OrgChart(document.getElementById("tree"), {
                template: "olivia",
                nodeBinding: {
                    field_0: "name",
                    field_1: "title",
                    img_0: "img"
                },
                nodes: nodes
            });

            /* ★ ノードクリックで右パネルに表示 */
            chart.on('click', function (sender, args) {
                args.cancel = true;

                const id = args?.node?.id;
                if (!id) return;

                const n = myData[id];
                if (!n) return;

                document.getElementById("panel-img").src = n.img;
                document.getElementById("panel-name").textContent = n.name;
                document.getElementById("panel-title").textContent = n.title;

                document.getElementById("side-panel").classList.remove("hidden");
            });

        });
});

/* ★ パネルを閉じる関数 */
window.hidePanel = function () {
    document.getElementById("side-panel").classList.add("hidden");
};
