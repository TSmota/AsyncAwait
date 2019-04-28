($ => {
    function to(promise) {
        return promise.then(data => {
                return [null, data];
            })
            .catch(err => [err]);
    }

    $(document).ready(() => {
        const proxyurl = "https://cors.io/?";
        let nameSearch = false;
        let titleInterval;
        $('#search').bind('keyup', function (e) {
            if (e.originalEvent.keycode == 13 || e.originalEvent.which == 13) {
                let hero = $(this).val().trim().split(' ').join('-');
                if (hero.length > 1) {
                    $(this).css('background-color', 'white');
                    $('.error-message').hide();
                    let url = "https://superheroapi.com/api/2382172168513551/";

                    if (isNaN(parseInt(hero))) {
                        url += "search/";
                        nameSearch = true;
                    } else nameSearch = false;
                    let title = $('#loading-modal .modal-title');
                    $('#loading-modal').modal('show');
                    let dots = "";
                    titleInterval = setInterval(() => {
                        title.text('Loading' + dots);
                        dots.length != 3 ? dots += '.' : dots = '';
                    }, 750)
                    buildHero(proxyurl + url + hero);
                } else {
                    $(this).css('background-color', '#fee');
                    $('.error-message').show();
                }
            }
        });

        async function getHero(url) {
            let deferred = $.Deferred();

            let [err, response] = await to(fetch(url));
            if (err) deferred.reject(err)

            let [error, json] = await to(response.json());
            if (error) deferred.reject(error);

            if (json.response == "success") deferred.resolve(json);
            else deferred.reject(json.error);

            return deferred.promise();
        }

        async function buildHero(url) {
            let [err, response] = await to(getHero(url));
            if (err) {
                $('#loading-modal').modal('hide');
                $('#error-modal').modal('show');
                $('#error-modal .container-fluid').text(err);
                return;
            }
            let heroes = [];
            if (nameSearch) heroes = response.results;
            else heroes.push(response);
            let container = $('#heroes-container');
            for (let hero of heroes) {
                let classifyStat = (num) => {
                    return num > 75 ? "success" : num > 50 ? "info" : num > 25 ? "warning" : "danger";
                }
                let card = `
                <div class="hero-card">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="hero-name">${hero.name}</div>
                            <div class="hero-image" style="background: url(${hero.image.url}); background-size: cover"></div>
                        </div>
                        <div class="card-back">
                            <div class="hero-stats">
                                <div class="hero-full-name info">
                                    ${hero.biography["full-name"]}
                                </div>
                                <div class="hero-alignment info">
                                    ${(hero.biography.alignment == "good") ? "Hero" : "Villain"}
                                </div>
                                <div class="hero-gender info">
                                    Sexo: ${hero.appearance.gender}
                                </div>
                                <div class="hero-race info">
                                    Raça: ${hero.appearance.race}
                                </div>
                                <div class="hero-int stat">
                                    Intelligence: 
                                    <span class="progress">
                                        <span class="progress-bar bg-${classifyStat(hero.powerstats.intelligence)}" style="width: ${hero.powerstats.intelligence}%" role="progress-bar" aria-valuemin="0" aria-valuemax="100"></span>
                                    </span>
                                </div>
                                <div class="hero-str stat">
                                    Strength: 
                                    <span class="progress">
                                        <span class="progress-bar bg-${classifyStat(hero.powerstats.strength)}" style="width: ${hero.powerstats.strength}%" role="progress-bar" aria-valuemin="0" aria-valuemax="100"></span>
                                    </span>
                                </div>
                                <div class="hero-speed stat">
                                    Speed: 
                                    <span class="progress">
                                        <span class="progress-bar bg-${classifyStat(hero.powerstats.speed)}" style="width: ${hero.powerstats.speed}%" role="progress-bar" aria-valuemin="0" aria-valuemax="100"></span>
                                    </span>
                                </div>
                                <div class="hero-dur stat">
                                    Durability:
                                    <span class="progress">
                                        <span class="progress-bar bg-${classifyStat(hero.powerstats.durability)}" style="width: ${hero.powerstats.durability}%" role="progress-bar" aria-valuemin="0" aria-valuemax="100"></span>
                                    </span>
                                </div>
                                <div class="hero-power stat">
                                    Power: 
                                    <span class="progress">
                                        <span class="progress-bar bg-${classifyStat(hero.powerstats.power)}" style="width: ${hero.powerstats.power}%" role="progress-bar" aria-valuemin="0" aria-valuemax="100"></span>
                                    </span>
                                </div>
                                <div class="hero-combat stat">
                                    Combat: 
                                    <span class="progress">
                                        <span class="progress-bar br-${classifyStat(hero.powerstats.combat)}" style="width: ${hero.powerstats.combat}%" role="progress-bar" aria-valuemin="0" aria-valuemax="100"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                container.append(card);
                $('#loading-modal').modal('hide');
                clearInterval(titleInterval);
            }
        }
    });
})
(jQuery)