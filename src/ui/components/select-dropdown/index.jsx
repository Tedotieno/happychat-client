/** @format */

/**
 * External dependencies
 */
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import result from 'lodash/result';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Count from 'src/ui/components/count';
import DropdownItem from './item';
import DropdownSeparator from './separator';
import DropdownLabel from './label';
import Search from './search';

/**
 * SelectDropdown
 */
class SelectDropdown extends Component {
	static propTypes = {
		selectedText: PropTypes.string,
		selectedIcon: PropTypes.element,
		selectedCount: PropTypes.number,
		initialSelected: PropTypes.string,
		isSearchable: PropTypes.bool,
		placeholder: PropTypes.string,
		className: PropTypes.string,
		style: PropTypes.object,
		onSelect: PropTypes.func,
		onToggle: PropTypes.func,
		focusSibling: PropTypes.func,
		tabIndex: PropTypes.number,
		options: PropTypes.arrayOf(
			PropTypes.shape( {
				value: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired,
				path: PropTypes.string,
				icon: PropTypes.element,
			} )
		),
	};

	static defaultProps = {
		options: [],
		onSelect: () => {},
		onToggle: () => {},
		style: {},
		isSearchable: true,
		placeholder: 'Search',
	};

	static instances = 0;

	constructor( props ) {
		super( props );

		// bind methods to this instance
		this.activateItem = this.activateItem.bind( this );
		this.closeDropdown = this.closeDropdown.bind( this );
		this.dropdownOptions = this.dropdownOptions.bind( this );
		this.focusSibling = this.focusSibling.bind( this );
		this.getInitialSelectedItem = this.getInitialSelectedItem.bind( this );
		this.getSelectedIcon = this.getSelectedIcon.bind( this );
		this.getSelectedText = this.getSelectedText.bind( this );
		this.handleOutsideClick = this.handleOutsideClick.bind( this );
		this.navigateItem = this.navigateItem.bind( this );
		this.navigateItemByTabKey = this.navigateItemByTabKey.bind( this );
		this.onClick = this.onClick.bind( this );
		this.onSearch = this.onSearch.bind( this );
		this.onSelectItem = this.onSelectItem.bind( this );
		this.openDropdown = this.openDropdown.bind( this );
		this.selectItem = this.selectItem.bind( this );
		this.toggleDropdown = this.toggleDropdown.bind( this );

		// state
		const initialState = { isOpen: false, searchValue: null };

		if ( props.options.length ) {
			initialState.selected = this.getInitialSelectedItem( props );
		}

		this.state = initialState;
	}

	componentWillMount() {
		this.setState( {
			instanceId: ++SelectDropdown.instances,
		} );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.state.isOpen ) {
			this.closeDropdown();
		}

