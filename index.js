window.onscroll = function()
{
    scrollFunction()
};

function scrollFunction()
{
    let mybutton = document.getElementById( "toTop" );
    let headerDivider = document.getElementById( "headerDivider" );

    if( document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 )
    {
        mybutton.style.display = "block";
        headerDivider.classList.add( 'show' );
    }
    else
    {
        mybutton.style.display = "none";
        headerDivider.classList.remove( 'show' );
    }
}

function topFunction()
{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


function getUnsplashImages( query = 'nature' )
{
    // const accessKey = 'PU3ADRlZJxd7BfdhEgCARvTf-riIwpNtdfOxUQhzEkg';
    const ACCESS_KEY = 'PU3ADRlZJxd7BfdhEgCARvTf-riIwpNtdfOxUQhzEkg';
    const BASE_URL = 'https://api.unsplash.com';
    const searchEndpoint = '/search/photos';
    const params = new URLSearchParams( { query } );
    const headers = {
        'Authorization': `Client-ID ${ ACCESS_KEY }`
    };

    const url = new URL( BASE_URL + searchEndpoint );
    url.search = params;

    fetch( url, { headers } )
        .then( response =>
        {
            if( !response.ok )
            {
                throw new Error( `HTTP error! status: ${ response.status }` );
            }
            return response.json();
        } )
        .then( data =>
        {
            console.log( 'Success:', data );
            createTestimonialSlides( data );
        } )
        .catch( error =>
        {
            console.error( 'Error:', error.message );
        } );
}

function handleIntersectionAt200px( entries, observer )
{
    entries.forEach( entry =>
    {
        if( entry.isIntersecting && entry.intersectionRatio > 0.2 )
        {
            getUnsplashImages( 'portrait' );

            observer.disconnect();
        }
    } );
}

const observeTestimonials = new IntersectionObserver( handleIntersectionAt200px, { threshold: 0.5 } );
const testimonials = document.getElementById( 'testimonials' );
observeTestimonials.observe( testimonials );

function createTestimonialSlides( data )
{
    const testimonials = document.getElementById( 'testimonials-track' );
    const currentViewport = getCurrentViewportForTestimonials();

    data.results.forEach( ( image, index ) =>
    {
        const testimonialItem = document.createElement( 'div' );
        testimonialItem.classList.add( 'section-testimonials__item' );
        testimonialItem.id = `testimonial-${ index }`;
        testimonialItem.onclick = () => navigateToTestimonial( index );

        if( index === 0 )
        {
            testimonialItem.classList.add( 'section-testimonials__item--active' );
        }
        else
        {
            testimonialItem.classList.add( 'section-testimonials__item--inactive' );
        }

        const testimonialContent = document.createElement( 'div' );
        testimonialContent.classList.add( 'section-testimonials__item__content' );

        const imageContainer = document.createElement( 'div' );
        imageContainer.classList.add( 'section-testimonials__item__image' );

        const img = document.createElement( 'img' );
        img.src = image.urls[currentViewport];
        img.alt = image.alt_description;

        imageContainer.appendChild( img );

        const imageOverlay = document.createElement( 'div' );
        imageOverlay.classList.add( 'section-testimonials__item__image-overlay' );
        imageOverlay.innerHTML = image.user.first_name + ' ' + image.user.last_name;
        imageContainer.appendChild( imageOverlay );

        const textContainer = document.createElement( 'div' );
        textContainer.classList.add( 'section-testimonials__item__text' );

        const text = document.createElement( 'p' );
        text.textContent = '“Alpha Monkey is a great company to work with. They are very professional and responsive. They are very knowledgeable in their field and are always willing to help. I would highly recommend them to anyone looking for a great company to work with.”';

        textContainer.appendChild( text );

        const authorContainer = document.createElement( 'div' );
        authorContainer.classList.add( 'section-testimonials__item__author' );

        const authorName = document.createElement( 'p' );
        authorName.textContent = image.user.first_name + ' ' + image.user.last_name;

        const authorPosition = document.createElement( 'p' );
        authorPosition.textContent = image.user.location;

        authorContainer.appendChild( authorName );
        authorContainer.appendChild( authorPosition );

        testimonialItem.appendChild( imageContainer );
        testimonialContent.appendChild( textContainer );
        testimonialContent.appendChild( authorContainer );
        testimonialItem.appendChild( testimonialContent );

        testimonials.appendChild( testimonialItem );

        testimonials.style.transition = 'all .9s ease-out';
        testimonials.style.left = 0;
    } );

    let time = 0;
    const testimonialItems = document.querySelectorAll( '.section-testimonials__item' );
    testimonialItems.forEach( testimonial =>
    {
        setTimeout( () =>
        {
            testimonial.classList.add( 'active' );
        }, time );
        time += 200;
    } )
}

function getCurrentViewportForTestimonials()
{
    const breakpoints = { 'phone': '600', 'tab-port': '900', 'tab-land': '1200', 'big-desktop': '1800' };
    const imageSizes = { 'phone': 'thumb', 'tab-port': 'small', 'tab-land': 'small', 'big-desktop': 'small' };

    let breakpoint = breakpoints['big-desktop'];
    const currentWidth = window.innerWidth;
    for( const bp in breakpoints )
    {
        if( currentWidth <= breakpoints[bp] )
        {
            breakpoint = bp;
            break;
        }
        else
        {
            breakpoint = 'big-desktop';
        }
    }

    return imageSizes[breakpoint];
}

let scrollAmount = 0;

function testimonialNavigation( direction, navigation )
{
    let testimonialIndex = 0;

    navigation.style.pointerEvents = 'none';

    const directionToMove = direction === 'next' ? 1 : -1;
    const testimonialTrack = document.getElementById( 'testimonials-track' );
    const activeTestimonial = document.querySelector( '.section-testimonials__item--active' );
    if( activeTestimonial )
    {
        activeTestimonial.classList.remove( 'section-testimonials__item--active' );
        testimonialIndex = parseInt( activeTestimonial.id.split( '-' )[1] );

        let nextTestimonial = testimonialTrack.querySelector( `#testimonial-${ testimonialIndex + directionToMove }` );
        if( nextTestimonial )
        {
            if( directionToMove === 1 )
            {
                scrollAmount += nextTestimonial.offsetWidth + 30;
            }
            else
            {
                scrollAmount -= nextTestimonial.offsetWidth + 30;
            }

            setTimeout( () =>
            {
                nextTestimonial.classList.add( 'section-testimonials__item--active' );
                navigation.style.pointerEvents = 'auto';
            }, 1300 );
            testimonialTrack.style.left = -scrollAmount + 'px';

        }
        else
        {
            resetTestimonials( directionToMove, navigation );
        }
    }
    else
    {
        if( directionToMove === 1 )
        {
            setTimeout( () =>
            {
                testimonialTrack.querySelector( '#testimonial-0' ).classList.add( 'section-testimonials__item--active' );
                scrollAmount = 0;
                navigation.style.pointerEvents = 'auto';
            }, 1300 );

        }
        else
        {
            testimonialTrack.querySelector( `#testimonial-${ testimonialTrack.children.length - 1 }` ).classList.add( 'section-testimonials__item--active' );
            navigation.style.pointerEvents = 'auto';
        }
    }

}

function resetTestimonials( direction, navigation )
{
    const testimonialTrack = document.getElementById( 'testimonials-track' );
    const lastTestimonial = testimonialTrack.querySelector( `#testimonial-${ testimonialTrack.children.length - 1 }` );
    const firstTestimonial = testimonialTrack.querySelector( '#testimonial-0' );
    if( direction === 1 )
    {
        scrollAmount = 0;
        firstTestimonial.classList.add( 'section-testimonials__item--active' );
        testimonialTrack.style.left = 0;
        navigation.style.pointerEvents = 'auto';
    }
    else
    {
        scrollAmount = lastTestimonial.offsetLeft;
        lastTestimonial.classList.add( 'section-testimonials__item--active' );
        testimonialTrack.style.left = -scrollAmount + 'px';
        navigation.style.pointerEvents = 'auto';
    }
}

function navigateToTestimonial( index )
{
    const testimonialTrack = document.getElementById( 'testimonials-track' );
    const testimonial = testimonialTrack.querySelector( `#testimonial-${ index }` );
    if( testimonial )
    {
        const activeTestimonial = document.querySelector( '.section-testimonials__item--active' );
        if( activeTestimonial )
        {
            activeTestimonial.classList.remove( 'section-testimonials__item--active' );
        }
        testimonial.classList.add( 'section-testimonials__item--active' );
        scrollAmount = testimonial.offsetLeft;
        testimonialTrack.style.left = -scrollAmount + 'px';
    }
}

let fakeNewsletterServer = [];
document.getElementById( "newsletterForm" ).addEventListener( "submit", function( event )
{
    event.preventDefault();
    let email = document.getElementById( "emailInput" ).value.trim();
    const newsletterForm = document.getElementById( "newsletterForm" );
    const emailSubmit = document.getElementById( "emailSubmitNewsletter" );
    const errorMessage = document.getElementById( "errorMessageNewsletter" );
    const successMessage = document.getElementById( "successMessageNewsletter" );

    emailSubmit.style.display = "none";
    if( !email || !validateEmail( email ) )
    {
        errorMessage.innerText = "Please enter a valid email address.";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        resetOnSubmit( successMessage, errorMessage, emailSubmit );
        return;
    }

    if( fakeNewsletterServer.includes( email ) )
    {
        errorMessage.innerText = "You have already subscribed to our newsletter.";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        return;
    }

    email = sanitizeInput( email );

    createLoader( newsletterForm );
    setTimeout( function()
    {
        errorMessage.style.display = "none";
        successMessage.innerText = `Thank you for subscribing to our newsletter!`;
        successMessage.style.display = "block";
        resetOnSubmit( successMessage, errorMessage, emailSubmit );
        removeLoader( newsletterForm );
        document.getElementById( "newsletterForm" ).reset();
    }, 1000 );

    fakeNewsletterServer.push( email );
} );

const validateEmail = ( email ) =>
{
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function sanitizeInput( input )
{
    return input.replace( /</g, "&lt;" ).replace( />/g, "&gt;" );
}

function resetOnSubmit( successMessage, errorMessage, emailSubmit )
{
    emailSubmit.style.display = "block";

    setTimeout( function()
    {
        successMessage.style.display = "none";
        errorMessage.style.display = "none";
    }, 4000 );
}


function createLoader( parent )
{
    const loader = document.createElement( 'div' );
    loader.classList.add( 'loader-wrapper' );

    const loaderDiv = document.createElement( 'div' );
    loaderDiv.classList.add( 'loader' );

    loader.appendChild( loaderDiv );
    parent.appendChild( loader );
}

function removeLoader( parent )
{
    const loader = parent.querySelector( '.loader-wrapper' );
    if( loader )
    {
        loader.remove();
    }
}

document.getElementById( "contactForm" ).addEventListener( "submit", function( event )
{
    event.preventDefault();
    const contactForm = document.getElementById( "contactForm" );
    const button = document.getElementById( "contactSubmit" );
    let name = document.getElementById( "nameInput" ).value.trim();
    let email = document.getElementById( "emailInput" ).value.trim();
    let message = document.getElementById( "messageInput" ).value.trim();

    const errorMessage = document.getElementById( "errorMessage" );
    const successMessage = document.getElementById( "successMessage" );

    if( !name || !email || !message )
    {
        errorMessage.innerText = "Please fill in all fields.";
        errorMessage.style.display = "block";

        resetOnSubmit( successMessage, errorMessage, button );
        return;
    }

    if( !validateEmail( email ) )
    {
        errorMessage.innerText = "Please enter a valid email address.";
        errorMessage.style.display = "block";

        resetOnSubmit( successMessage, errorMessage, button );
        return;
    }

    name = sanitizeInput( name );
    email = sanitizeInput( email );
    message = sanitizeInput( message );

    errorMessage.style.display = "none";

    button.style.display = "none";
    createLoader( contactForm );
    setTimeout( function()
    {
        removeLoader( contactForm );
        document.getElementById( "contactForm" ).reset();
        successMessage.innerText = "Thank you for contacting us. We will get back to you as soon as possible.";
        successMessage.style.display = "block";
        button.style.display = "block";

        resetOnSubmit( successMessage, errorMessage, button );
    }, 1000 );
} );

