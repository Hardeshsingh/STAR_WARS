
document.addEventListener("DOMContentLoaded", function() {
    const planetsContainer = document.getElementById("planets");
    const paginationContainer = document.getElementById("pagination");
    let nextPage = 'https://swapi.dev/api/planets/';

    function fetchData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                nextPage = data.next;
                displayPlanets(data.results);
                displayPagination();
            })
            .catch(error => console.log(error));
    }

    function displayPlanets(planets) {
        planetsContainer.innerHTML = '';
        const residentPromises = planets.map(planet => {
            const residents = planet.residents.length > 0 ? planet.residents.slice(0, 2) : [];
            const residentDetails = residents.map(residentURL => fetchResidentData(residentURL));
            return Promise.all(residentDetails)
                .then(residentsData => {
                    const residentList = residentsData.map(resident => {
                        return `
                            <li class="resident-item">
                                <strong>Name:</strong> ${resident.name}, 
                                <strong>Height:</strong> ${resident.height}, 
                                <strong>Mass:</strong> ${resident.mass}, 
                                <strong>Gender:</strong> ${resident.gender}
                            </li>
                        `;
                    }).join('');
                    
                    const planetCard = `
                        <div class="planet-card">
                            <h2>${planet.name}</h2>
                            <div class="planet-info">
                                <p><strong>Climate:</strong> ${planet.climate}</p>
                                <p><strong>Population:</strong> ${planet.population}</p>
                                <p><strong>Terrain:</strong> ${planet.terrain}</p>
                                <p><strong>Residents:</strong></p>
                                <ul class="resident-list">${residentList}</ul>
                            </div>
                        </div>
                    `;
                    planetsContainer.innerHTML += planetCard;
                });
        });
    
        Promise.all(residentPromises)
            .then(() => displayPagination());
    }
    
    function fetchResidentData(residentURL) {
        return fetch(residentURL)
            .then(response => response.json());
    }

    function displayPagination() {
        paginationContainer.innerHTML = '';
        if (nextPage !== null) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => fetchData(nextPage));
            paginationContainer.appendChild(nextButton);
        }
    }

    fetchData(nextPage);
});
