document.addEventListener("DOMContentLoaded", () => {

    fetch("seiwa-genji.json")
        .then(res => res.json())
        .then(nodes => {

            const chart = new OrgChart(document.getElementById("tree"), {
                template: "olivia",

                nodeBinding: {
                    field_0: "name",
                    field_1: "title",
                    field_2: "desc",
                    img_0: "img"
                },

                editForm: {
                    readOnly: true,
                    photoBinding: "img"
                },

                nodeClick: (node) => {
                    showPanel(node);
                }
            });

            // ★ ノード側の desc を textarea に変える
            OrgChart.templates.olivia.field_2 =
                '<textarea class="oc-desc" style="width:100%;height:auto;white-space:pre-wrap;word-break:break-word;border:none;background:transparent;resize:none;" readonly>{val}</textarea>';
            
            // ★ ここに追加！！（\n → <br> に変換）
            OrgChart.templates.olivia.field_2 =
                OrgChart.templates.olivia.field_2.replace("{val}", "{val}".replace(/\n/g, "<br>"));
            
            chart.load(nodes);

        })
        .catch(err => {
            console.error("JSON 読み込みエラー:", err);
        });

});


// ★ 右パネル表示
function showPanel(node) {
    document.getElementById("panel-img").src = node.img || "";
    document.getElementById("panel-name").textContent = node.name || "";
    document.getElementById("panel-title").textContent = node.title || "";

    // ★ textarea に入れる（改行OK）
    document.getElementById("panel-desc").value = node.desc || "";

    document.getElementById("side-panel").classList.remove("hidden");
}

function hidePanel() {
    document.getElementById("side-panel").classList.add("hidden");
}
