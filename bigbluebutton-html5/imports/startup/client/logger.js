import Auth from '/imports/ui/services/auth';
import { Meteor } from 'meteor/meteor';
import { createLogger, stdSerializers } from 'browser-bunyan';
import { ConsoleFormattedStream } from '@browser-bunyan/console-formatted-stream';
import { nameFromLevel } from '@browser-bunyan/levels';

// The logger accepts "console","server", and "url" as targets
// Multiple targets can be set as an array in the settings under public.log.target
// The targets that are accepted are 'console', 'server', 'url'
// Set the desired levels to be sent under public.log.level
// The accepted levels are debug, info, warn, error
// If sending to a url, provide the end-point on public.log.url
// Call the logger by doing a function call with the level name, I.e, logger.warn('Hi on warn')

const LOG_CONFIG = Meteor.settings.public.log || {};
const loggerStreams = []; // Stores the targets streams
const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'no-window';
const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
const { fullInfo } = Auth;

// create a custom stream that logs to an end-point
class ServerLoggerStream {
  constructor(opts = {}) {
    const {
      writeCondition = ServerLoggerStream.defaultWriteCondition,
    } = opts;

    this.opts = opts;
    this.writeCondition = writeCondition;
    this.records = {};

    this.start();
  }

  start() {
    const {
      method = 'PUT',
      url = '/log',
      throttleInterval = 3000,
      withCredentials = false,
      onError,
    } = this.opts;

    const throttleRequests = () => {
      // wait for any errors to accumulate
      this.currentThrottleTimeout = setTimeout(() => {
        const recs = Object.keys(this.records).map(errKey => this.records[errKey]);

        if (recs.length) {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status >= 400) {
                if (typeof onError === 'function') {
                  onError.call(this, recs, xhr);
                } else {
                  console.warn('Browser Bunyan: A server log write failed');
                }
              }
              this.records = {};
              throttleRequests();
            }
          };
          xhr.open(method, url);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.withCredentials = withCredentials;
          xhr.send(JSON.stringify(recs));
        } else {
          throttleRequests();
        }
      }, throttleInterval);
    };

    throttleRequests();
  }

  stop() {
    setTimeout(() => {
      if (this.currentThrottleTimeout) {
        clearTimeout(this.currentThrottleTimeout);
        this.currentThrottleTimeout = null;
      }
    }, 1);
  }

  write(rec) {
    rec.url = typeof window !== 'undefined' && window.location.href;
    rec.userAgent = userAgent;
    if (fullInfo.meetingId != null) {
      rec.clientInfo = fullInfo;
    }

    if (this.currentThrottleTimeout && this.writeCondition(rec)) {
      if (this.records[rec.msg]) {
        this.records[rec.msg].count++;
      } else {
        rec.count = 1;
        this.records[rec.msg] = rec;
      }
    }
  }

  static defaultWriteCondition() {
    return window.navigator.onLine && !isBot;
  }
}

// Created a custom stream to log to the meteor server
class MeteorStream {
  write(rec) {
    if (fullInfo.meetingId != null) {
      Meteor.call('logClient', nameFromLevel[rec.level], rec.msg, fullInfo);
    } else {
      Meteor.call('logClient', nameFromLevel[rec.level], rec.msg);
    }
  }
}

// Checks to see which targets have been chosen
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
    stream: new ServerLoggerStream({
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
