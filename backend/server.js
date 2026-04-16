const http = require('http');
const fsSync = require('fs');
const fs = require('fs/promises');
const path = require('path');
const { URL } = require('url');
const { DatabaseSync } = require('node:sqlite');
const { randomBytes, scryptSync, timingSafeEqual } = require('node:crypto');

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');
const ADMIN_DIR = path.join(ROOT_DIR, 'Admin');
const DATA_FILE = path.join(__dirname, 'data', 'films.json');
const RESERVATIONS_FILE = path.join(__dirname, 'data', 'reservations.json');
const DB_FILE = path.join(__dirname, 'data', 'cinema.sqlite');
const ROOMS_COUNT = 10;
const MAX_SEATS_PER_ROOM = 120;
const MAX_SEATS_PER_SHOWTIME = ROOMS_COUNT * MAX_SEATS_PER_ROOM;

let db;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function hashPassword(password, saltHex) {
  const saltBuffer = saltHex ? Buffer.from(saltHex, 'hex') : randomBytes(16);
  const hashBuffer = scryptSync(password, saltBuffer, 64);

  return {
    salt: saltBuffer.toString('hex'),
    hash: hashBuffer.toString('hex')
  };
}

function verifyPassword(password, saltHex, expectedHashHex) {
  if (!saltHex || !expectedHashHex) {
    return false;
  }

  const derivedHash = scryptSync(password, Buffer.from(saltHex, 'hex'), 64);
  const expectedHash = Buffer.from(expectedHashHex, 'hex');

  if (derivedHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, expectedHash);
}

function initDatabase() {
  fsSync.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  db = new DatabaseSync(DB_FILE);

  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const defaultUsername = 'admin';
  const defaultPassword = 'admin';
  const passwordRecord = hashPassword(defaultPassword);
  const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get(defaultUsername);

  if (existingAdmin) {
    db.prepare(
      `UPDATE admins
       SET password_hash = ?, password_salt = ?
       WHERE username = ?`
    ).run(passwordRecord.hash, passwordRecord.salt, defaultUsername);

    console.log('Default admin password updated: username="admin" password="admin"');
    return;
  }

  db.prepare(
    `INSERT INTO admins (username, password_hash, password_salt, created_at)
     VALUES (?, ?, ?, ?)`
  ).run(defaultUsername, passwordRecord.hash, passwordRecord.salt, new Date().toISOString());

  console.log('Default admin created: username="admin" password="admin"');
}

function getAdminByUsername(username) {
  return db.prepare(
    `SELECT id, username, password_hash AS passwordHash, password_salt AS passwordSalt
     FROM admins
     WHERE username = ?`
  ).get(username);
}

async function ensureJsonDataFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]\n', 'utf8');
  }
}

