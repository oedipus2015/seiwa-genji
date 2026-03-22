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
                    img_0: "img",
                    wiki: "wiki"
                },
            
                editForm: {
                    readOnly: true,
                    photoBinding: "img",
            
                    buttons: {
                        wiki: {
                            icon: OrgChart.icon.link,
                            text: "Wikipedia",
                            onClick: function (nodeId) {
                                const node = chart.get(nodeId);
                                if (node.wiki) {
                                    window.open(node.wiki, "_blank");
                                }
                            }
                        }
                    }
                }
            });

            // ★ ノード内の desc を textarea で表示（あなたが使っていた安定版）
            OrgChart.templates.olivia.field_2 =
                '<textarea class="oc-desc" ' +
                'style="width:100%;height:auto;white-space:pre-wrap;word-break:break-word;' +
                'border:none;background:transparent;resize:none;" readonly>{val}</textarea>';

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
    document.getElementById("panel-desc").value = node.desc || "";
        // ★ Wikipedia リンクをセット
    document.getElementById("panel-wiki").href = node.wiki || "";
    document.getElementById("side-panel").classList.remove("hidden");
}

function hidePanel() {
    document.getElementById("side-panel").classList.add("hidden");
}
