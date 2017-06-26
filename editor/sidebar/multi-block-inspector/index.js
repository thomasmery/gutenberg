/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { __ } from 'i18n';
import { Panel, PanelHeader, PanelBody } from 'components';
import { getBlockType } from 'blocks';

/**
 * Internal Dependencies
 */
import { getMultiSelectedBlocks } from '../../selectors';

const MultiBlockInspector = ( { selectedBlocks, onChange } ) => {
	if ( ! selectedBlocks.length ) {
		return null;
	}

	const types = selectedBlocks.reduce( ( acc, block ) => {
		if ( acc.indexOf( block.name ) === -1 ) {
			acc.push( block.name );
		}

		return acc;
	}, [] ).map( name => getBlockType( name ) );

	const header = (
		<strong>
			<a href="" className="editor-block-inspector__deselect-post">
				{ __( 'Post Settings' ) }
			</a>
			{ ' → ' }
			{ types.length === 1 ? types[ 0 ].title : __( 'Mixed' ) }
		</strong>
	);

	const components = [];

	if ( types.length === 1 ) {
		if ( types[ 0 ].multiSelectedControls ) {
			components.push( types[ 0 ].multiSelectedControls );
		}
	}

	const setAttributes = ( attributes ) => {
		selectedBlocks.forEach( ( block ) => {
			onChange( block.uid, {
				attributes: {
					...block.attributes,
					...attributes,
				},
			} );
		} );
	};

	const attributes = selectedBlocks.map( block => block.attributes );

	return (
		<Panel>
			<PanelHeader label={ header } />
			<PanelBody>
				{ components.map( ( Component, index ) => {
					return (
						<Component
							key={ index }
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>
					);
				} ) }
			</PanelBody>
		</Panel>
	);
};

export default connect(
	( state ) => {
		return {
			selectedBlocks: getMultiSelectedBlocks( state ),
		};
	},
	( dispatch ) => ( {
		onChange( uid, updates ) {
			dispatch( {
				type: 'UPDATE_BLOCK',
				uid,
				updates,
			} );
		},
	} ),
)( MultiBlockInspector );
