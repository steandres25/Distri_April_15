// New comment inside script.js 
document.addEventListener("DOMContentLoaded", () => {
  const pokemonContainer = document.querySelector('.container-pokemones');
  const infoContainer = document.getElementById("info-pokemon");
  const selectContainer = document.querySelector('.container-select-pokemon');

  let pokemonList = [];
  let filteredList = [];

  // Load Pokémon types into the select dropdown
  fetch('https://pokeapi.co/api/v2/type/')
    .then(res => res.json())
    .then(data => {
      const types = data.results;
      const typeSelect = document.createElement('select');
      const defaultOption = document.createElement('option');
      defaultOption.value = "";
      defaultOption.textContent = "All types";
      typeSelect.appendChild(defaultOption);

      types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = type.name;
        typeSelect.appendChild(option);
      });

      selectContainer.appendChild(typeSelect);

      // Event listener for type selection
      typeSelect.addEventListener('change', async (e) => {
        const selectedType = e.target.value;
        await filterByType(selectedType);
      });
    });

  // Load all Pokémon
  fetch('https://pokeapi.co/api/v2/pokemon?limit=1300')
    .then(res => res.json())
    .then(data => {
      pokemonList = data.results;
      filteredList = [...pokemonList];
      renderPokemons(filteredList);
    });

  // Function to render Pokémon in the grid
  function renderPokemons(pokemons) {
    pokemonContainer.innerHTML = "";
    pokemonContainer.style.display = 'grid';
    pokemonContainer.style.gap = '1rem';

    pokemons.forEach(pokemon => {
      const div = document.createElement('div');
      div.style.padding = '2rem';
      div.style.backgroundColor = 'pink';
      div.style.textAlign = 'center';
      div.style.borderRadius = '10px';
      div.style.textTransform = 'uppercase';
      div.style.fontFamily = '"Quicksand", sans-serif';
      div.style.fontWeight = 'bold';

      div.textContent = pokemon.name;
      div.addEventListener('click', () => showPokemonInfo(pokemon.name));

      pokemonContainer.appendChild(div);
    });
  }

  // Function to filter Pokémon by type
  async function filterByType(type) {
    if (!type) {
      filteredList = [...pokemonList];
      renderPokemons(filteredList);
      return;
    }

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await res.json();
      filteredList = data.pokemon.map(p => p.pokemon);
      renderPokemons(filteredList);
    } catch (error) {
      console.error("Error filtering by type:", error);
    }
  }

  // Function to show Pokémon information
  async function showPokemonInfo(name) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();

      infoContainer.innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p><strong>Height:</strong> ${data.height}</p>
        <p><strong>Weight:</strong> ${data.weight}</p>
        <p><strong>Types:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
        <p><strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(", ")}</p>
        <p><strong>Stats:</strong></p>
        <ul>
          ${data.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join("")}
        </ul>
      `;
    } catch (error) {
      console.error("Error fetching Pokémon info:", error);
    }
  }

});
