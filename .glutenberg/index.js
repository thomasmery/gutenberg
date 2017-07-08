import { addStory } from 'glutenberg';

import intro from '../docs/readme.md';
import faq from '../docs/faq.md';
import step1 from '../docs/blocks-basic.md';
import step2 from '../docs/blocks-stylesheet.md';
import step3 from '../docs/blocks-editable.md';
import '../components/button/story';

addStory( {
	name: 'intro',
	title: 'Introduction',
	path: '/',
	markdown: intro,
} );

addStory( {
	name: 'faq',
	title: 'FAQ',
	markdown: faq,
} );

addStory( {
	name: 'blocks',
	title: 'Creating Blocks',
	markdown: '# Creating Blocks',
} );

addStory( {
	parents: [ 'blocks' ],
	name: 'step1',
	title: 'Step 1',
	markdown: step1,
} );

addStory( {
	parents: [ 'blocks' ],
	name: 'step2',
	title: 'Step 2',
	markdown: step2,
} );

addStory( {
	parents: [ 'blocks' ],
	name: 'step3',
	title: 'Step 3',
	markdown: step3,
} );
