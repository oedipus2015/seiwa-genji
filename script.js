// ==========================
// ログ関数
// ==========================
function log(msg, type="info") {
    const logDiv = document.getElementById("log");

    let color = "#00ff00";
    if (type === "error") color = "#ff4444";
    if (type === "warn") color = "#ffff00";

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
    const n = parseInt(v.replace(/[^\d]/g, ""));
    return isNaN(n) ? null : n;
}

// ==========================
// 自動CSV読み込み
// ==========================
window.addEventListener("DOMContentLoaded", () => {
    loadCSV("a.csv");
});

function loadCSV(path) {
    log("CSV自動読み込み開始");

    fetch(path)
        .then(res => {
            if (!res.ok) throw new Error("CSV取得失敗");
            return res.text();
        })
        .then(csv => {
            log("CSV取得OK");
            parseCSV(csv);
        })
        .catch(err => {
            log("エラー: " + err.message, "error");
            console.error(err);
        });
}

// ==========================
// CSV解析＆描画
// ==========================
function parseCSV(csv) {
    const lines = csv.split(/\r?\n/);
    log("行数: " + lines.length);

    const dataLines = lines.slice(1);

    const nodes = [];
    const spouseMap = {};

    dataLines.forEach((line, index) => {

        if (!line.trim()) {
            log("空行スキップ: " + index, "warn");
            return;
        }

        const cols = line.split(",").map(v => v.trim());

        log("解析: " + JSON.stringify(cols));

        if (cols.length < 8) {
            log("列不足スキップ: " + line, "warn");
            return;
        }

        const id = toNum(cols[0]);
        const name = cols[1];
        const desc = cols[2];
        const father = toNum(cols[4]);
        const mother = toNum(cols[5]);
        const spouse = toNum(cols[6]);
        const img = cols[7];

        if (!id) {
            log("ID不正: " + line, "error");
            return;
        }

        let node = {
            id: id,
            name: name,
            desc: desc,
            img: img || ""
        };

        // 親子関係
        if (father && mother) {
            node.fid = father;
            node.mid = mother;
        } else if (father) {
            node.pid = father;
        } else if (mother) {
            node.mid = mother;
        }

        // 配偶者
        if (spouse) {
            spouseMap[id] = spouse;
        }

        nodes.push(node);
    });

    // 配偶者リンク
    nodes.forEach(node => {
        const sp = spouseMap[node.id];
        if (sp) node.pids = [sp];
    });

    log("ノード数: " + nodes.length);

    if (nodes.length === 0) {
        log("ノードが空", "error");
        return;
    }

	// ==========================
	// 🔥 安全テンプレ（baseから作る）
	// ==========================
	FamilyTree.templates.myTemplate = Object.assign({}, FamilyTree.templates.base);

	// サイズ
	FamilyTree.templates.myTemplate.size = [250, 160];

	// 枠（これないと表示されない）
	FamilyTree.templates.myTemplate.node =
	    '<rect x="0" y="0" width="250" height="160" fill="#ffffff" stroke="#333" rx="10" ry="10"></rect>';

	// 画像
	FamilyTree.templates.myTemplate.img_0 =
	    `
	    <clipPath id="circleClip">
	        <circle cx="125" cy="50" r="32"></circle>
	    </clipPath>

	    <image x="93" y="18"
	           width="64" height="64"
	           href="{val}"
	           preserveAspectRatio="xMidYMid slice"
	           clip-path="url(#circleClip)">
	    `;

	// 名前（上）
	FamilyTree.templates.myTemplate.field_1 =
	    '<text x="125" y="110" text-anchor="middle" style="font-size:18px;font-weight:bold;">{val}</text>';

	// 説明（下）
	FamilyTree.templates.myTemplate.field_0 =
	    '<text x="125" y="130" text-anchor="middle" style="font-size:12px;fill:#666;">{val}</text>';
    // ==========================
    // 家系図描画
    // ==========================
    const tree = new FamilyTree(document.getElementById("tree"), {
    	template: "myTemplate",
        nodes: nodes,

        nodeBinding: {
            field_0: "desc",
            field_1: "name",
            img_0: "img"
        },

        orientation: FamilyTree.orientation.top,
        scaleInitial: FamilyTree.match.boundary
    });

	// クリックイベント
	tree.on('click', function(sender, args){
	    alert(args.node.name + "\n" + args.node.desc);
	});

	// 👇ここに追加！！
	tree.on('mouseOver', function(sender, args){
	    args.node.element.style.transform = "scale(1.1)";
	});

	tree.on('mouseOut', function(sender, args){
	    args.node.element.style.transform = "scale(1)";
	});

    // 表示調整
    setTimeout(() => {
        tree.fit();
        tree.center();
    }, 500);

    log("描画完了");
}