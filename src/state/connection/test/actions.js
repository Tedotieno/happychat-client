/** @format */

/**
 * Internal dependencies
 */
import { HAPPYCHAT_IO_RECEIVE_INIT } from 'src/state/action-types';
import { receiveInit } from '../actions';

describe( 'actions', () => {
	describe( '#receiveInit()', () => {
		test( 'should return an action object', () => {
			const action = receiveInit( { geoLocation: { country_long: 'Romania' } } );

			expect( action ).toMatchObject( {
				type: HAPPYCHAT_IO_RECEIVE_INIT,
				user: { geoLocation: { country_long: 'Romania' } },
			} );
		} );
	} );
} );