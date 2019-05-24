/** @format */

/**
 * Internal dependencies
 */
import { HAPPYCHAT_IO_RECEIVE_MESSAGE } from 'src/state/action-types';
import { sendEvent, sendUserInfo } from 'src/state/connection/actions';
import getChatStatus from 'src/state/selectors/get-chat-status';
import getUserInfo from 'src/state/selectors/get-user-info';
import isAvailable from 'src/state/selectors/is-available';

const EVENT_AVAILABILITY = 'availability';
const EVENT_CHAT_STATUS = 'chatStatus';
const EVENT_RECEIVE_MESSAGE = 'receiveMessage';

const eventAPI = () => {
	const subscribers = {
		[ EVENT_AVAILABILITY ]: [],
		[ EVENT_CHAT_STATUS ]: [],
		[ EVENT_RECEIVE_MESSAGE ]: [],
	};

	const eventNameExist = eventName => subscribers.hasOwnProperty( eventName );

	const isSubscribed = ( eventName, subscriber ) =>
		subscribers[ eventName ].indexOf( subscriber ) > -1; // eslint-disable-line max-len

	const subscribeTo = ( eventName, subscriber ) =>
		eventNameExist( eventName ) &&
		! isSubscribed( eventName, subscriber ) &&
		subscribers[ eventName ].push( subscriber );

	const unsubscribeFrom = ( eventName, subscriber ) =>
		eventNameExist( eventName ) &&
		isSubscribed( subscriber, eventName ) &&
		subscribers[ eventName ].splice( subscribers[ eventName ].indexOf( subscriber ), 1 );

	const emit = ( eventName, ...eventArgs ) =>
		eventNameExist( eventName ) && subscribers[ eventName ].forEach(
			subscriber => subscriber( ...eventArgs )
		);

	const observeChange = ( selector, initialValue, eventName ) => store => {
		let current = initialValue;
		store.subscribe( () => {
			const updated = selector( store.getState() );
			if ( updated !== current ) {
				emit( eventName, updated );
			}
			current = updated;
		} );
	};

	const availableOberver = observeChange( isAvailable, false, EVENT_AVAILABILITY );
	const statusObserver = observeChange( getChatStatus, 'new', EVENT_CHAT_STATUS );

	return {
		middleware: () => next => action => {
			switch ( action.type ) {
				case HAPPYCHAT_IO_RECEIVE_MESSAGE: {
					if ( action.message.source === 'operator' ) {
						emit( EVENT_RECEIVE_MESSAGE );
					}
				}
			}
			return next( action );
		},
		subscribe: store => {
			availableOberver( store );
			statusObserver( store );

			return {
				subscribeTo,
				unsubscribeFrom,
				sendEventMsg: msg => store.dispatch( sendEvent( msg ) ),
				sendUserInfoMsg: userInfo =>
					store.dispatch( sendUserInfo( getUserInfo( store.getState() )( userInfo ) ) ),
			};
		},
	};
};

export default eventAPI;
