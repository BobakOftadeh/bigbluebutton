import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { styles } from './styles';
import Button from '/imports/ui/components/button/component';
import RecordingContainer from '/imports/ui/components/recording/container';
import cx from 'classnames';

const intlMessages = defineMessages({
  startTitle: {
    id: 'app.recording.startTitle',
    description: 'start recording title',
  },
  stopTitle: {
    id: 'app.recording.stopTitle',
    description: 'stop recording title',
  },
  startDescription: {
    id: 'app.recording.startDescription',
    description: 'start recording description',
  },
  stopDescription: {
    id: 'app.recording.stopDescription',
    description: 'stop recording description',
  },
  yesLabel: {
    id: 'app.audioModal.yes',
    description: 'label for yes button',
  },
  noLabel: {
    id: 'app.audioModal.no',
    description: 'label for no button',
  },
});

const RecordingIndicator = ({
  record, title, recording, buttonTitle, mountModal,
}) => {
  if (!record) return null;

  return (
    <div
      aria-label={title}
      className={styles.recordState}
    >
      <div className={styles.border}>
        <Button
          label={buttonTitle}
          hideLabel
          ghost
          className={cx(styles.btn, recording ? styles.recordIndicator : styles.notRecording)}
          onClick={() => mountModal(<RecordingContainer />)}
        />
      </div>
      <div className={styles.presentationTitle}>
        {buttonTitle}
      </div>
    </div>
  );
};

export default RecordingIndicator;
