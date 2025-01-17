/** @format */

/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_ASSETS_LOADED,
	HAPPYCHAT_OPEN,
	HAPPYCHAT_MINIMIZING,
	HAPPYCHAT_BLUR,
	HAPPYCHAT_FOCUS,
	HAPPYCHAT_FORM_DEFAULT_VALUES,
	HAPPYCHAT_RESET_FORM,
	HAPPYCHAT_SET_CURRENT_MESSAGE,
	HAPPYCHAT_SET_HAS_UNREAD_MESSAGES,
	HAPPYCHAT_SET_IS_DISPLAYING_NEW_MESSAGES,
} from 'src/state/action-types';

const setChatOpen = isOpen => ( { type: HAPPYCHAT_OPEN, isOpen } );
const setChatMinimizing = isMinimizing => ( { type: HAPPYCHAT_MINIMIZING, isMinimizing } );

/**
 * Set the Happychat sidebar dock to display
 * @returns {Object} Action
 */
export const openChat = () => setChatOpen( true );

/**
 * Set the Happychat sidebar dock to start minimizing
 * @returns {Object} Action
 */
export const minimizeChat = () => setChatMinimizing( true );

/**
 * Set the Happychat sidebar dock to finish minimizing
 * @returns {Object} Action
 */
export const minimizedChat = () => setChatMinimizing( false );

/**
 * Set the Happychat sidebar dock to hide
 * @returns {Object} Action
 */
export const closeChat = () => setChatOpen( false );

/**
 * Indicates Happychat component lost focus
 * @returns {Object} Action
 */
export const blur = () => ( { type: HAPPYCHAT_BLUR } );

/**
 * Indicates Happychat component gained focus
 * @returns {Object} Action
 */
export const focus = () => ( { type: HAPPYCHAT_FOCUS } );

/**
 * Returns an action object that sets the current chat message
 *
 * @param  { String } message Current message to be set
 * @return { Object } Action object
 */
export const setCurrentMessage = message => ( { type: HAPPYCHAT_SET_CURRENT_MESSAGE, message } );

/**
 * Returns an action object that indicates whether the assets are ready.
 *
 * @return { Object } Action object
 */
export const setAssetsLoaded = () => ( { type: HAPPYCHAT_ASSETS_LOADED } );

export const resetForm = values => ( {
	type: HAPPYCHAT_RESET_FORM,
	values,
} );

export const setFormDefaultValues = values => ( { type: HAPPYCHAT_FORM_DEFAULT_VALUES, values } );

export const setIsDisplayingNewMessages = isDisplayed => ( {
	type: HAPPYCHAT_SET_IS_DISPLAYING_NEW_MESSAGES,
	isDisplayed,
} );
