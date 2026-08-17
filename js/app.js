// Stores all Pokemon fetched from the PokeAPI
let pokemonList = [];

// Number of Pokemon to display at one time
let displayedPokemon = 30;

// Stores the current list being displayed
// This can be the full list, search results, or filtered results
let currentPokemonList = [];

async function loadPokemon() {

    // Show loading message while the API is being fetched
    showLoading();

    try {

        // Fetch the first 151 Pokemon from PokeAPI
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=151"
        );

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // Convert the response into JavaScript data
        const data = await response.json();

        // Empty the Pokemon list before adding new data
        pokemonList = [];

        // Loop through each Pokemon from the API
        for (const pokemonData of data.results) {

            // Fetch detailed information about the Pokemon
            const response = await fetch(pokemonData.url);

            // Check if the Pokemon request was successful
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            // Convert the response into JavaScript data
            const pokemon = await response.json();

            // Add the Pokemon information to our array
            pokemonList.push(pokemon);
        }

        // Display all of the Pokemon
        displayPokemon(pokemonList);

    } catch (error) {

        // Show the error in the browser console
        console.error("Error fetching Pokémon:", error);

        // Display a user-friendly error message
        showError();

    } finally {

        // Hide the loading message after the request finishes
        // This runs whether the request succeeds or fails
        hideLoading();
    }
}

function createCard(pokemon) {

    // Object containing a different background color
    // for each Pokemon type
    const typeColors = {

        normal: "bg-gray-500",
        fire: "bg-red-600",
        water: "bg-blue-600",
        grass: "bg-green-700",
        electric: "bg-yellow-400",
        ice: "bg-cyan-400",
        fighting: "bg-orange-600",
        poison: "bg-purple-700",
        ground: "bg-amber-600",
        flying: "bg-indigo-400",
        psychic: "bg-pink-600",
        bug: "bg-lime-500",
        rock: "bg-stone-500",
        ghost: "bg-violet-500",
        dragon: "bg-indigo-700",
        dark: "bg-gray-700",
        steel: "bg-slate-600",
        fairy: "bg-pink-400",
    };

    // Loop through the Pokemon's types
    const typeHTML = pokemon.types.map(function (typeData) {

        // Get the Pokemon type name
        // Example: "fire", "water", "grass"
        const type = typeData.type.name;

        // Find the Tailwind background color
        // that belongs to this type
        const color = typeColors[type];

        // Create the HTML for the type badge
        return `
            <div class="${color} py-2 px-3 m-2 text-white rounded-full font-semibold capitalize">
                ${typeData.type.name}
            </div>
        `;

    // Join all of the type HTML together
    }).join("");

    // Loop through all of the Pokemon's abilities
    const abilitiesHTML = pokemon.abilities.map(function (abilityData) {

        // Get the ability name
        const ability = abilityData.ability.name;

        // Create HTML for the ability
        return `
            <p class="capitalize text-gray-700">
                ${ability}
            </p>
        `;

    // Join all abilities together
    }).join("");

    // Loop through the Pokémon's six base stats
    const statsHTML = pokemon.stats.map(function (statData) {

        // Get the name of the stat
        // Examples: hp, attack, defense, speed
        const statName = statData.stat.name;

        // Get the base stat value
        const statBase = statData.base_stat;

        // Create the HTML for each stat
        return `
            <div class="mb-2">

                <!-- Stat name and number -->
                <div class="flex justify-between">

                    <p class="capitalize">
                        ${statName}
                    </p>

                    <p class="font-bold">
                        ${statBase}
                    </p>

                </div>

                <!-- Gray background for the stat bar -->
                <div class="bg-gray-300 rounded-full h-2">

                    <!-- Green section showing the stat value -->
                    <div
                        class="bg-green-500 h-2 rounded-full"
                        style="width: ${Math.min(statBase, 100)}%"
                    ></div>

                </div>

            </div>
        `;

    // Join all of the stats together
    }).join("");

    // Return the complete HTML for the Pokémon card
    return `
        <div class="
        pokemon-card 
        self-start 
        bg-green-100 
        rounded-xl 
        p-5 
        2xl:w-55 
        m-4 
        shadow-lg 
        transition 
        delay-100 
        duration-300 
        ease-in-out"
        >

            <!-- Pokemon name -->
            <h2 class="font-bold capitalize">
                ${pokemon.name}
            </h2>

            <!-- Pokedex number -->
            <p class="text-gray-600">
                Pokédex #${pokemon.id}
            </p>

            <!-- Pokemon image -->
            <img
                src="${pokemon.sprites.front_default}"
                alt="${pokemon.name}"
                class="pokemon-image mx-auto w-35 h-35"
            >

            <!-- Pokemon types -->
            <div class="flex justify-center gap-2">
                ${typeHTML}
            </div>

            <!-- Basic Pokémon information -->
            <div class="text-center border-t border-gray-500">

                <!-- Pokemon weight -->
                <p class="text-gray-500 mt-2">
                    Weight: ${pokemon.weight}
                </p>

                <!-- Pokemon height -->
                <p class="text-gray-500">
                    Height: ${pokemon.height}
                </p>

                <!-- Pokemon base experience -->
                <p class="text-gray-500">
                    Base Experience: ${pokemon.base_experience}
                </p>

            </div>


            <!-- Additional information starts hidden. It will appear when the user clicks the card. -->
            <div class="additional-info hidden mt-4 mb-4 border-t border-gray-500 pt-4">

                <h3 class="font-bold text-lg mb-2">
                    Additional Information
                </h3>


                <!-- Pokemon abilities -->
                <p class="font-semibold">
                    Abilities:
                </p>

                <div class="mb-3">
                    ${abilitiesHTML}
                </div>


                <!-- Pokemon base stats -->
                <p class="font-semibold">
                    Stats:
                </p>

                <div class="mb-3">
                    ${statsHTML}
                </div>


                <!-- Number of moves this Pokemon has -->
                <p>
                    Number of Moves:
                    ${pokemon.moves.length}
                </p>

            </div>


            <!-- Instructions for the user -->
            <p class="text-center text-sm text-gray-500 mt-4">
                Click card for more information
            </p>

        </div>
    `;
}

