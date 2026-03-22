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
                }
            });

            // ★ desc を textarea に変える本命コード（field_2 を上書き！！）
            OrgChart.templates.olivia.field_2 =
                '<textarea class="oc-desc" style="width:100%;height:auto;white-space:pre-wrap;word-break:break-word;border:none;background:transparent;resize:none;" readonly>{val}</textarea>';

            chart.load(nodes);

        })
        .catch(err => {
            console.error("JSON 読み込みエラー:", err);
        });

});
