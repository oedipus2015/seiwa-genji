// 家系図を描画
const chart = new FamilyTree(document.getElementById("tree"), {
    template: "olivia",
    nodeBinding: {
        field_0: "name",
        field_1: "title",
        img_0: "img"
    }
});

// Wikipedia ボタンをテンプレートに追加
FamilyTree.templates.olivia.wikiBtn =
    '<text style="cursor:pointer;" x="200" y="20" fill="#1a73e8" font-size="20">W</text>';

// ノードに Wikipedia ボタンを表示
FamilyTree.templates.olivia.node =
    FamilyTree.templates.olivia.node +
    FamilyTree.templates.olivia.wikiBtn;

// クリックイベント
chart.on('click', function (sender, args) {
    const node = args.node;

    // Wikipedia ボタンのクリック判定
    const clickX = args.event.offsetX;
    const clickY = args.event.offsetY;

    // ボタンの位置（x=200, y=20）付近を判定
    if (Math.abs(clickX - 200) < 15 && Math.abs(clickY - 20) < 15) {
        if (node.wiki) {
            window.open(node.wiki, "_blank");
        }
    }
});

// JSON 読み込み
fetch("data.json")
    .then(res => res.json())
    .then(data => chart.load(data));
