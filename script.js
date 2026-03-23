// 家系図を描画
const chart = new FamilyTree(document.getElementById("tree"), {
    template: "olivia",
    nodeBinding: {
        field_0: "name",
        field_1: "title",
        img_0: "img"
    }
});

// Wikipedia ボタンのクリック処理
chart.on('click', function (sender, args) {
    const node = args.node;

    // ボタンの位置（200,20）付近を判定
    const x = args.event.offsetX;
    const y = args.event.offsetY;

    if (Math.abs(x - 200) < 15 && Math.abs(y - 20) < 15) {
        if (node.wiki) {
            window.open(node.wiki, "_blank");
        }
    }
});

// JSON 読み込み（ここを seiwa-genji.json に変更）
fetch("seiwa-genji.json")
    .then(res => res.json())
    .then(data => chart.load(data));
