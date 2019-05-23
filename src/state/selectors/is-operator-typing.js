/** @format */

/**
 * External dependencies
 */
import get from 'lodash/get';

export default state => get( state, [ 'chat', 'isOperatorTyping' ], false );
