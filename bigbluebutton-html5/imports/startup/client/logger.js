import Auth from '/imports/ui/services/auth';
import { Meteor } from 'meteor/meteor';
import { createLogger, stdSerializers } from 'browser-bunyan';
import { ConsoleFormattedStream } from '@browser-bunyan/console-formatted-stream';
import { ServerStream } from '@browser-bunyan/server-stream';
import { nameFromLevel } from '@browser-bunyan/levels';

// The logger accepts "console","server", and "url" as targets
// Multiple targets can be set as an array in the settings under public.log.target
// Set the desired levels to be sent under public.log.level
// The accepted levels are debug, info, warn, error
// If sending to a url, provide the end-point on public.log.url
// Call the logger by doing a function call with the level name, I.e, logger.warn('Hi on warn')

const LOG_CONFIG = Meteor.settings.public.log || {};
const loggerStreams = []; // Stores the targets streams

// Created a custom stream to log to the meteor server
class MeteorStream {
  write(rec) {
    
    const { credentials } = Auth;
    Meteor.call('logClient', nameFromLevel[rec.level], rec.msg, { credentials });
  }
}

if (LOG_CONFIG.target.includes('console')) {
  loggerStreams.unshift({
    level: LOG_CONFIG.level, // sends logs that are this level and higher
    stream: new ConsoleFormattedStream(),
  });
}

if (LOG_CONFIG.target.includes('server')) {
  loggerStreams.unshift({
    level: LOG_CONFIG.level,
    stream: new MeteorStream(),
  });
}

if (LOG_CONFIG.target.includes('url')) {
  loggerStreams.unshift({
    level: LOG_CONFIG.level,
    stream: new ServerStream({
      url: LOG_CONFIG.url,
      method: 'PUT',
    }),
  });
}

// Creates the logger with the array of streams of the chosen targets
const logger = createLogger({
  name: 'clientLogger',
  streams: loggerStreams,
  serializers: stdSerializers,
  src: true,
});

export default logger;
