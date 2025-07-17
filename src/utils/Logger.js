class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
  }

  debug(message, data = null) {
    this.log('debug', message, data);
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  log(level, message, data = null) {
    if (this.levels[level] >= this.levels[this.level]) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

      console.log(`${prefix} ${message}`);

      if (data) {
        if (typeof data === 'object') {
          console.log(`${prefix} Data:`, JSON.stringify(data, null, 2));
        } else {
          console.log(`${prefix} Data:`, data);
        }
      }
    }
  }

  setLevel(level) {
    if (this.levels.hasOwnProperty(level)) {
      this.level = level;
    } else {
      throw new Error(
        `Invalid log level: ${level}. Valid levels: ${Object.keys(
          this.levels
        ).join(', ')}`
      );
    }
  }
}

module.exports = Logger;
