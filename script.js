function log(msg) {
    console.log(msg);
}

function toNum(v) {
    if (!v) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
}

window.addEventListener("DOMContentLoaded", () => {
    fetch("a.csv?v=" + Date.now())
        .then(res => res.text())
        .then(csv => parseCSV(csv))
        .catch(err => console.error(err));
});

function parseCSV(csv) {
    const lines = csv.trim().split(/\r?\n/);
    const dataLines = lines.slice(1);

    const nodes = [];

    dataLines.forEach(line => {
        if (!line.trim()) return;

        const cols = line.split(",");

        while (cols.length < 6) cols.push("");

        const id = toNum(cols[0]);
        const name = cols[1];
        const desc = cols[2];
        const father = toNum(cols[4]);
        const img = cols[5];

        let node = {
            id: id,
            name: name,
            title: desc,
            img: img || ""
        };

        if (father) {
            node.pid = father;
        }

        nodes.push(node);
    });

    console.log(nodes);

	new FamilyTree(document.getElementById("tree"), {
	    nodes: nodes,

	    nodeBinding: {
	        field_0: "name",
	        field_1: "title",
	        img_0: "img"
	    },

	    layout: "tree", // ← これだけにする
	});