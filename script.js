// FamilyTree を custom テンプレートで初期化
const chart = new FamilyTree(document.getElementById("tree"), {
    template: "custom",
    nodeBinding: {
        field_0: "name"
    }
});

// JSON 読み込み（seiwa-genji.json を使う）
fetch("seiwa-genji.json")
    .then(res => res.json())
    .then(data => chart.load(data));
