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

             // ★ OrgChart 初期化（最小構成）
            const chart = new OrgChart(document.getElementById("tree"), {
                template: "olivia",
                nodeBinding: {
                    field_0: "name",
                    field_1: "title",
                    img_0: "img"
                },
                nodes: nodes
            });
            
            // ★ 家系図を左寄せに強制（最終決定版）
            chart.on('redraw', function () {
                const svg = document.querySelector('#tree svg');
                if (!svg) return;
            
                svg.style.transform = 'none';
                svg.style.width = '100%';
            
                const groups = svg.querySelectorAll('g');
                groups.forEach(g => g.removeAttribute('transform'));
            });
            
            // ★ 内部イベントを全部消す ← これが原因なので削除
            // chart.events = {};
            
            // ★ クリックイベントだけ追加
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

// ★ パネルを閉じる関数（絶対に動く最小形）
window.hidePanel = function () {
    document.getElementById("side-panel").classList.add("hidden");
};
