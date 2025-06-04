function buscar(){
  var termino=document.getElementById("buscador").value.trim().toLowerCase();
  var explosion=document.getElementById("explosion");
  var resultados=document.getElementById("resultados");
  resultados.innerHTML=""
  if(!termino){
    alert("escribi xd")
  }
  else if(termino=="lio") {
    explosion.style.display="block"
    setTimeout(()=>{
      explosion.style.display="none"
      var r={
        nombre:"lio",
        imagen:"lio.jpg",
        descripcion:"omg encontraste el easter egg de lio, sos un verdadero conocedor de ranas",
        reino:"bob",
        filo:"epic",
        clase:"4 15",
        orden:"ferg"
      }
      var c=document.createElement("div")
      c.className="card m-2"
      c.style.width="480px"
      c.innerHTML=
        `<img src="${r.imagen}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${r.nombre}</h5>
          <p class="card-text">
            Reino:${r.reino}<br>
            Filo:${r.filo}<br>
            Clase:${r.clase}<br>
            Orden:${r.orden}<br>
            Descripción:${r.descripcion}
          </p>
        </div>`
      resultados.appendChild(c)
    },800)
  } 
  else{
    explosion.style.display="block"
    setTimeout(()=>{
      explosion.style.display="none"
      fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(termino)}&per_page=1`)
        .then(res=>res.json())
        .then(respuestainat=>{
          let imageURL="xd.png";
          if(respuestainat.results.length>0&&respuestainat.results[0].photos.length>0) {
            imageURL=respuestainat.results[0].photos[0].url.replace("square","medium")
          }
          var i=respuestainat.results[0]
          if(i.geojson) {
            var coordenadas=i.geojson.coordinates
            var longitud=coordenadas[0]
            var latitud=coordenadas[1]       
            L.marker([latitud,longitud]).addTo(m)
              .bindPopup(`<p>${termino}</p><br><img src="${imageURL}" width="150">`)
              .openPopup()
            m.setView([latitud,longitud],10)
          }
          fetch(`https://api.gbif.org/v1/species/search?q=${encodeURIComponent(termino)}`)
            .then(res=>res.json())
            .then(respuestaGBIF=>{
              if(!respuestaGBIF.results||respuestaGBIF.results.length==0){
                resultados.innerHTML="<h1>No hay</h1>"
              }
              else{
                var especie=respuestaGBIF.results[0]
                fetch(`https://api.gbif.org/v1/species/${especie.key}`)
                  .then(res=>res.json())
                  .then(()=>{
                    var c=document.createElement("div")
                    c.className="card m-2"
                    c.style.width="480px"
                    c.innerHTML= 
                    `<img src="${imageURL}" class="card-img-top">
                      <div class="card-body">
                        <h5 class="card-title">${especie.scientificName || "No se"}</h5>
                        <p class="card-text">
                          Reino:${especie.kingdom||"No se"}<br>
                          Filo:${especie.phylum||"No se"}<br>
                          Clase:${especie.class||"No se"}<br>
                          Orden:${especie.order||"No se"}<br>
                          Genero:${especie.genus|| "No se"}<br>
                          Familia:${especie.family||"No se"}
                        </p>
                      </div>`
                    resultados.appendChild(c)
                  })
                  .catch(()=> {
                    resultados.innerHTML="<h1>Error</h1>"
                    mapa.style.display="none"
                  })
              }
            })
            .catch(()=> {
              resultados.innerHTML="<h1>Error</h1>"
              mapa.style.display="none"
            });
        })
        .catch(()=> {
          resultados.innerHTML="<h1>Error</h1>"
          mapa.style.display="none"
        })
    },800)
  }
}
var m=L.map('mapa').setView([0,0], 2) 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(m)