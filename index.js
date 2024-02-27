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

// When the user clicks on the button, scroll to the top of the document
function topFunction()
{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


function getUnsplashImages( query = 'nature' )
{
    // const accessKey = 'PU3ADRlZJxd7BfdhEgCARvTf-riIwpNtdfOxUQhzEkg';

    // Your Unsplash API access key
    const ACCESS_KEY = 'PU3ADRlZJxd7BfdhEgCARvTf-riIwpNtdfOxUQhzEkg';

    // Base URL for the Unsplash API
    const BASE_URL = 'https://api.unsplash.com';

    // Endpoint for searching photos
    const searchEndpoint = '/search/photos';

    // Parameters for the API call
    const params = new URLSearchParams( { query } );

    // Headers including your API access key
    const headers = {
        'Authorization': `Client-ID ${ ACCESS_KEY }`
    };

    // Construct the URL
    const url = new URL( BASE_URL + searchEndpoint );
    url.search = params;

    // Make the GET request using Fetch
    fetch( url, { headers } )
        .then( response =>
        {
            // Check if response is successful
            if( !response.ok )
            {
                throw new Error( `HTTP error! status: ${ response.status }` );
            }
            // Parse the JSON response
            return response.json();
        } )
        .then( data =>
        {
            // Process the response data
            console.log( 'Success:', data );
            createTestimonialSlides( data );
        } )
        .catch( error =>
        {
            // Handle errors
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
        // Create main container div
        const testimonialItem = document.createElement( 'div' );
        testimonialItem.classList.add( 'section-testimonials__item' );
        testimonialItem.id = `testimonial-${ index }`;

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

        // Create image container div
        const imageContainer = document.createElement( 'div' );
        imageContainer.classList.add( 'section-testimonials__item__image' );

        // Create image element
        const img = document.createElement( 'img' );
        img.src = image.urls[currentViewport];
        img.alt = image.alt_description;

        // Append image to image container
        imageContainer.appendChild( img );

        const imageOverlay = document.createElement( 'div' );
        imageOverlay.classList.add( 'section-testimonials__item__image-overlay' );
        imageOverlay.innerHTML = image.user.first_name + ' ' + image.user.last_name;
        imageContainer.appendChild( imageOverlay );

        // Create text container div
        const textContainer = document.createElement( 'div' );
        textContainer.classList.add( 'section-testimonials__item__text' );

        // Create and set text
        const text = document.createElement( 'p' );
        text.textContent = '“Alpha Monkey is a great company to work with. They are very professional and responsive. They are very knowledgeable in their field and are always willing to help. I would highly recommend them to anyone looking for a great company to work with.”';

        // Append text to text container
        textContainer.appendChild( text );

        // Create author container div
        const authorContainer = document.createElement( 'div' );
        authorContainer.classList.add( 'section-testimonials__item__author' );

        // Create author name paragraph
        const authorName = document.createElement( 'p' );
        authorName.textContent = image.user.first_name + ' ' + image.user.last_name;

        // Create author position paragraph
        const authorPosition = document.createElement( 'p' );
        authorPosition.textContent = image.user.location;

        // Append author name and position to author container
        authorContainer.appendChild( authorName );
        authorContainer.appendChild( authorPosition );

        // Append image container, text container, and author container to testimonial item
        testimonialItem.appendChild( imageContainer );
        testimonialContent.appendChild( textContainer );
        testimonialContent.appendChild( authorContainer );
        testimonialItem.appendChild( testimonialContent );

        // Append testimonial item to parent container (assuming testimonials is the parent container)
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
    // Define the breakpoints for the different viewport 'sizes'
    const breakpoints = { 'phone': '600', 'tab-port': '900', 'tab-land': '1200', 'big-desktop': '1800' };
    const imageSizes = { 'phone': 'thumb', 'tab-port': 'small', 'tab-land': 'small', 'big-desktop': 'small' };

    let breakpoint = breakpoints['big-desktop'];
    // Get the current viewport width
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
