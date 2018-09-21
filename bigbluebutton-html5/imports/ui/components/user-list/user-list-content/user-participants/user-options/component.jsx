import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import _ from 'lodash';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { styles } from './styles';

import LogoutConfirmationContainer from '/imports/ui/components/logout-confirmation/container';
import AboutContainer from '/imports/ui/components/about/container';
import SettingsMenuContainer from '/imports/ui/components/settings/container';

import Button from '/imports/ui/components/button/component';
import Dropdown from '/imports/ui/components/dropdown/component';
import DropdownTrigger from '/imports/ui/components/dropdown/trigger/component';
import DropdownContent from '/imports/ui/components/dropdown/content/component';
import DropdownList from '/imports/ui/components/dropdown/list/component';
import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';
import DropdownListSeparator from '/imports/ui/components/dropdown/list/separator/component';
import ShortcutHelpComponent from '/imports/ui/components/shortcut-help/component';


const intlMessages = defineMessages({
  optionsLabel: {
    id: 'app.userList.userOptions.clearAllLabel',
    description: 'Clear all label',
  },
  clearAllLabel: {
    id: 'app.userList.userOptions.clearAllLabel',
    description: 'Clear all label',
  },
  clearAllDesc: {
    id: 'app.userList.userOptions.clearAllDesc',
    description: 'Clear all description',
  },
  muteAllLabel: {
    id: 'app.userList.userOptions.muteAllLabel',
    description: 'Mute all label',
  },
  muteAllDesc: {
    id: 'app.userList.userOptions.muteAllDesc',
    description: 'Mute all description',
  },
  lockViewersLabel: {
    id: 'app.userList.userOptions.lockViewersLabel',
    description: 'Lock all label',
  },
  lockViewersDesc: {
    id: 'app.userList.userOptions.lockViewersDesc',
    description: 'Lock all description',
  },
  muteAllExceptPresenterLabel: {
    id: 'app.userList.userOptions.muteAllExceptPresenterLabel',
    description: 'Mute all except presenter label',
  },
  muteAllExceptPresenterDesc: {
    id: 'app.userList.userOptions.muteAllExceptPresenterDesc',
    description: 'Mute all except presenter description',
  },
});

const SHORTCUTS_CONFIG = Meteor.settings.public.app.shortcuts;
const OPEN_OPTIONS_AK = SHORTCUTS_CONFIG.openOptions.accesskey;

class UserOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSettingOpen: false,
    };

    this.onActionsShow = this.onActionsShow.bind(this);
    this.onActionsHide = this.onActionsHide.bind(this);
  }

  componentWillMount() {
    const { intl, mountModal } = this.props;
    const { showHelpButton: helpButton } = Meteor.settings.public.app;

    this.menuItems = _.compact([
      (<DropdownListItem
        key={_.uniqueId('list-item-')}
        icon="clear_status"
        label={intl.formatMessage(intlMessages.clearAllLabel)}
        description={intl.formatMessage(intlMessages.clearAllDesc)}
        onClick={() => mountModal(<SettingsMenuContainer />)}
      />),
      (<DropdownListItem
        key={_.uniqueId('list-item-')}
        icon="mute filled"
        label={intl.formatMessage(intlMessages.muteAllLabel)}
        description={intl.formatMessage(intlMessages.muteAllDesc)}
        onClick={() => mountModal(<AboutContainer />)}
      />),
      !helpButton ? null :
        (<DropdownListItem
          key={_.uniqueId('list-item-')}
          icon="mute filled"
          label={intl.formatMessage(intlMessages.muteAllExceptPresenterLabel)}
          description={intl.formatMessage(intlMessages.muteAllExceptPresenterDesc)}
          onClick={() => window.open('https://bigbluebutton.org/videos/')}
        />),
      (<DropdownListItem
        key={_.uniqueId('list-item-')}
        icon="lock"
        label={intl.formatMessage(intlMessages.lockViewersLabel)}
        description={intl.formatMessage(intlMessages.lockViewersDesc)}
        onClick={() => mountModal(<ShortcutHelpComponent />)}
      />),
    ]);

    // Removes fullscreen button if not on Android
  }

  componentWillReceiveProps(nextProps) {
    // Alters fullscreen button's label
    if (this.props.isAndroid) {
      this.alterMenu(nextProps);
    }
  }

  onActionsShow() {
    this.setState({
      isSettingOpen: true,
    });
  }

  onActionsHide() {
    this.setState({
      isSettingOpen: false,
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <Dropdown
      ref={(ref) => { this.dropdown = ref; }}  
      autoFocus={false}
        isOpen={this.state.isSettingOpen}
        onShow={this.onActionsShow}
        onHide={this.onActionsHide}
        className={styles.dropdown}
      >
        <DropdownTrigger tabIndex={0} accessKey={OPEN_OPTIONS_AK}>
          <Button
            label={intl.formatMessage(intlMessages.optionsLabel)}
            icon="settings"
            size = 'sm'
            circle
            hideLabel
            className={styles.optionsButton}
            onClick={() => null}
          />
        </DropdownTrigger>
        <DropdownContent 
        className={styles.dropdownContent}
        placement="right top">
          <DropdownList>
            {
              this.menuItems
            }
          </DropdownList>
        </DropdownContent>
      </Dropdown>
    );
  }
}

export default withModalMounter(injectIntl(UserOptions));
