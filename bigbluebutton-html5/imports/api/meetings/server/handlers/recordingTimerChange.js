import { check } from 'meteor/check';
import Meetings from '/imports/api/meetings';
import Logger from '/imports/startup/server/logger';

export default function handleRecordingStatusChange({ body }, meetingId) {
  const { time } = body;

  const selector = {
    meetingId,
  };

  const modifier = {
    $set: { 'recordProp.time': time },
  };

  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  console.log(body);

  const cb = (err) => {
    if (err) {
      Logger.error(`Changing recording time: ${err}`);
    }
  };
}
