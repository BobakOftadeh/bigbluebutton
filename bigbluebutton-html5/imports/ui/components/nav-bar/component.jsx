import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import Icon from '/imports/ui/components/icon/component';
import BreakoutJoinConfirmation from '/imports/ui/components/breakout-join-confirmation/container';
import Dropdown from '/imports/ui/components/dropdown/component';
import DropdownTrigger from '/imports/ui/components/dropdown/trigger/component';
import DropdownContent from '/imports/ui/components/dropdown/content/component';
import DropdownList from '/imports/ui/components/dropdown/list/component';
import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';
import { withModalMounter } from '/imports/ui/components/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import { defineMessages, injectIntl } from 'react-intl';
import { styles } from './styles.scss';
import Button from '../button/component';
import RecordingIndicator from './recording-indicator/component';
import SettingsDropdownContainer from './settings-dropdown/container';

const intlMessages = defineMessages({
  toggleUserListLabel: {
    id: 'app.navBar.userListToggleBtnLabel',
    description: 'Toggle button label',
  },
  toggleUserListAria: {
    id: 'app.navBar.toggleUserList.ariaLabel',
    description: 'description of the lists inside the userlist',
  },
  newMessages: {
    id: 'app.navBar.toggleUserList.newMessages',
    description: 'label for toggleUserList btn when showing red notification',
  },
  recordingSession: {
    id: 'app.navBar.recording',
    description: 'label for when the session is being recorded',
  },
  recordingIndicatorOn: {
    id: 'app.navBar.recording.on',
    description: 'label for indicator when the session is being recorded',
  },
  recordingIndicatorOff: {
    id: 'app.navBar.recording.off',
    description: 'label for indicator when the session is not being recorded',
  },
  startTitle: {
    id: 'app.recording.startTitle',
    description: 'start recording title',
  },
});

const propTypes = {
  presentationTitle: PropTypes.string,
  hasUnreadMessages: PropTypes.bool,
  beingRecorded: PropTypes.object,
  shortcuts: PropTypes.string,
};

const defaultProps = {
  presentationTitle: 'Default Room Title',
  hasUnreadMessages: false,
  beingRecorded: false,
  shortcuts: '',
};
const interval = null;
const openBreakoutJoinConfirmation = (breakout, breakoutName, mountModal) =>
  mountModal(<BreakoutJoinConfirmation
    breakout={breakout}
    breakoutName={breakoutName}
  />);

const closeBreakoutJoinConfirmation = mountModal =>
  mountModal(null);

class NavBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isActionsOpen: false,
      didSendBreakoutInvite: false,
      time: props.beingRecorded.time,
    };

    this.incrementTime = this.incrementTime.bind(this);
    this.handleToggleUserList = this.handleToggleUserList.bind(this);
  }

  componentDidMount() {
    
  }

  componentDidUpdate(oldProps) {
    const {
      breakouts,
      isBreakoutRoom,
      mountModal,
      beingRecorded,
    } = this.props;

    if (!beingRecorded.recording) {
      clearInterval(this.interval);
      this.interval = null;
      console.log(beingRecorded);
    } else if (this.interval === null) {
      this.interval = setInterval(this.incrementTime, 1000);
    }

    const hadBreakouts = oldProps.breakouts.length;
    const hasBreakouts = breakouts.length;

    if (!hasBreakouts && hadBreakouts) {
      closeBreakoutJoinConfirmation(mountModal);
    }

    breakouts.forEach((breakout) => {
      if (!breakout.users) {
        return;
      }

      if (!this.state.didSendBreakoutInvite && !isBreakoutRoom) {
        this.inviteUserToBreakout(breakout);
      }
    });

    if (!breakouts.length && this.state.didSendBreakoutInvite) {
      this.setState({ didSendBreakoutInvite: false });
    }
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  handleToggleUserList() {
    this.props.toggleUserList();
  }

  inviteUserToBreakout(breakout) {
    const {
      mountModal,
    } = this.props;

    this.setState({ didSendBreakoutInvite: true }, () => {
      openBreakoutJoinConfirmation.call(this, breakout, breakout.name, mountModal);
    });
  }

  renderPresentationTitle() {
    const {
      breakouts,
      isBreakoutRoom,
      presentationTitle,
    } = this.props;

    if (isBreakoutRoom || !breakouts.length) {
      return (
        <h1 className={styles.presentationTitle}>{presentationTitle}</h1>
      );
    }
    const breakoutItems = breakouts.map(breakout => this.renderBreakoutItem(breakout));

    return (
      <Dropdown isOpen={this.state.isActionsOpen}>
        <DropdownTrigger>
          <h1 className={cx(styles.presentationTitle, styles.dropdownBreakout)}>
            {presentationTitle} <Icon iconName="down-arrow" />
          </h1>
        </DropdownTrigger>
        <DropdownContent
          placement="bottom"
        >
          <DropdownList>
            {breakoutItems}
          </DropdownList>
        </DropdownContent>
      </Dropdown>
    );
  }

  incrementTime() {
    const {
      beingRecorded
    } = this.props;


    console.log(this.state.time)
    console.log(beingRecorded)
    if(beingRecorded.time > this.state.time){
      this.setState({ time: beingRecorded.time + 1 });
    }else{
      this.setState({ time: this.state.time + 1 });
    }
  }

  renderBreakoutItem(breakout) {
    const {
      mountModal,
    } = this.props;

    const breakoutName = breakout.name;

    return (
      <DropdownListItem
        className={styles.actionsHeader}
        key={_.uniqueId('action-header')}
        label={breakoutName}
        onClick={openBreakoutJoinConfirmation.bind(this, breakout, breakoutName, mountModal)}
      />
    );
  }

  render() {
    const {
      hasUnreadMessages,
      beingRecorded,
      isExpanded,
      intl,
      shortcuts: TOGGLE_USERLIST_AK,
      mountModal,
    } = this.props;

    const recordingMessage = beingRecorded.recording ? 'recordingIndicatorOn' : 'recordingIndicatorOff';
    
    
    console.log(this.interval)
    if(!this.interval){
      console.log("AAAAADASDASDSAD")
      this.interval = setInterval(this.incrementTime, 1000);
    }
  
    if(beingRecorded.time !== this.state.time){
      console.log("AAAAAAAAAABBBBBBBB")
      
    }

    const toggleBtnClasses = {};
    toggleBtnClasses[styles.btn] = true;
    toggleBtnClasses[styles.btnWithNotificationDot] = hasUnreadMessages;

    let ariaLabel = intl.formatMessage(intlMessages.toggleUserListAria);
    ariaLabel += hasUnreadMessages ? (` ${intl.formatMessage(intlMessages.newMessages)}`) : '';

    return (
      <div className={styles.navbar}>
        <div className={styles.left}>
          <Button
            data-test="userListToggleButton"
            onClick={this.handleToggleUserList}
            ghost
            circle
            hideLabel
            label={intl.formatMessage(intlMessages.toggleUserListLabel)}
            aria-label={ariaLabel}
            icon="user"
            className={cx(toggleBtnClasses)}
            aria-expanded={isExpanded}
            accessKey={TOGGLE_USERLIST_AK}
          />
        </div>
        <div className={styles.center}>
          {this.renderPresentationTitle()}
          {beingRecorded.record ?
            <span className={styles.presentationTitleSeparator}>|</span>
          : null}
          <RecordingIndicator
            {...beingRecorded}
            title={intl.formatMessage(intlMessages[recordingMessage])}
            buttonTitle={intl.formatMessage(intlMessages.startTitle)}
            mountModal={mountModal}
            time={this.state.time}
          />
        </div>
        <div className={styles.right}>
          <SettingsDropdownContainer />
        </div>
      </div>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;
export default withShortcutHelper(withModalMounter(injectIntl(NavBar)), 'toggleUserList');
