/**
 * External dependencies
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { addStory } from 'glutenberg';

/**
 * Internal dependencies
 */
import Button from '../';
import readme from '../README.md';

addStory( {
	name: 'button',
	title: 'Button',
	Component() {
		return (
			<div className="wp-core-ui">
				<ReactMarkdown source={ readme } />
				<Button isPrimary>
					{ 'Awesome Button' }
				</Button>
			</div>
		);
	},
} );