		if (
			typeof this.state.selected !== 'undefined' &&
			this.props.initialSelected !== nextProps.initialSelected
		) {
			this.setState( { selected: nextProps.initialSelected } );
		}
	}

	componentWillUnmount() {
		window.removeEventListener( 'click', this.handleOutsideClick );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.isOpen ) {
			window.addEventListener( 'click', this.handleOutsideClick );
		} else {
			window.removeEventListener( 'click', this.handleOutsideClick );
		}

		if ( this.state.isOpen !== prevState.isOpen ) {
			this.props.onToggle( {
				target: this,
				open: this.state.isOpen,
			} );
		}
	}

	getInitialSelectedItem( props ) {
		props = props || this.props;

		if ( props.initialSelected ) {
			return props.initialSelected;
		}

		if ( ! props.options.length ) {
			return;
		}

		const selectedItem = find( props.options, value => ! value.isLabel );
		return selectedItem && selectedItem.value;
	}

	getSelectedText() {
		const { options, selectedText } = this.props;
		const { selected } = this.state;

		if ( selectedText ) {
			return selectedText;
		}

		// return currently selected text
		const selectedValue = selected || this.getInitialSelectedItem( this.props );
		return result( find( options, { value: selectedValue } ), 'label' );
	}

	getSelectedIcon() {
		const { options, selectedIcon } = this.props;
		const { selected } = this.state;

		if ( selectedIcon ) {
			return selectedIcon;
		}

		// return currently selected icon
		const selectedValue = selected || this.getInitialSelectedItem( this.props );
		return result( find( options, { value: selectedValue } ), 'icon' );
	}

	dropdownOptions( searchValue ) {
		let refIndex = 0;
		const self = this;

		if ( this.props.children ) {
			// add keys and refs to children
			return React.Children.map(
				this.props.children,
				function( child, index ) {
					if ( ! child ) {
						return null;
					}

					const newChild = React.cloneElement( child, {
						ref: child.type === DropdownItem ? 'item-' + refIndex : null,
						key: 'item-' + index,
						isDropdownOpen: this.state.isOpen,
						onClick: function( event ) {
							self.refs.dropdownContainer.focus();
							if ( typeof child.props.onClick === 'function' ) {
								child.props.onClick( event );
							}
						},
					} );

					if ( child.type === DropdownItem ) {
						refIndex++;
					}

					return newChild;
				},
				this
			);
		}

		return this.props.options.map( function( item, index ) {
			if ( ! searchValue && ! item ) {
				return (
					<DropdownSeparator key={ 'dropdown-separator-' + this.state.instanceId + '-' + index } />
				);
			}

			if ( ! searchValue && item.isLabel ) {
				return (
					<DropdownLabel key={ 'dropdown-label-' + this.state.instanceId + '-' + index }>
						{ item.label }
					</DropdownLabel>
				);
			}

			if ( ! searchValue || ( item.label && item.label.match( new RegExp( searchValue, 'i' ) ) ) ) {
				const dropdownItem = (
					<DropdownItem
						key={ 'dropdown-item-' + this.state.instanceId + '-' + item.value }
						ref={ 'item-' + refIndex }
						isDropdownOpen={ this.state.isOpen }
						selected={ this.state.selected === item.value }
						onClick={ this.onSelectItem( item ) }
						path={ item.path }
						icon={ item.icon }
					>
						{ item.label }
					</DropdownItem>
				);

				refIndex++;
				return dropdownItem;
			}
		}, this );
	}

	onSearch( value ) {
		this.setState( { searchValue: value } );
	}

	render() {
		const dropdownClassName = classNames( this.props.className, {
			'select-dropdown': true,
			'is-compact': this.props.compact,
			'is-open': this.state.isOpen,
			'has-count': 'number' === typeof this.props.selectedCount,
		} );

		const selectedText = this.getSelectedText();
		const selectedIcon = this.getSelectedIcon();

		return (
			<div style={ this.props.style } className={ dropdownClassName }>
				<div
					ref="dropdownContainer"
					className="select-dropdown__container"
					onKeyDown={ this.navigateItem }
					tabIndex={ this.props.tabIndex || 0 }
					aria-haspopup="true"
					aria-owns={ 'select-submenu-' + this.state.instanceId }
					aria-controls={ 'select-submenu-' + this.state.instanceId }
					aria-expanded={ this.state.isOpen }
					data-tip-target={ this.props.tipTarget }
					onClick={ this.onClick }
				>
					<div
						id={ 'select-dropdown-' + this.state.instanceId }
						className="select-dropdown__header"
					>
						<span className="select-dropdown__header-text">
							{ selectedIcon ? selectedIcon : null }
							{ selectedText }
						</span>
						{ 'number' === typeof this.props.selectedCount && (
							<Count count={ this.props.selectedCount } />
						) }
					</div>

					<ul
						id={ 'select-submenu-' + this.state.instanceId }
						className="select-dropdown__options"
						role="menu"
						aria-labelledby={ 'select-dropdown-' + this.state.instanceId }
						aria-expanded={ this.state.isOpen }
					>
						{ this.props.isSearchable &&
							this.state.isOpen && (
								<Search 
									ref="dropdownSearchBox" 
									onSearch={ this.onSearch } 
									placeholder={ this.props.placeholder } 
								/>
							) }
						{ this.dropdownOptions( this.state.searchValue ) }
					</ul>
				</div>
			</div>
		);
	}

	onClick( event ) {
		// don't toggle the dropdown if the user clicks in the search box
		if ( event.target === ReactDom.findDOMNode( this.refs.dropdownSearchBox ) )
			return;
		this.toggleDropdown();
	}

	toggleDropdown() {
		this.setState( {
			isOpen: ! this.state.isOpen,
		} );
	}

	openDropdown() {
		this.setState( {
			isOpen: true,
		} );
	}

	closeDropdown() {
		if ( this.state.isOpen ) {
			delete this.focused;
			this.setState( {
				isOpen: false,
				searchValue: null,
			} );
		}
	}

	onSelectItem( option ) {
		return this.selectItem.bind( this, option );
	}

	selectItem( option ) {
		if ( ! option ) {
			return;
		}

		if ( this.props.onSelect ) {
			this.props.onSelect( option );
		}

		this.setState( {
			selected: option.value,
		} );

		this.refs.dropdownContainer.focus();
	}

	navigateItem( event ) {
		switch ( event.keyCode ) {
			case 9: //tab
				this.navigateItemByTabKey( event );
				break;
			case 32: // space
			case 13: // enter
				event.preventDefault();
				this.activateItem();
				break;
			case 38: // up arrow
				event.preventDefault();
				this.focusSibling( 'previous' );
				this.openDropdown();
				break;
			case 40: // down arrow
				event.preventDefault();
				this.focusSibling( 'next' );
				this.openDropdown();
				break;
			case 27: // escape
				event.preventDefault();
				this.closeDropdown();
				this.refs.dropdownContainer.focus();
				break;
		}
	}

	navigateItemByTabKey( event ) {
		if ( ! this.state.isOpen ) {
			return;
		}

		event.preventDefault();

		const direction = event.shiftKey ? 'previous' : 'next';
		this.focusSibling( direction );
	}

	activateItem() {
		if ( ! this.state.isOpen ) {
			return this.openDropdown();
		}
		if ( !! this.focused ) {
			ReactDom.findDOMNode( this.refs[ 'item-' + this.focused ].refs.itemLink ).click();
		}
	}

	focusSibling( direction ) {
		// the initial up-arrow/down-arrow should only open the menu
		if ( ! this.state.isOpen ) {
			return;
		}

		let items, focusedIndex;

		if ( this.props.options.length ) {
			items = map(
				filter( this.props.options, item => {
					return item && ! item.isLabel;
				} ),
				'value'
			);

			focusedIndex =
				typeof this.focused === 'number' ? this.focused : items.indexOf( this.state.selected );
		} else {
			items = filter( this.props.children, function( item ) {
				return item.type === DropdownItem;
			} );

			focusedIndex =
				typeof this.focused === 'number'
					? this.focused
					: findIndex( items, function( item ) {
							return item.props.selected;
						} );
		}

		const increment = direction === 'previous' ? -1 : 1;
		const newIndex = focusedIndex + increment;

		if ( newIndex >= items.length || newIndex < 0 ) {
			return;
		}

		ReactDom.findDOMNode( this.refs[ 'item-' + newIndex ].refs.itemLink ).focus();
		this.focused = newIndex;
	}

	handleOutsideClick( event ) {
		if ( ! ReactDom.findDOMNode( this.refs.dropdownContainer ).contains( event.target ) ) {
			this.closeDropdown();
		}
	}
}

export default SelectDropdown;
