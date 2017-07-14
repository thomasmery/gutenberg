/**
 * External dependencies
 */
import { isEmpty, reduce, isObject } from 'lodash';
import { html as beautifyHtml } from 'js-beautify';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component, createElement, renderToString, cloneElement, Children } from 'element';

/**
 * Internal dependencies
 */
import { getBlockType } from './registration';
import { getNormalizedAttributeSource } from './parser';

/**
 * Returns the block's default classname from its name
 *
 * @param {String}   blockName  The block name
 * @return {string}             The block's default class
 */
export function getBlockDefaultClassname( blockName ) {
	// Drop common prefixes: 'core/' or 'core-' (in 'core-embed/')
	return 'wp-block-' + blockName.replace( /\//, '-' ).replace( /^core-/, '' );
}

/**
 * Given a block type containg a save render implementation and attributes, returns the
 * static markup to be saved.
 *
 * @param  {Object}               blockType  Block type
 * @param  {Object}               attributes Block attributes
 * @return {string}                          Save content
 */
export function getSaveContent( blockType, attributes ) {
	const { save, className = getBlockDefaultClassname( blockType.name ) } = blockType;
	let rawContent;

	if ( save.prototype instanceof Component ) {
		rawContent = createElement( save, { attributes } );
	} else {
		rawContent = save( { attributes } );

		// Special-case function render implementation to allow raw HTML return
		if ( 'string' === typeof rawContent ) {
			return rawContent;
		}
	}

	// Adding a generic classname
	const addClassnameToElement = ( element ) => {
		if ( ! element || ! isObject( element ) || ! className ) {
			return element;
		}

		const updatedClassName = classnames(
			className,
			element.props.className,
			attributes.className
		);

		return cloneElement( element, { className: updatedClassName } );
	};
	const contentWithClassname = Children.map( rawContent, addClassnameToElement );

	// Otherwise, infer as element
	return renderToString( contentWithClassname );
}

/**
 * Returns attributes which are to be saved and serialized into the block
 * comment delimiter.
 *
 * When a block exists in memory it contains as its attributes both those
 * parsed the block comment delimiter _and_ those which matched from the
 * contents of the block.
 *
 * This function returns only those attributes which are needed to persist and
 * which cannot be matched from the block content.
 *
 * @param   {Object<String,*>} allAttributes Attributes from in-memory block data
 * @param   {Object<String,*>} sources       Block type attributes definition
 * @returns {Object<String,*>}               Subset of attributes for comment serialization
 */
export function getCommentAttributes( allAttributes, sources ) {
	return reduce( sources, ( result, source, key ) => {
		const value = allAttributes[ key ];

		// Ignore undefined values
		if ( undefined === value ) {
			return result;
		}

		// Ignore values sources from content
		source = getNormalizedAttributeSource( source );
		if ( source.matcher ) {
			return result;
		}

		// Otherwise, include in comment set
		result[ key ] = value;
		return result;
	}, {} );
}

export function serializeAttributes( attrs ) {
	return JSON.stringify( attrs )
		.replace( /--/g, '\\u002d\\u002d' ) // don't break HTML comments
		.replace( /</g, '\\u003c' ) // don't break standard-non-compliant tools
		.replace( />/g, '\\u003e' ) // ibid
		.replace( /&/g, '\\u0026' ); // ibid
}

export function serializeBlock( block ) {
	const blockName = block.name;
	const blockType = getBlockType( blockName );
	const saveContent = getSaveContent( blockType, block.attributes );
	const saveAttributes = getCommentAttributes( block.attributes, blockType.attributes );

	if ( 'wp:core/more' === blockName ) {
		return `<!-- more ${ saveAttributes.customText ? `${ saveAttributes.customText } ` : '' }-->${ saveAttributes.noTeaser ? '\n<!--noteaser-->' : '' }`;
	}

	const serializedAttributes = ! isEmpty( saveAttributes )
		? serializeAttributes( saveAttributes ) + ' '
		: '';

	if ( ! saveContent ) {
		return `<!-- wp:${ blockName } ${ serializedAttributes }/-->`;
	}

	return (
		`<!-- wp:${ blockName } ${ serializedAttributes }-->\n` +

		/** make more readable - @see https://github.com/WordPress/gutenberg/pull/663 */
		beautifyHtml( saveContent, {
			indent_inner_html: true,
			wrap_line_length: 0,
		} ) +

		`\n<!-- /wp:${ blockName } -->`
	);
}

/**
 * Takes a block list and returns the serialized post content.
 *
 * @param  {Array}  blocks Block list
 * @return {String}        The post content
 */
export default function serialize( blocks ) {
	return blocks.map( serializeBlock ).join( '\n\n' );
}
