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
                }
            });

            chart.load(nodes);

        })
        .catch(err => {
            console.error("JSON 読み込みエラー:", err);
        });

});
