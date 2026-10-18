//-----------Contact.HTML----------------

const contactAlexandre = document.querySelector("#contact-alexandre");

contactAlexandre.addEventListener("click", function() {
    console.log("Alexandre sélectionné !");
});


const titre= document.querySelector("#titre-discussion");

contactAlexandre.addEventListener("click", function() {
    titre.textContent = "Alexandre";
});