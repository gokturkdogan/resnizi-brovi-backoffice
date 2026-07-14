export type ScanPlatform = {
  os: string;
  browser: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
};

const UNKNOWN = 'unknown';

export function parseUserAgent(userAgent: string | null): ScanPlatform {
  if (!userAgent) {
    return { os: UNKNOWN, browser: UNKNOWN, deviceType: 'unknown' };
  }

  const ua = userAgent;

  return {
    os: parseOs(ua),
    browser: parseBrowser(ua),
    deviceType: parseDeviceType(ua),
  };
}

function parseOs(ua: string): string {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/CrOS/i.test(ua)) return 'Chrome OS';
  if (/Linux/i.test(ua)) return 'Linux';

  return UNKNOWN;
}

function parseBrowser(ua: string): string {
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/YaBrowser/i.test(ua)) return 'Yandex';
  if (/CriOS/i.test(ua)) return 'Chrome';
  if (/FxiOS/i.test(ua)) return 'Firefox';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Chrome/i.test(ua) && !/Edg\//i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome|CriOS|Chromium/i.test(ua)) return 'Safari';

  return UNKNOWN;
}

function parseDeviceType(ua: string): ScanPlatform['deviceType'] {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android/i.test(ua)) return 'mobile';
  if (/Windows|Macintosh|Mac OS X|Linux|CrOS/i.test(ua)) return 'desktop';

  return 'unknown';
}
