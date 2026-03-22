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
                },  // ← ★ここにカンマが必要
            
                nodeClick: (node) => {
                    showPanel(node);
                }   // ← ★ここはカンマ不要（最後の要素だから）
            });

            OrgChart.templates.olivia.field_2 =
                '<foreignObject x="10" y="60" width="200" height="40">' +
                    '<div xmlns="http://www.w3.org/1999/xhtml" ' +
                    'style="font-size:14px; white-space:pre-wrap; word-break:break-word; overflow:hidden;">{val}</div>' +
                '</foreignObject>';

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
