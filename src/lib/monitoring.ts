// lib/monitoring.ts
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, userId, sessionId, ip, metadata } = entry;
    
    const logData = {
      level,
      message,
      timestamp,
      ...(userId && { userId }),
      ...(sessionId && { sessionId }),
      ...(ip && { ip }),
      ...(metadata && { metadata }),
    };

    return JSON.stringify(logData);
  }

  private log(level: keyof LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };

    const formattedLog = this.formatLog(entry);

    if (this.isDevelopment) {
      console.log(formattedLog);
    } else {
      // Em produção, você pode enviar para serviços como Sentry, DataDog, etc.
      console.log(formattedLog);
    }
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('ERROR', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('WARN', message, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('INFO', message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('DEBUG', message, metadata);
  }
}

export const logger = new Logger();

// Função para monitorar performance de APIs
export function monitorApiPerformance(
  handler: Function,
  routeName: string
) {
  return async function(...args: any[]) {
    const startTime = Date.now();
    
    try {
      const result = await handler(...args);
      const duration = Date.now() - startTime;
      
      logger.info(`API ${routeName} completed`, {
        route: routeName,
        duration: `${duration}ms`,
        status: 'success',
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(`API ${routeName} failed`, {
        route: routeName,
        duration: `${duration}ms`,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  };
}

// Função para monitorar tentativas de login
export function logLoginAttempt(
  email: string,
  success: boolean,
  ip: string,
  userAgent?: string,
  error?: string
) {
  const maskedEmail = email.substring(0, 3) + '***@' + email.split('@')[1];
  
  if (success) {
    logger.info('Login successful', {
      email: maskedEmail,
      ip,
      userAgent,
    });
  } else {
    logger.warn('Login failed', {
      email: maskedEmail,
      ip,
      userAgent,
      error: error || 'Invalid credentials',
    });
  }
}

// Função para monitorar atividades suspeitas
export function logSuspiciousActivity(
  activity: string,
  ip: string,
  userAgent?: string,
  metadata?: Record<string, any>
) {
  logger.warn('Suspicious activity detected', {
    activity,
    ip,
    userAgent,
    metadata,
  });
}

// Função para monitorar rate limiting
export function logRateLimitHit(
  route: string,
  ip: string,
  limit: number,
  remaining: number
) {
  logger.warn('Rate limit hit', {
    route,
    ip,
    limit,
    remaining,
  });
}
