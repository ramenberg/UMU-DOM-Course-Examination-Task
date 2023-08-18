// Har för VG implementerat Live-sök och betygssystem.

'use strict';
$(document).ready(generateMenu);

function generateMenu() {

    // Initiala variabler

    // Primary content
    const numberOfRecipes = document.querySelectorAll("#primarycontent div.post").length; // Antalet recept. För att kunna skapa upp rätt antal länkar i receptmenyn mm.
    const allRecipeHeadings = document.querySelectorAll("#primarycontent div.post h4"); // Alla receptrubriker. Inför skapande av länktext.

    // Secondary content
    const secondaryContentArea = document.querySelector("#secondarycontent div.contentarea");
    //

    // Skapar upp ul för receptmenyn i secondarycontent.
    const recipeListUl = document.createElement("ul");
    recipeListUl.setAttribute("id", "recipe-list");
    secondaryContentArea.appendChild(recipeListUl);

    // Skapar upp receptmenylänkar för alla recept samt lägger till sökfunktionen(VG) och betygsfunktion (VG).
    createRecipeMenuList(numberOfRecipes);
    createSearchFieldForm();
    createRatingSystem();

    ////////////////////////////////////////END////////////////////////////////////////////

    // Funktioner för länklistan (G-uppgift)

    ///////////////////////////////////////START////////////////////////////////////////////

    // Lägger till id för varje receptrubrik och anropar en funktion som skapar upp listan över recepten och dess länkartext utifrån receptets rubrik.
    function createRecipeMenuList(numberOfRecipes) {
        // Lägg till id för varje receptrubrik.
        for (let i = 0; i < numberOfRecipes; i++) {
            allRecipeHeadings[i].setAttribute("id", "recipe-" + i);
        }
        const recipeList = document.getElementById("recipe-list");

        for (let i = 0; i < numberOfRecipes; i++) {
            createRecipeLinks(recipeList, i);
        }
    }

    // Skapar Li-element för recepten. Tar in en lista över recept och receptets index som argument.
    function createRecipeLinks(recipeList, index) {
        if (recipeList.length === 0) {
            noRecipeFound();
        } else if (allRecipeHeadings[index]) {
            const recipeListLi = document.createElement("li");

            const recipeListLink = document.createElement("a");
            recipeListLink.setAttribute("href", "#recipe-" + index);
            recipeListLink.textContent = allRecipeHeadings[index].textContent.trim();
            recipeListLi.appendChild(recipeListLink);
            recipeList.appendChild(recipeListLi);
        }
    }

    ////////////////////////////////////////END////////////////////////////////////////////

    // Live-search-funktion (VG-uppgift).

    // Denna sökfunktion söker i den för G-uppgiften redan skapade listan över receptlänkar. Listan förändras allteftersom man skriver in bokstäver då den vid varje key-up kontrollerar om det finns några recept som matchar sökordet. Om sökfältet är tomt visas alla recept och om inga recept hittas så skrivs ett meddelande om detta ut.

    ///////////////////////////////////////START////////////////////////////////////////////

    // Skapar upp div för sökfunktionen och lägger till i secondarycontent ovanför länklistan.
    function createSearchFieldForm() {
        // Sökform.
        const searchForm = document.createElement("form");

        // Sökfält
        const searchContentDiv = document.createElement("div");
        searchContentDiv.setAttribute("id", "searchcontent");
        searchContentDiv.setAttribute("class", "form-group");
        const searchField = document.createElement("input");
        searchField.setAttribute("type", "text");
        searchField.setAttribute("id", "searchWord");
        searchField.setAttribute("placeholder", "Börja skriva för att söka efter recept...");
        searchField.setAttribute("class", "w-100");
        searchContentDiv.appendChild(searchField);

        // Lägg till i form och secondarycontent
        searchForm.appendChild(searchContentDiv);
        secondaryContentArea.insertBefore(searchForm, secondaryContentArea.firstChild); // Lägger till sökfältet före länkarna.
    }

    // Funktion som anropas om inga recept/länkar matchade det inskrivna sökordet.
    function noRecipeFound() {
        const createNoResultMessage = document.createElement("li");
        createNoResultMessage.textContent = "Inga recept hittades.";
        recipeListUl.appendChild(createNoResultMessage); // Lägger till nya Li-elementet i ul-listan.
    }

    // Eventlistener för keyup i sökfältet.
    const searchWordDiv = document.getElementById("searchWord");
    searchWordDiv.addEventListener("keyup", function () {

        document.querySelector("#recipe-list").innerHTML = "";
        let listOfRecipes = document.getElementById("recipe-list");
        let searchWord = document.querySelector("#searchWord").value;
        let searchWordHasMatches = false;

        if (searchWord.trim().length > 0) {

            for (let i = 0; i < numberOfRecipes; i++) {
                if (allRecipeHeadings[i].textContent.toLowerCase().includes(searchWord.toLowerCase())) {
                    let recipeId = allRecipeHeadings[i].getAttribute("id").split("-")[1];
                    createRecipeLinks(listOfRecipes, recipeId);
                    searchWordHasMatches = true;
                }
            }
            if (!searchWordHasMatches) {
                // Inga träffar.
                noRecipeFound();
            }
        }
        else {
            // Tomt sökfält/tom sökning: skriver ut alla receptlänkar.
            createRecipeMenuList(numberOfRecipes);
        }
    });

    ////////////////////////////////////////END////////////////////////////////////////////

    // Betygssystem VG-uppgift.

    ///////////////////////////////////////START////////////////////////////////////////////

    // Varje recepts H4-rubrik placeras i en ny div på samma plats för att sedan kunna lägga till betygssystemet till höger om rubriken. Funktionen anropas vid initial laddning av sidan.
    // Eftersom förändringen av rubrikens h4 element hör till betygsfunktionen så har jag lagt den manipulationen inuti funktionen där jag skapar upp hela betygsystemet. Hade detta inte specifikt varit en VG-uppgift så hade jag flyttat ut den utanför betygfunktionen.
    // Det finns ingen funktion för att helt ta bort ett satt betyg men det går att ändra mellan 1-5.

    function createRatingSystem() {

        // För varje recept:
        for (let i = 0; i < numberOfRecipes; i++) {
            // Ny div för rubrik och betyg.
            const recipeHeadingDiv = document.createElement("div");
            recipeHeadingDiv.setAttribute("id", "heading-recipe-" + i);
            recipeHeadingDiv.setAttribute("class", "d-flex flex-row align-items-center justify-content-between");

            allRecipeHeadings[i].parentNode.insertBefore(recipeHeadingDiv, allRecipeHeadings[i]);
            recipeHeadingDiv.appendChild(allRecipeHeadings[i]);

            // Skapar upp betygsstjärnorna och lägger till på höger sida i nya rubrikdiv:en.
            const ratingDiv = createRatingDiv(i);
            allRecipeHeadings[i].parentElement.appendChild(ratingDiv);
        }

        // Div för betygssystem.
        function createRatingDiv(recipeIndex) {

            // Div för stjärnorna.
            const ratingDiv = document.createElement("div");
            ratingDiv.setAttribute("id", "rating");
            ratingDiv.setAttribute("class", "d-flex flex-column align-items-center");

            // Anropar funktion som hämtar betyg från local storage.
            let selectedStar = getRating(recipeIndex);

            // Betygsstjärnor
            const starDiv = document.createElement("div");
            starDiv.setAttribute("class", "rating-stars mb-2");
            starDiv.setAttribute("id", "rating-recipe-" + recipeIndex);
            starDiv.setAttribute("data-recipe-index", recipeIndex);

            // Skapar upp fem stjärnor och lägger till i starDiv.
            for (let i = 0; i < 5; i++) {

                let starColorUnchecked = "#c0c0c0"; // Oklickad eller ej betygsatt
                let starColorChecked = "#f1c40f"; // Betygsatt
                let starColorClicked = "#f79902"; // Precis klickad på

                // Skapar upp en stjärna och kopplar ett data-value inför sparande till local storage.
                const star = document.createElement("i");
                star.setAttribute("class", "star");
                star.setAttribute("data-value", i + 1); // +1 då betyget börjar på 1 och inte 0.
                star.setAttribute("style", "font-size: 2rem; color: " + starColorUnchecked + "; cursor: pointer; font-style: normal;");
                star.textContent = "★";
                starDiv.appendChild(star);


                // Utseende för stjärnorna:
                // Gör att recept som har betyg får rätt färg på stjärnorna när sidan laddas.
                if (selectedStar !== null && i < selectedStar) {
                    star.style.color = starColorChecked;
                }

                // Klickfunktion för stjärnorna.
                star.addEventListener("click", function () {
                    selectedStar = i + 1;
                    for (let j = 0; j < 5; j++) {
                        if (j < selectedStar) {
                            starDiv.children[j].style.color = starColorChecked;

                            // Visuell bekräftelse på att man har klickat på en stjärna och lämnat ett betyg. Sjärnorna blir orange i 0,5 sekunder.
                            starDiv.children[j].style.color = starColorClicked;
                            setTimeout(function () {
                                starDiv.children[j].style.color = starColorChecked;
                            }, 500);

                            // Sparar betyget i local storage.
                            localStorage.setItem("rating-recipe-" + recipeIndex, selectedStar);
                        }
                    }
                    // Resten av stjärnorna, exempelvis de två sista om betyget är 3/5, blir gråa.
                    for (let j = 0; j < 5; j++) {
                        if (j >= selectedStar) {
                            starDiv.children[j].style.color = starColorUnchecked;
                        }
                    }
                });

                // Hover-effekt. Fungerar både på betygsatta och icke-betygsatta recept.
                star.addEventListener("mouseover", function () {
                    for (let j = 0; j < 5; j++) {
                        starDiv.children[j].style.color = starColorUnchecked;
                        if (j <= i) {
                            starDiv.children[j].style.color = starColorChecked;
                        }
                    }
                });
                star.addEventListener("mouseout", function () {
                    for (let j = 0; j < 5; j++) {
                        if (j >= selectedStar) {
                            starDiv.children[j].style.color = starColorUnchecked;
                        }
                    }
                });
            }
            ratingDiv.appendChild(starDiv);
            return ratingDiv;
        }

        // Funktion för att hämta betyg från local storage. Om det finns ett betyg för receptet så returneras det, annars returneras null. Anropas i createRatingDiv.
        function getRating(recipeIndex) {
            let rating = localStorage.getItem("rating-recipe-" + recipeIndex);
            if (rating) {
                return rating;
            } else {
                return null;
            }
        }
    }

    ////////////////////////////////////////END////////////////////////////////////////////
}