'use strict';

/**
 * Insert a light background behind content images so that transparent
 * images stay readable when the page is inverted by dark mode.
 */
( () => {
	const WRAP_CLASS = 'darkmode-image-wrap';
	const BACKGROUND_CLASS = 'darkmode-image-background';
	const CONTAINER_SELECTOR = [
		'span[ typeof~="mw:File" ]',
		'span[ typeof~="mw:File/Thumb" ]',
		'span[ typeof~="mw:File/Frame" ]',
		'span[ typeof~="mw:File/Frameless" ]',
		'figure[ typeof~="mw:File" ]',
		'figure[ typeof~="mw:File/Thumb" ]',
		'figure[ typeof~="mw:File/Frame" ]',
		'figure[ typeof~="mw:File/Frameless" ]',
		'.mw-halign-left',
		'.mw-halign-right',
		'.mw-halign-center'
	].join( ', ' );

	const containers = document.querySelectorAll( CONTAINER_SELECTOR );
	if ( !containers.length ) {
		return;
	}

	const pairs = [];
	const processed = new Set();

	/**
	 * @param {HTMLImageElement} image
	 * @param {HTMLElement} background
	 */
	function syncSize( image, background ) {
		background.style.width = image.width + 'px';
		background.style.height = image.height + 'px';
	}

	for ( const container of containers ) {
		for ( const image of container.querySelectorAll( 'img:not( .mw-invert )' ) ) {
			if ( processed.has( image ) ) {
				continue;
			}
			processed.add( image );
			image.parentElement.classList.add( WRAP_CLASS );
			const background = document.createElement( 'div' );
			background.className = BACKGROUND_CLASS;
			image.before( background );
			syncSize( image, background );
			pairs.push( { image, background } );
		}
	}

	if ( !pairs.length ) {
		return;
	}

	window.addEventListener( 'resize', () => {
		for ( const pair of pairs ) {
			syncSize( pair.image, pair.background );
		}
	} );
} )();
