window.onscroll = function() { scrollFunction() };
function scrollFunction() {
    let mybutton = document.getElementById("toTop");
    let headerDivider = document.getElementById("headerDivider");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
        headerDivider.classList.add( 'show' );
    } else {
        mybutton.style.display = "none";
        headerDivider.classList.remove( 'show' );
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

VanillaTilt.init(document.querySelector(".box"), {
    max: 20,
    speed: 400,
    glare: true,
    transition: true,
    reverse: true,

});
