function buscar() {
  document.getElementById("lol").style.display = "none";
  var termino = document.getElementById("buscador").value.trim().toLowerCase();
  var explosion = document.getElementById("explosion");
  var resultados = document.getElementById("resultados");
  resultados.innerHTML = "";

  if (!termino) {
    alert("escribí xd");
  } else if (termino == "borgie") {
    document.getElementById("explosionSound").play();
    explosion.style.display = "block";

    setTimeout(() => {
      explosion.style.display = "none";

      var r = {
        nombre: "borgie",
        video: "borgie.mp4",
        descripcion: "omg encontraste el easter egg de borgie, sos un verdadero conocedor de ranas",
        reino: "Animalia",
        filo: "Chordata",
        clase: "Amphibia",
        orden: "Anura",
        familia: "Pyxicephalidae",
        genero: "Pyxicephalus",
        ig: "https://www.instagram.com/mamjammarley/"
      };

      var c = document.createElement("div");
      c.className = "card m-2";
      c.style.width = "480px";
      c.innerHTML = `
        <video class="card-img-top" controls autoplay loop muted>
          <source src="${r.video}" type="video/mp4">
        </video>
        <div class="card-body">
          <h5 class="card-title">${r.nombre}</h5>
          <p class="card-text">
            Reino: ${r.reino}<br>
            Filo: ${r.filo}<br>
            Clase: ${r.clase}<br>
            Orden: ${r.orden}<br>
            Familia: ${r.familia}<br>
            Género: ${r.genero}<br>
            Descripción: ${r.descripcion}<br>
            Instagram: <a href="${r.ig}" target="_blank">${r.ig}</a>
          </p>
        </div>`;

      resultados.appendChild(c);
      document.querySelector('.xd').style.display = 'flex';
      m.invalidateSize();
      L.marker([-24.654, 25.908]).addTo(m);
      m.setView([-24.654, 25.908], 10);
    }, 800);
  } 
  else {
    document.getElementById("explosionSound").play();
    explosion.style.display = "block";

    setTimeout(() => {
      explosion.style.display = "none";

      fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(termino)}&per_page=1`)
        .then(res => res.json())
        .then(respuestainat => {
          let imageURL = "hrhrh.jpg";

          if (respuestainat.results.length > 0 && respuestainat.results[0].photos.length > 0) {
            imageURL = respuestainat.results[0].photos[0].url.replace("square", "medium");
          }

          var i = respuestainat.results[0];
          if (i && i.geojson) {
            var coordenadas = i.geojson.coordinates;
            var longitud = coordenadas[0];
            var latitud = coordenadas[1];

            L.marker([latitud, longitud]).addTo(m);
            m.setView([latitud, longitud], 10);
          }

          fetch(`https://api.gbif.org/v1/species/search?q=${encodeURIComponent(termino)}`)
            .then(res => res.json())
            .then(respuestaGBIF => {
              if (!respuestaGBIF.results || respuestaGBIF.results.length === 0) {
                resultados.innerHTML = "<h1>No hay resultados</h1>";
              } 
              else {
                var especie = respuestaGBIF.results[0];

                var c = document.createElement("div");
                c.className = "card m-2";
                c.style.width = "480px";
                c.innerHTML = `
                  <img src="${imageURL}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title">${especie.scientificName || "No se"}</h5>
                    <p class="card-text">
                      Reino: ${especie.kingdom || "No se"}<br>
                      Filo: ${especie.phylum || "No se"}<br>
                      Clase: ${especie.class || "No se"}<br>
                      Orden: ${especie.order || "No se"}<br>
                      Género: ${especie.genus || "No se"}<br>
                      Familia: ${especie.family || "No se"}
                    </p>
                  </div>`;

                resultados.appendChild(c);
                document.querySelector('.xd').style.display = 'flex';
                m.invalidateSize();
              }
            })
            .catch(() => {
              resultados.innerHTML = "<h1>Error</h1>";
            });
        });
    }, 800);
  }
}

var m = L.map('mapa').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(m);

function descubrir() {
  const ranas = [
    "Lepidobatrachus laevis",
    "Phyllomedusa bicolor",
    "Breviceps adspersus",
    "Phyxicephalus adspersus",
    "Phyllobates terribilis"
  ];

  const alAzar = ranas[Math.floor(Math.random() * ranas.length)];
  document.getElementById("buscador").value = alAzar;
  buscar();
}