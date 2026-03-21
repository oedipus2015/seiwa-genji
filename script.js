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

            let nodes = lines.slice(1).map(line => {

                const cols = parseCSVLine(line);

                let row = {};
                headers.forEach((h, i) => {
                    row[h.trim()] = cols[i] ? cols[i].trim() : "";
                });

                // id と pid（親ID）
                const id = Number(row.id);
                const pid = row.pid ? Number(row.pid) : null;

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

                nodeBinding: {
                    field_0: "name",
                    field_1: "title",
                    img_0: "img"
                },

                nodes: nodes
            });

            // クリックイベント
            chart.on('click', function (sender, args) {

                console.log("CLICK EVENT:", args);
                console.log("NODE:", args.node);
                console.log("NODE.DATA:", args.node?.data);
                console.log("NODE.RECORD:", args.node?.record);

                if (!args || !args.node || !args.node.data) return;

                const n = args.node.data;

                const html = `
                    <div class="popup">
                        <img src="${n.img}" class="popup-img">
                        <h2>${n.name}</h2>
                        <p>${n.title}</p>
                        <button onclick="document.querySelector('.popup').remove()">閉じる</button>
                    </div>
                `;

                const old = document.querySelector('.popup');
                if (old) old.remove();

                document.body.insertAdjacentHTML('beforeend', html);
            });

        });

});
