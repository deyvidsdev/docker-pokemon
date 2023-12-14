const listaPokemon = document.querySelector("#listaPokemon");
const searchPokemon = document.querySelector("#searchPokemon");
const searchButton = document.querySelector('#searchButton');
const mostrarTodos = document.querySelector('#mostrarTodos');

let URL = "https://pokeapi.co/api/v2/pokemon/";
let URL_SEARCH = "https://pokeapi.co/api/v2/pokemon-form/";

// Función para borrar la lista actual
function borrarListaPokemon() {
    listaPokemon.innerHTML = "";
}

// Bucle para cargar los primeros 151 Pokémon
for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data));
}

function mostrarTodosPokemont(){
    borrarListaPokemon();
    // Bucle para cargar los primeros 151 Pokémon
    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => mostrarPokemon(data));
    }
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

mostrarTodos.addEventListener('click', function(event){
    event.preventDefault();
    mostrarTodosPokemont();
});

searchButton.addEventListener('click', function(event) {
    event.preventDefault();

    const searchText = searchPokemon.value.trim();

    if (searchText !== "") {
        const new_url = URL_SEARCH + searchText.toLowerCase();
        console.log(new_url);

        fetch(new_url)
            .then((response) => {
                if (!response.ok) {
                    alert('No se encontró el Pokémon')
                    throw new Error("No se encontró el Pokémon");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                console.log('data.pokemon.url: ', data.pokemon.url);
                return fetch(data.pokemon.url);
            })
            .then(response => response.json())
            .then(detailedData => {
                borrarListaPokemon();
                mostrarPokemon(detailedData);
            })
            .catch(error => {
                // Manejar el error, por ejemplo, mostrar un mensaje de error
                console.error(error.message);
            });
    }
});
