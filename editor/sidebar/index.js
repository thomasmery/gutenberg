/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress Dependencies
 */
import { withFocusReturn } from 'components';

/**
 * Internal Dependencies
 */
import './style.scss';
import PostSettings from './post-settings';
import BlockInspector from './block-inspector';
import MultiBlockInspector from './multi-block-inspector';
import { getSelectedBlockCount } from '../selectors';

const Sidebar = ( { selectedBlockCount } ) => {
	return (
		<div className="editor-sidebar">
			{ selectedBlockCount === 0 && <PostSettings /> }
			{ selectedBlockCount === 1 && <BlockInspector /> }
			{ selectedBlockCount > 1 && <MultiBlockInspector /> }
		</div>
	);
};

export default connect(
	( state ) => {
		return {
			selectedBlockCount: getSelectedBlockCount( state ),
		};
	}
)( withFocusReturn( Sidebar ) );
