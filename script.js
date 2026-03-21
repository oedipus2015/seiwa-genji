// ==========================
// ログ
// ==========================
function log(msg, type="info") {
    const logDiv = document.getElementById("log");

    let color = "#0f0";
    if (type === "error") color = "#f44";
    if (type === "warn") color = "#ff0";

    const time = new Date().toLocaleTimeString();

    logDiv.innerHTML += `<span style="color:${color}">[${time}] ${msg}</span><br>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

function toggleLog() {
    const logDiv = document.getElementById("log");
    logDiv.style.display = (logDiv.style.display === "none") ? "block" : "none";
}

function clearLog() {
    document.getElementById("log").innerHTML = "";
}

// ==========================
// 数値変換
// ==========================
function toNum(v) {
    if (!v) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
}

// ==========================
// 起動
// ==========================
window.addEventListener("DOMContentLoaded", () => {
    loadCSV("a.csv?v=" + Date.now());
});

// ==========================
// CSV読み込み
// ==========================
function loadCSV(path) {
    log("CSV読み込み開始");

    fetch(path)
        .then(res => res.text())
        .then(csv => parseCSV(csv))
        .catch(err => log("エラー: " + err.message, "error"));
}

// ==========================
// CSV解析
// ==========================
function parseCSV(csv) {
    const lines = csv.split(/\r?\n/);
    log("行数: " + lines.length);

    const dataLines = lines.slice(1);

    const nodes = [];

    // 🔥 ダミー母（最初に追加）
    nodes.push({
        id: 9999,
        name: "",
        img: ""
    });

    dataLines.forEach((line, index) => {

        if (!line.trim()) return;

        const cols = line.split(",").map(v => v.trim());

        while (cols.length < 6) cols.push("");

        const id = toNum(cols[0]);
        const name = cols[1];
        const desc = cols[2];
        const father = toNum(cols[4]);
        const img = cols[5];

        let node = {
            id: id,
            name: name,
            title: desc,
            img: img || "img/dummy.jpg"
        };

        // 🔥 縦ツリー強制
        if (father) {
            node.fid = father;
            node.mid = 9999;
        }

        log("node: " + JSON.stringify(node));

        nodes.push(node);
    });

    log("ノード数: " + nodes.length);

    // ==========================
    // 描画
    // ==========================
    const tree = new FamilyTree(document.getElementById("tree"), {
        nodes: nodes,
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        }
    });

    tree.on("click", function(sender, args){
        alert(args.node.name + "\n" + args.node.title);
    });

    setTimeout(() => {
        tree.fit();
        tree.center();
    }, 500);

    log("描画完了");
}
