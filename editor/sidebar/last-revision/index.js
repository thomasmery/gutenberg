/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { flowRight, last } from 'lodash';

/**
 * WordPress dependencies
 */
import { sprintf, _n } from 'i18n';
import { IconButton, PanelBody, withApiData } from 'components';

/**
 * Internal dependencies
 */
import './style.scss';
import { getCurrentPostId, getCurrentPostType, isSavingPost } from '../../selectors';
import { getWPAdminURL } from '../../utils/url';

function LastRevision( { revisions } ) {
	const lastRevision = last( revisions.value );
	if ( ! lastRevision ) {
		return null;
	}

	return (
		<PanelBody>
			<IconButton
				href={ getWPAdminURL( 'revision.php', { revision: lastRevision.id } ) }
				className="editor-last-revision__title"
				icon="backup"
			>
				{
					sprintf(
						_n( '%d Revision', '%d Revisions', revisions.value.length ),
						revisions.value.length
					)
				}
			</IconButton>
		</PanelBody>
	);
}

export default flowRight(
	connect(
		( state ) => {
			return {
				postId: getCurrentPostId( state ),
				postType: getCurrentPostType( state ),
				isSaving: isSavingPost( state ),
			};
		}
	),
	withApiData( ( props, endpoint ) => ( {
		revisions: endpoint`/wp/v2/posts/${ props.postId }/revisions`,
	} ) )
)( LastRevision );