function displayPokemon(list) {

    // Remove the current Pokemon cards
    $("#pokemonContainer").html("");

    // Save the current list
    currentPokemonList = list;

    // Only take the number of Pokémon we want to display
    const visiblePokemon = list.slice(0, displayedPokemon);

    // Loop through each visible Pokémon
    visiblePokemon.forEach(function(pokemon) {

        // Create a card for the Pokémon
        const card = createCard(pokemon);

        // Add the card to the Pokémon container
        $("#pokemonContainer").append(card);

    });

    $(".pokemon-card").hover(

        // Runs when the mouse enters the card
        function() {

            $(this).addClass(
                "scale-105 shadow-xl shadow-green-300 m-6"
            );

        },

        // Runs when the mouse leaves the card
        function() {

            $(this).removeClass(
                "scale-105 shadow-xl shadow-green-300 m-6"
            );

        }
    );


    $(".pokemon-image").hover(

        // Runs when the mouse enters the image
        function() {

            // Makes the image animated
            $(this).addClass(
                "animate-bounce"
            );

        },

        // Runs when the mouse leaves the image
        function() {

            // Remove the animation
            $(this).removeClass(
                "animate-bounce"
            );

        }
    );

    // When a Pokémon card is clicked,
    // show or hide its additional information
    $(".pokemon-card").click(function() {

        $(this)
            .find(".additional-info")
            .slideToggle(300);

    });

    // If all Pokémon are already displayed,
    // hide the Load More button
    if (displayedPokemon >= list.length) {

        $("#loadMoreButton").hide();

    } else {

        // Otherwise, show the Load More button
        $("#loadMoreButton").show();

    }
}

function searchPokemon() {

    // Get the value typed into the search input
    // and convert it to lowercase
    const searchValue = $("#searchInput").val().toLowerCase();

    // Search through the Pokémon list
    const filteredPokemon = pokemonList.filter(function(pokemon) {

        // Search by Pokemon name
        // OR search by Pokedex number
        return pokemon.name.includes(searchValue) ||
            pokemon.id.toString().includes(searchValue);

    });

    if (filteredPokemon.length === 0) {

        // Show a message when no Pokémon match the search
        $("#pokemonContainer").html(`
            <div class="col-span-full text-center py-10">

                <h2 class="text-2xl font-bold text-gray-600">
                    No Pokémon Found
                </h2>

                <p class="text-gray-500 mt-2">
                    Try searching for a different name or Pokédex number.
                </p>

            </div>
        `);

        // Hide the Load More button
        $("#loadMoreButton").hide();

        // Stop running the function
        return;
    }


    // Reset the number of displayed Pokemon
    displayedPokemon = 30;

    // Display the search results
    displayPokemon(filteredPokemon);
}

// Run searchPokemon() whenever the user types
$("#searchInput").keyup(function() {

    searchPokemon();

});

function filterPokemon() {

    // Get the type selected from the dropdown
    const selectedType = $("#filterType").val();


    // If the user selects "All Types"
    if (selectedType === "all") {

        // Display every Pokemon
        displayPokemon(pokemonList);

        return;
    }


    // Filter the Pokemon based on their type
    const filteredType = pokemonList.filter(function(pokemon) {

        // Check if the Pokemon has the selected type
        return pokemon.types.some(function(typeData) {

            return typeData.type.name === selectedType;

        });

    });

    if (filteredType.length === 0) {

        // Display a message if no Pokemon have the selected type
        $("#pokemonContainer").html(`
            <div class="col-span-full text-center py-10">

                <h2 class="text-2xl font-bold text-gray-600">
                    No Pokémon Found
                </h2>

                <p class="text-gray-500 mt-2">
                    No Pokémon has the ${selectedType} type.
                </p>

            </div>
        `);

        // Hide the Load More button
        $("#loadMoreButton").hide();

        return;
    }

    // Reset the number of displayed Pokemon
    displayedPokemon = 30;

    // Display the filtered Pokémon
    displayPokemon(filteredType);
}

// Run filterPokemon() whenever the dropdown changes
$("#filterType").change(function() {

    filterPokemon();

});

function showLoading() {

    // Show the loading section
    $("#loading").show();

    // Hide the Load More button while loading
    $("#loadMoreButton").hide();
}

function hideLoading() {

    // Hide the loading section
    $("#loading").hide();

}

function loadMorePokemon() {

    // Increase the number of Pokemon displayed by 30
    displayedPokemon += 30;

    // Display the updated list
    displayPokemon(currentPokemonList);
}

// Run loadMorePokemon() when the button is clicked
$("#loadMoreButton").click(function() {

    loadMorePokemon();

});

function showError() {

    // Replace the Pokémon cards with a friendly error message
    $("#pokemonContainer").html(`
        <div class="col-span-full text-center py-10">

            <h2 class="text-2xl xl:text-3xl font-bold text-gray-600">
                Oops! Something went wrong.
            </h2>

            <p class="text-xl xl:text-2xl">
                We couldn't load the Pokémon right now.
                Please try again in a moment.
            </p>

        </div>
    `);
}

// Call loadPokemon() when the JavaScript file loads
loadPokemon();
