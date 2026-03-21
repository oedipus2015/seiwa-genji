document.addEventListener("DOMContentLoaded", function () {

    const nodes = [
        { id: 1, name: "父" },
        { id: 2, name: "子", pid: 1 }
    ];

    new FamilyTree(document.getElementById("tree"), {
        nodes: nodes,
        nodeBinding: {
            field_0: "name"
        }
    });

});