/**
 * External dependencies
 */
import { parse } from 'hpq';

/**
 * WordPress dependencies
 */
import { renderToString } from 'element';

/**
 * Internal dependencies
 */
import * as matchers from '../matchers';

describe( 'matchers', () => {
	it( 'should generate matchers which apply internal flag', () => {
		for ( const matcherFn in matchers ) {
			expect( matchers[ matcherFn ]()._wpBlocksKnownMatcher ).toBe( true );
		}
	} );

	describe( 'children()', () => {
		it( 'should return a matcher function', () => {
			const matcher = matchers.children();

			expect( typeof matcher ).toBe( 'function' );
		} );

		it( 'should return HTML equivalent WPElement of matched element', () => {
			// Assumption here is that we can cleanly convert back and forth
			// between a string and WPElement representation
			const html = '<blockquote><p>A delicious sundae dessert</p></blockquote>';
			const match = parse( html, matchers.children() );

			expect( renderToString( match ) ).toBe( html );
		} );
	} );

	describe( 'node()', () => {
		it( 'should return a matcher function', () => {
			const matcher = matchers.node();

			expect( typeof matcher ).toBe( 'function' );
		} );

		it( 'should return HTML equivalent WPElement of matched element', () => {
			// Assumption here is that we can cleanly convert back and forth
			// between a string and WPElement representation
			const html = '<blockquote><p>A delicious sundae dessert</p></blockquote>';
			const match = parse( html, matchers.node() );

			expect( wp.element.renderToString( match ) ).toBe( `<body>${ html }</body>` );
		} );
	} );
} );
