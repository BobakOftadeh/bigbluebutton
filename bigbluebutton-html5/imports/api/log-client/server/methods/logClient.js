import Logger from '/imports/startup/server/logger';
import Users from '/imports/api/users';

const logClient = function (type, log, ...args) {
  const SERVER_CONN_ID = this.connection.id;
  const User = Users.findOne({ connectionId: SERVER_CONN_ID });
  const logContents = { ...args };
  console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOO");
  console.log(logContents);
  console.log(args[0].meetingId)
  if (User) {
    const {
      meetingId, name, intId, extId, authToken,
    } = User;
    if (User.meetingId === args[0].meetingId) {

    } else{

    }
  } else {

  }

  

  
    if (typeof log === 'string' || log instanceof String) {
      Logger.log(type, `CLIENT LOG: ${log}`, logContents);
    } else {
      Logger.log(type, `CLIENT LOG: ${JSON.stringify(log)}`, logContents);
    }
  

};

export default logClient;
