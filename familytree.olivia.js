// Olivia template for FamilyTree.js (standalone template file)

FamilyTree.templates.olivia = Object.assign({}, FamilyTree.templates.base);

// ノードサイズ
FamilyTree.templates.olivia.size = [220, 120];

// 画像（確実に動く安定版）
FamilyTree.templates.olivia.img_0 =
    '<clipPath id="olivia_img_0"><circle cx="60" cy="60" r="40"></circle></clipPath>' +
    '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#olivia_img_0)" x="20" y="20" width="80" height="80" xlink:href="{val}"></image>';

// 名前
FamilyTree.templates.olivia.field_0 =
    '<text style="font-size:16px;font-weight:bold;" fill="#333" x="120" y="50">{val}</text>';

// タイトル
FamilyTree.templates.olivia.field_1 =
    '<text style="font-size:13px;" fill="#777" x="120" y="75">{val}</text>';

// ノード背景
FamilyTree.templates.olivia.node =
    '<rect x="0" y="0" width="220" height="120" rx="10" ry="10" fill="#fff" stroke="#ccc" stroke-width="1"></rect>' +
    FamilyTree.templates.olivia.img_0 +
    FamilyTree.templates.olivia.field_0 +
    FamilyTree.templates.olivia.field_1;

// Wikipedia ボタン
FamilyTree.templates.olivia.defs =
    '<g id="olivia_wiki_btn">' +
    '  <circle cx="200" cy="20" r="12" fill="#1a73e8"></circle>' +
    '  <text x="195" y="25" font-size="16" fill="#fff">W</text>' +
    '</g>';

FamilyTree.templates.olivia.node +=
    '<use xlink:href="#olivia_wiki_btn"></use>';
