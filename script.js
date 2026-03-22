document.addEventListener("DOMContentLoaded", () => {

    // ★ JSON を読み込む
    fetch("seiwa-genji.json")
        .then(res => res.json())
        .then(nodes => {

            // ★ OrgChart 初期化（標準ポップアップのみ）
            new OrgChart(document.getElementById("tree"), {
                template: "olivia",

                nodeBinding: {
                    field_0: "name",
                    field_1: "title",
                    field_2: "desc",
                    img_0: "img"
                },

                editForm: {
                    readOnly: true,     // 編集不可
                    photoBinding: "img" // 画像を表示
                },

                nodes: nodes
            });

        })
        .catch(err => {
            console.error("JSON 読み込みエラー:", err);
        });

});
