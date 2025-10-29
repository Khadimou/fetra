import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'data', 'webhook-logs');
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Webhook Logger API
 * Stores webhook events to disk for debugging (only enabled in development)
 */

export async function POST(request: Request) {
  // Only enable in development
  if (!isDevelopment) {
    return NextResponse.json({ error: 'Logging disabled in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { event, source, data } = body;

    if (!event || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: event, source' },
        { status: 400 }
      );
    }

    // Ensure logs directory exists
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }

    // Create log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      source,
      data: data || {},
      requestHeaders: Object.fromEntries(request.headers.entries())
    };

    // Write to daily log file
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOGS_DIR, `webhooks-${date}.json`);

    let logs: any[] = [];
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      logs = JSON.parse(content);
    }

    logs.push(logEntry);

    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');

    return NextResponse.json({
      ok: true,
      logged: true,
      logFile: `webhooks-${date}.json`
    });
  } catch (error: any) {
    console.error('Webhook logging error:', error);
    return NextResponse.json(
      { error: error?.message || 'Logging failed' },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve webhook logs
 */
export async function GET(request: Request) {
  if (!isDevelopment) {
    return NextResponse.json({ error: 'Logging disabled in production' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const logFile = path.join(LOGS_DIR, `webhooks-${date}.json`);

    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ logs: [], message: 'No logs found for this date' });
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const logs = JSON.parse(content);

    return NextResponse.json({ logs, date });
  } catch (error: any) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to read logs' },
      { status: 500 }
    );
  }
}

