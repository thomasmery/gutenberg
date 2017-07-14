/**
 * External dependencies
 */
import * as matchers from './matchers';

export { matchers };
export { createBlock, switchToBlockType } from './factory';
export { default as parse } from './parser';
export { default as pasteHandler } from './paste';
export { default as serialize, getBlockDefaultClassname } from './serializer';
export { getCategories } from './categories';
export {
	registerBlockType,
	unregisterBlockType,
	setUnknownTypeHandler,
	getUnknownTypeHandler,
	setDefaultBlock,
	getDefaultBlock,
	getBlockType,
	getBlockTypes,
} from './registration';
