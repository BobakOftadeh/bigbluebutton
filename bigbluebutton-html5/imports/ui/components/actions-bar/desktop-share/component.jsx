import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import { styles } from '../styles';

const propTypes = {
  intl: intlShape.isRequired,
};

const intlMessages = defineMessages({
  desktopShareLabel: {
    id: 'app.actionsBar.actionsDropdown.desktopShareLabel',
    description: 'Desktop Share option label',
  },
  stopDesktopShareLabel: {
    id: 'app.actionsBar.actionsDropdown.stopDesktopShareLabel',
    description: 'Stop Desktop Share option label',
  },
  desktopShareDesc: {
    id: 'app.actionsBar.actionsDropdown.desktopShareDesc',
    description: 'adds context to desktop share option',
  },
  stopDesktopShareDesc: {
    id: 'app.actionsBar.actionsDropdown.stopDesktopShareDesc',
    description: 'adds context to stop desktop share option',
  },

});

const SHORTCUTS_CONFIG = Meteor.settings.public.app.shortcuts;
const OPEN_STATUS_AK = SHORTCUTS_CONFIG.openStatus.accesskey;

const DesktopShare = ({
  intl,
  handleShareScreen,
  handleUnshareScreen,
  isVideoBroadcasting }) => {
  return (
    <Button
    className={styles.button}  
    icon="desktop"
      label={intl.formatMessage(isVideoBroadcasting ?
        intlMessages.stopDesktopShareLabel : intlMessages.desktopShareLabel)}
      description={intl.formatMessage(isVideoBroadcasting ?
        intlMessages.stopDesktopShareDesc : intlMessages.desktopShareDesc)}
      color='primary'
      icon="desktop"
      ghost={false}
      hideLabel
      circle
      size="lg"
      onClick={isVideoBroadcasting ? handleUnshareScreen : handleShareScreen}
    />
  );
};

DesktopShare.propTypes = propTypes;
export default injectIntl(DesktopShare);
