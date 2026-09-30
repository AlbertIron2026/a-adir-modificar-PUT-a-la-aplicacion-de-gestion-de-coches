// asignar una variable al elemento del front
const datosCoche = document.getElementById("datosCoche");
const inputId = document.getElementById("idcoche");

// Listener para pulsar Enter en campo input
inputId.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    verUno();
  }
});

const cocheURL = "http://localhost:8080/coches";

// C.R.U.D coches -> endpoints correspondientes
//añadimos el método modificar (PUT)

// en funciones:

// ver todos
function verTodos() {
  fetch(cocheURL)
    .then((respuesta) => respuesta.json())
    .then((data) => {
      console.log("todos los coches: ", data);
      datosCoche.innerHTML = ""; // vaciar espacio
      data.forEach((coche) => {
        datosCoche.innerHTML += `
            <h3>${coche.marca} ${coche.modelo} </h3>
              <hr>
            ${coche.precio}€
           <br>
            <small>id: ${coche.id}</small>
    
            <br><br>
        `;
      });
    })
    .catch((error) => console.log(error));
}

// ver uno por id

function verUno() {
  const id = inputId.value;

  console.log("ID:", id);
  console.log("URL:", `${cocheURL}/${id}`);
  fetch(`${cocheURL}/${id}`)
    .then((respuesta) => {
      console.log("Status:", respuesta.status);
      console.log("OK:", respuesta.ok);

      return respuesta.json();
    })
    .then((coche) => {
      console.log("Coche recibido:", coche);
      datosCoche.innerHTML = ""; // vaciar espacio

      if (coche === null) {
        datosCoche.innerHTML = `
        <h3>No hemos encontrado un coche con el ID ${id}</h3>
      `;
        return;
      }
      
      datosCoche.innerHTML = `
      <h3>${coche.marca} ${coche.modelo}</h3>
      <hr>
      ${coche.precio}
      <br><br>
    `;
    })
    .catch((error) => {
      console.error(error);
    });
}

// añadir uno
function crearCoche() {
  // pillar todos los valores de los inputs
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const matricula = document.getElementById("matricula").value;
  const precio = Number(document.getElementById("precio").value);
  const marcaId = Number(document.getElementById("marcaId").value);

  //asignamos valores al objeto nuevoCoche:
  const nuevoCoche = {
    marca: marca,
    modelo: modelo,
    matricula: matricula,
    precio: precio,
    marcaId: {
      id: marcaId,
    },
  };

  //y lo enviamos
  fetch(cocheURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //suele no funcionar el envio si no pones esto
    },
    body: JSON.stringify(nuevoCoche), //linea clave
  })
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`); //si da error, indicarlo
      }

      return respuesta.json();
    })
    .then((coche) => {
      console.log("Coche creado:", coche);
      alert("coche añadido!");
    })
    .catch((error) => {
      console.error(error);
    });
}


// actualizar uno por id (PUT):
function actualizarCoche() {
  const id = document.getElementById("idcocheactualizar").value;
  const marca = document.getElementById("marcaAct").value;
  const modelo = document.getElementById("modeloAct").value;
  const matricula = document.getElementById("matriculaAct").value;
  const precio = document.getElementById("precioAct").value;

  // todos los campos son obligatorios, menos la matrícula
  // (vacía = conservar la que ya tiene el coche)
  if (id === "" || marca === "" || modelo === "" || precio === "") {
    alert("rellena todos los campos menos la matrícula, si no quieres cambiarla");
  } else {
    const cocheActualizado = {
      marca: marca,
      modelo: modelo,
      matricula: matricula,
      precio: Number(precio),
    };

    fetch(`${cocheURL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cocheActualizado),
    })
      .then((respuesta) => {
        if (respuesta.status === 404) {
          datosCoche.innerHTML = `<p>No existe ningún coche con el ID ${id}</p>`;
        } else if (respuesta.status === 409) {
          datosCoche.innerHTML = `<p>Esa matrícula ya existe o falta algún dato</p>`;
        } else if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        } else {
          return respuesta.json();
        }
      })
      .then((coche) => {
        // coche solo tiene valor si todo ha ido bien
        if (coche) {
          console.log("Coche actualizado:", coche);
          datosCoche.innerHTML = `
            <p>Coche con ID ${id} actualizado: ${coche.marca} ${coche.modelo}, ${coche.precio}€</p>
          `;
        }
      })
      .catch((error) => {
        console.error(error);
        datosCoche.innerHTML = `<p>${error.message}</p>`;
      });
  }
}


// borrar uno por id:
function borrarCoche() {
  const id = document.getElementById("idcocheborrar").value;

  // Primero comprobamos si existe ese id:
  fetch(`${cocheURL}/${id}`)
    .then((respuesta) => respuesta.json())
    .then((coche) => {

      if (coche === null) {
        datosCoche.innerHTML = `
          <p>No existe ningún coche con el ID ${id}</p>
        `;
        return;
      }

      // Si existe, lo borramos
      
      return fetch(`${cocheURL}/${id}`, {
        method: "DELETE"
      });
    })
    .then((respuesta) => {

      // Si el coche no existía, ya hicimos return arriba
      if (!respuesta) return;

      if (!respuesta.ok) {
        throw new Error("No se ha podido borrar el coche");
      }else{
        datosCoche.innerHTML = `
        <p>El coche con ID ${id} ha sido borrado correctamente.</p>
      `;
      }
    })
    .catch((error) => {
      console.error(error);
      datosCoche.innerHTML = `<p>${error.message}</p>`;
    });
}