async function readJsonArray(filePath) {
  await ensureJsonDataFile(filePath);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonArray(filePath, values) {
  await ensureJsonDataFile(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(values, null, 2)}\n`, 'utf8');
}

async function ensureDataFile() {
  await ensureJsonDataFile(DATA_FILE);
}

async function readFilms() {
  return readJsonArray(DATA_FILE);
}

async function writeFilms(films) {
  await writeJsonArray(DATA_FILE, films);
}

async function readReservations() {
  return readJsonArray(RESERVATIONS_FILE);
}

async function writeReservations(reservations) {
  await writeJsonArray(RESERVATIONS_FILE, reservations);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(message);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Body too large'));
      }
    });

    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

function normalizeFilmPayload(payload) {
  const title = String(payload.title || '').trim();
  const genre = String(payload.genre || '').trim();
  const durationValue = Number(payload.duration);
  const rating = String(payload.rating || '').trim();
  const poster = String(payload.poster || '').trim();
  const synopsis = String(payload.synopsis || '').trim();
  const hasShowtimes = Array.isArray(payload.showtimes);
  const showtimes = hasShowtimes
    ? Array.from(new Set(payload.showtimes.map((t) => String(t || '').trim()).filter(Boolean))).sort()
    : [];

  if (!title || !genre || !rating || !Number.isFinite(durationValue) || durationValue <= 0) {
    return { error: 'Invalid required fields' };
  }

  return {
    value: {
      title,
      genre,
      duration: Math.round(durationValue),
      rating,
      poster,
      synopsis,
      ...(hasShowtimes ? { showtimes } : {})
    }
  };
}

function toSeatNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value);
  }

  const raw = String(value || '').trim();
  if (!/^\d+$/.test(raw)) {
    return NaN;
  }

  return Number(raw);
}

function toRoomNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value);
  }

  const raw = String(value || '').trim();
  if (!/^\d+$/.test(raw)) {
    return NaN;
  }

  return Number(raw);
}

function getReservationTicketEntries(reservation) {
  if (Array.isArray(reservation.tickets) && reservation.tickets.length > 0) {
    return reservation.tickets
      .map((ticket) => {
        const roomNumber = Number.isFinite(Number(ticket && ticket.roomNumber))
          ? Math.round(Number(ticket.roomNumber))
          : 1;
        const seatNumber = Number.isFinite(Number(ticket && ticket.seatNumber))
          ? Math.round(Number(ticket.seatNumber))
          : toSeatNumber(ticket && ticket.seat);

        return { roomNumber, seatNumber };
      })
      .filter((ticket) => (
        Number.isFinite(ticket.roomNumber)
        && Number.isFinite(ticket.seatNumber)
        && ticket.roomNumber >= 1
        && ticket.roomNumber <= ROOMS_COUNT
        && ticket.seatNumber >= 1
        && ticket.seatNumber <= MAX_SEATS_PER_ROOM
      ));
  }

  if (Array.isArray(reservation.ticketSeats)) {
    return reservation.ticketSeats
      .map(toSeatNumber)
      .filter((seatNumber) => Number.isFinite(seatNumber))
      .map((seatNumber) => ({ roomNumber: 1, seatNumber }));
  }

  return [];
}

function getReservedSeatsCount(reservation) {
  const ticketCount = getReservationTicketEntries(reservation).length;
  if (ticketCount > 0) {
    return ticketCount;
  }

  const seatsValue = Math.round(Number(reservation && reservation.seats));
  if (Number.isFinite(seatsValue) && seatsValue > 0) {
    return seatsValue;
  }

  return 0;
}

function getTakenSeatKeys(reservationsForShowtime) {
  const taken = new Set();

  (Array.isArray(reservationsForShowtime) ? reservationsForShowtime : []).forEach((entry) => {
    getReservationTicketEntries(entry).forEach((ticket) => {
      taken.add(`${ticket.roomNumber}-${ticket.seatNumber}`);
    });
  });

  return taken;
}

function allocateAutomaticTickets(seatCount, reservationsForShowtime) {
  const seatsToAllocate = Math.round(Number(seatCount));
  if (!Number.isFinite(seatsToAllocate) || seatsToAllocate <= 0) {
    return [];
  }

  const taken = getTakenSeatKeys(reservationsForShowtime);
  const allocated = [];

  for (let roomNumber = 1; roomNumber <= ROOMS_COUNT; roomNumber += 1) {
    for (let seatNumber = 1; seatNumber <= MAX_SEATS_PER_ROOM; seatNumber += 1) {
      const key = `${roomNumber}-${seatNumber}`;
      if (taken.has(key)) {
        continue;
      }

      allocated.push({ roomNumber, seatNumber });
      if (allocated.length === seatsToAllocate) {
        return allocated;
      }
    }
  }

  return allocated;
}

function normalizeReservationPayload(payload, films, reservations) {
  const customerName = String(payload.customerName || '').trim();
  const customerPhone = String(payload.customerPhone || '').trim();
  const showtime = String(payload.showtime || '').trim();
  const filmId = Number(payload.filmId);
  const seatsValue = Number(payload.seats);
  const reservedAtClientRaw = String(payload.reservedAtClient || '').trim();

  if (!customerName || !Number.isFinite(filmId) || !showtime) {
    return { error: 'Missing required reservation fields' };
  }

  if (!Number.isFinite(seatsValue) || seatsValue <= 0) {
    return { error: 'Invalid seats value' };
  }

  const seats = Math.round(seatsValue);

  if (seats > MAX_SEATS_PER_SHOWTIME) {
    return { error: `Seats must be between 1 and ${MAX_SEATS_PER_SHOWTIME}` };
  }

  if (!/^([0-1]\d|2[0-3]):[0-5]\d$/.test(showtime)) {
    return { error: 'Invalid showtime format' };
  }

  const film = (Array.isArray(films) ? films : []).find((entry) => Number(entry.id) === filmId);
  if (!film) {
    return { error: 'Film not found' };
  }

  const availableShowtimes = Array.isArray(film.showtimes)
    ? film.showtimes.map((value) => String(value || '').trim())
    : [];

  if (!availableShowtimes.includes(showtime)) {
    return { error: 'Showtime is not available for this film' };
  }

  const sameShowtimeReservations = (Array.isArray(reservations) ? reservations : []).filter(
    (entry) => Number(entry.filmId) === filmId && String(entry.showtime || '').trim() === showtime
  );

  const soldSeatsCount = sameShowtimeReservations.reduce(
    (sum, entry) => sum + getReservedSeatsCount(entry),
    0
  );

  if (soldSeatsCount >= MAX_SEATS_PER_SHOWTIME) {
    return { error: 'Showtime is full' };
  }

  if (soldSeatsCount + seats > MAX_SEATS_PER_SHOWTIME) {
    return { error: `Only ${MAX_SEATS_PER_SHOWTIME - soldSeatsCount} seats left for this showtime` };
  }

  const reservedAtClientDate = reservedAtClientRaw ? new Date(reservedAtClientRaw) : new Date();
  if (Number.isNaN(reservedAtClientDate.getTime())) {
    return { error: 'Invalid reservation date from client' };
  }

  return {
    value: {
      filmId,
      filmTitle: String(film.title || '').trim(),
      showtime,
      seats,
      customerName,
      customerPhone,
      reservedAtClient: reservedAtClientDate.toISOString()
    }
  };
}

function buildReservationTickets(reservationId, allocatedSeats) {
  const base = `T-${reservationId}`;

  return (Array.isArray(allocatedSeats) ? allocatedSeats : []).map((entry, index) => ({
    ticketNumber: `${base}-${String(index + 1).padStart(2, '0')}`,
    roomNumber: toRoomNumber(entry && entry.roomNumber),
    seatNumber: toSeatNumber(entry && entry.seatNumber)
  }));
}

async function handleApi(req, res, pathname) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let payload;
    try {
      payload = await parseBody(req);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    const username = String(payload.username || '').trim();
    const password = String(payload.password || '');

    if (!username || !password) {
      sendJson(res, 400, { error: 'Username and password are required' });
      return;
    }

    const admin = getAdminByUsername(username);

    if (!admin || !verifyPassword(password, admin.passwordSalt, admin.passwordHash)) {
      sendJson(res, 401, { error: 'Invalid credentials' });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      user: {
        id: admin.id,
        username: admin.username
      }
    });
    return;
  }

  if (pathname === '/api/reservations' && req.method === 'GET') {
    const reservations = await readReservations();
    sendJson(res, 200, reservations);
    return;
  }

  if (pathname === '/api/reservations' && req.method === 'POST') {
    let payload;
    try {
      payload = await parseBody(req);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    const films = await readFilms();
    const reservations = await readReservations();
    const normalized = normalizeReservationPayload(payload, films, reservations);
    if (normalized.error) {
      sendJson(res, 400, { error: normalized.error });
      return;
    }

    let reservationId = Date.now();
    while (reservations.some((item) => Number(item.id) === reservationId)) {
      reservationId += 1;
    }

    const sameShowtimeReservations = reservations.filter(
      (entry) => Number(entry.filmId) === normalized.value.filmId
        && String(entry.showtime || '').trim() === normalized.value.showtime
    );

    const allocatedSeats = allocateAutomaticTickets(normalized.value.seats, sameShowtimeReservations);
    if (allocatedSeats.length !== normalized.value.seats) {
      sendJson(res, 400, { error: 'Showtime is full' });
      return;
    }

    const reservation = {
      id: reservationId,
      ...normalized.value,
      tickets: buildReservationTickets(reservationId, allocatedSeats),
      createdAt: new Date().toISOString()
    };

    reservations.push(reservation);
    await writeReservations(reservations);
    sendJson(res, 201, reservation);
    return;
  }

  const reservationIdMatch = pathname.match(/^\/api\/reservations\/(\d+)$/);
  if (reservationIdMatch) {
    const reservationId = Number(reservationIdMatch[1]);
    const reservations = await readReservations();
    const index = reservations.findIndex((item) => Number(item.id) === reservationId);

    if (index === -1) {
      sendJson(res, 404, { error: 'Reservation not found' });
      return;
    }

    if (req.method === 'DELETE') {
      const [removed] = reservations.splice(index, 1);
      await writeReservations(reservations);
      sendJson(res, 200, removed);
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, reservations[index]);
      return;
    }
  }

  if (pathname === '/api/films' && req.method === 'GET') {
    const films = await readFilms();
    sendJson(res, 200, films);
    return;
  }

  if (pathname === '/api/films' && req.method === 'POST') {
    let payload;
    try {
      payload = await parseBody(req);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    const normalized = normalizeFilmPayload(payload);
    if (normalized.error) {
      sendJson(res, 400, { error: normalized.error });
      return;
    }

    const films = await readFilms();
    const film = {
      id: Date.now(),
      ...normalized.value,
      showtimes: Array.isArray(normalized.value.showtimes) ? normalized.value.showtimes : [],
      addedAt: new Date().toISOString()
    };

    films.push(film);
    await writeFilms(films);
    sendJson(res, 201, film);
    return;
  }

  const filmIdMatch = pathname.match(/^\/api\/films\/(\d+)$/);
  if (filmIdMatch) {
    const filmId = Number(filmIdMatch[1]);
    const films = await readFilms();
    const index = films.findIndex((film) => Number(film.id) === filmId);

    if (index === -1) {
      sendJson(res, 404, { error: 'Film not found' });
      return;
    }

    if (req.method === 'DELETE') {
      const [removed] = films.splice(index, 1);
      await writeFilms(films);

      const reservations = await readReservations();
      const remainingReservations = reservations.filter((item) => Number(item.filmId) !== filmId);
      if (remainingReservations.length !== reservations.length) {
        await writeReservations(remainingReservations);
      }

      sendJson(res, 200, removed);
      return;
    }

    if (req.method === 'PUT') {
      let payload;
      try {
        payload = await parseBody(req);
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }

      const normalized = normalizeFilmPayload(payload);
      if (normalized.error) {
        sendJson(res, 400, { error: normalized.error });
        return;
      }

      films[index] = {
        ...films[index],
        ...normalized.value,
        updatedAt: new Date().toISOString()
      };

      await writeFilms(films);
      sendJson(res, 200, films[index]);
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, films[index]);
      return;
    }
  }

  sendJson(res, 404, { error: 'Not found' });
}

async function serveStatic(req, res, pathname) {
  if (pathname === '/' || pathname === '') {
    res.writeHead(302, { Location: '/Admin/html/main.html' });
    res.end();
    return;
  }

  if (!pathname.startsWith('/Admin/')) {
    sendText(res, 404, 'Not found');
    return;
  }

  const relativePath = pathname.replace(/^\/Admin\//, '');
  const filePath = path.join(ADMIN_DIR, relativePath);
  const safePath = path.normalize(filePath);

  if (!safePath.startsWith(ADMIN_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  try {
    const stat = await fs.stat(safePath);
    let finalPath = safePath;

    if (stat.isDirectory()) {
      finalPath = path.join(safePath, 'index.html');
    }

    const ext = path.extname(finalPath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
    const content = await fs.readFile(finalPath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store'
    });
    res.end(content);
  } catch {
    sendText(res, 404, 'Not found');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname);
      return;
    }

    await serveStatic(req, res, pathname);
  } catch (error) {
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

initDatabase();

server.listen(PORT, () => {
  console.log(`CinemaManager backend is running on http://localhost:${PORT}`);
  console.log('Frontend: http://localhost:' + PORT + '/Admin/html/main.html');
});
