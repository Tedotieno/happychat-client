/** @format */

/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_IO_REQUEST_FALLBACK_TICKET,
	HAPPYCHAT_IO_REQUEST_FALLBACK_TICKET_RECEIVE,
	HAPPYCHAT_IO_REQUEST_FALLBACK_TICKET_TIMEOUT,
} from '../action-types';
import {
	HAPPYCHAT_FALLBACK_TICKET_NEW,
	HAPPYCHAT_FALLBACK_TICKET_SENDING,
	HAPPYCHAT_FALLBACK_TICKET_SUCCESS,
	HAPPYCHAT_FALLBACK_TICKET_FAILURE,
	HAPPYCHAT_FALLBACK_TICKET_TIMEOUT,
} from '../constants';

const status = ( state = HAPPYCHAT_FALLBACK_TICKET_NEW, action ) => {
	switch ( action.type ) {
		case HAPPYCHAT_IO_REQUEST_FALLBACK_TICKET:
			return HAPPYCHAT_FALLBACK_TICKET_SENDING;
		case HAPPYCHAT_IO_REQUEST_FALLBACK_TICKET_RECEIVE:
			return action.success ? HAPPYCHAT_FALLBACK_TICKET_SUCCESS : HAPPYCHAT_FALLBACK_TICKET_FAILURE;
		case HAPPYCHAT_IO_REQUEST_FALLBACK_TICKET_TIMEOUT:
			return HAPPYCHAT_FALLBACK_TICKET_TIMEOUT;
	}
	return state;
};
export default combineReducers( { status } );