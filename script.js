// JSON を読み込む
fetch("seiwa-genji.json")
  .then(res => res.json())
  .then(data => {
    data.sort((a, b) => a.birthYear - b.birthYear);
    const container = document.getElementById("cards");

    data.forEach(person => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${person.img}">
        <h3>${person.name}</h3>
        <p>${person.title}</p>
        <a href="${person.wiki}" target="_blank">Wikipedia</a>
      `;

      container.appendChild(card);
    });
  });
