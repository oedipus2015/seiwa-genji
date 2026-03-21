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

                const id = Number(row.id);
                const pid = row.father ? Number(row.father) : null;

                return {
                    id: id,
                    pid: pid,
                    name: row.name || "",
                    desc: row.desc || "",
                    img: row.img || ""   // OrgChart は img_0 にバインドする
                };
            });

            // OrgChart の描画
            new OrgChart(document.getElementById("tree"), {
                template: "olivia",     // ← OrgChart は olivia が最初から使える
                enableSearch: false,

                nodeBinding: {
                    field_0: "name",
                    field_1: "desc",
                    img_0: "img"        // ← OrgChart の画像フィールド
                },

                nodes: nodes
            });
            chart.on('click', function (sender, args) {
            
                const n = args.node;
            
                const html = `
                    <div class="popup">
                        <img src="${n.img}" class="popup-img">
                        <h2>${n.name}</h2>
                        <p>${n.desc}</p>   <!-- desc をそのまま詳細として使う -->
                        <button onclick="document.querySelector('.popup').remove()">閉じる</button>
                    </div>
                `;
            
                const old = document.querySelector('.popup');
                if (old) old.remove();
            
                document.body.insertAdjacentHTML('beforeend', html);
            });

        });

});
