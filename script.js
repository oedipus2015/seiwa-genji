// CSV 1行をパースする関数（カンマとダブルクォート対応）
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

            // ★ ここで myData を作る
            const myData = {};

            let nodes = lines.slice(1).map(line => {

                const cols = parseCSVLine(line);

                let row = {};
                headers.forEach((h, i) => {
                    row[h.trim()] = cols[i] ? cols[i].trim() : "";
                });

                // id と pid（親ID）
                const id = Number(row.id);
                const pid = row.pid ? Number(row.pid) : null;

                // ★ row を保存（クリック時に使う）
                myData[id] = row;

                return {
                    id: id,
                    pid: pid,
                    name: row.name || "",
                    title: row.title || "",
                    img: row.img || ""
                };
            });

            // OrgChart 初期化
            var chart = new OrgChart(document.getElementById("tree"), {
                template: "olivia",
                enableSearch: false,
            
                expand: false,     // ★ ノードをクリックしても展開しない
                collapse: { level: 0 }, // ★ 最初から全ノードを閉じたままにする
            
                nodeBinding: {
                    field_0: "name",
                    field_1: "title",
                    img_0: "img"
                },
            
                nodes: nodes
            });

            // ★ クリックイベント（myData を使う）
            chart.on('click', function (sender, args) {
            
                const id = args?.node?.id;
                if (!id) return;
            
                const n = myData[id];
                if (!n) return;
            
                // パネルにデータを入れる
                document.getElementById("panel-img").src = n.img;
                document.getElementById("panel-name").textContent = n.name;
                document.getElementById("panel-title").textContent = n.title;
            
                // パネルを表示
                document.getElementById("side-panel").classList.remove("hidden");
            });
            
            // 閉じる関数
            function hidePanel() {
                document.getElementById("side-panel").classList.add("hidden");
            }



        });

});
window.hidePanel = function () {
    document.getElementById("side-panel").classList.add("hidden");
};
