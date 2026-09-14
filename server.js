/**
 * Servidor HTTP y WebSocket 100% Nativo de Node.js (server.js)
 * Provee servicio de archivos estáticos y WebSocket real-time multiplayer sin dependencias externas.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

// Tipos MIME para servidor estático
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

// Estado Global del Mundo Multijugador en Memoria
const players = new Map(); // socket -> playerData
const worldBlocks = new Map(); // "x,y,z" -> blockTypeId

/**
 * 1. Servidor HTTP Estático Nativo
 */
const server = http.createServer((req, res) => {
    let reqUrl = decodeURI(req.url.split('?')[0]);
    if (reqUrl === '/') reqUrl = '/index.html';
    const filePath = path.join(__dirname, reqUrl.replace(/^[\/\\]+/, ''));

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
});

/**
 * 2. Protocolo WebSocket Nativo de Node.js (Handshake & Framing)
 */
server.on('upgrade', (req, socket) => {
    const key = req.headers['sec-websocket-key'];
    if (!key) {
        socket.destroy();
        return;
    }

    const acceptKey = crypto.createHash('sha1')
        .update(key + GUID)
        .digest('base64');

    const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`
    ];

    socket.write(headers.join('\r\n') + '\r\n\r\n');
    initWebSocketClient(socket);
});

/**
 * Construye una trama de texto WebSocket no enmascarada
 */
function buildTextFrame(text) {
    const payload = Buffer.from(text, 'utf-8');
    const length = payload.length;
    let header;

    if (length <= 125) {
        header = Buffer.alloc(2);
        header[0] = 0x81; // FIN + Text Opcode
        header[1] = length;
    } else if (length <= 65535) {
        header = Buffer.alloc(4);
        header[0] = 0x81;
        header[1] = 126;
        header.writeUInt16BE(length, 2);
    } else {
        header = Buffer.alloc(10);
        header[0] = 0x81;
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(length), 2);
    }

    return Buffer.concat([header, payload]);
}

/**
 * Parsea tramas WebSocket entrantes desde el navegador
 */
function parseFrames(buffer) {
    const frames = [];
    let offset = 0;

    while (offset < buffer.length) {
        if (buffer.length - offset < 2) break;
        const firstByte = buffer[offset];
        const secondByte = buffer[offset + 1];
        const opcode = firstByte & 0x0f;
        const isMasked = (secondByte & 0x80) === 0x80;
        let payloadLen = secondByte & 0x7f;
        let headLen = 2;

        if (payloadLen === 126) {
            if (buffer.length - offset < 4) break;
            payloadLen = buffer.readUInt16BE(offset + 2);
            headLen = 4;
        } else if (payloadLen === 127) {
            if (buffer.length - offset < 10) break;
            payloadLen = Number(buffer.readBigUInt64BE(offset + 2));
            headLen = 10;
        }

        const maskLen = isMasked ? 4 : 0;
        if (buffer.length - offset < headLen + maskLen + payloadLen) break;

        let payload = buffer.slice(offset + headLen + maskLen, offset + headLen + maskLen + payloadLen);
        if (isMasked) {
            const mask = buffer.slice(offset + headLen, offset + headLen + 4);
            const unmasked = Buffer.alloc(payload.length);
            for (let i = 0; i < payload.length; i++) {
                unmasked[i] = payload[i] ^ mask[i % 4];
            }
            payload = unmasked;
        }

        frames.push({ opcode, payload });
        offset += headLen + maskLen + payloadLen;
    }

    return { frames, remaining: buffer.slice(offset) };
}

/**
 * Difunde un mensaje a todos o a un subconjunto de clientes
 */
function broadcast(msgObj, excludeSocket = null) {
    const frame = buildTextFrame(JSON.stringify(msgObj));
    for (const [s] of players) {
        if (s !== excludeSocket && !s.destroyed) {
            try { s.write(frame); } catch (e) {}
        }
    }
}

/**
 * Manejador de Conexión de Jugador
 */
function initWebSocketClient(socket) {
    const id = 'player_' + Math.random().toString(36).substr(2, 8);
    const playerData = {
        id,
        username: 'Steve',
        x: 0,
        y: 12,
        z: 0,
        rotationY: 0,
        rotationX: 0,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };

    players.set(socket, playerData);
    let rxBuffer = Buffer.alloc(0);

    socket.on('data', (chunk) => {
        rxBuffer = Buffer.concat([rxBuffer, chunk]);
        const { frames, remaining } = parseFrames(rxBuffer);
        rxBuffer = remaining;

        for (const frame of frames) {
            if (frame.opcode === 0x08) { // Close opcode
                socket.end();
                return;
            }

            if (frame.opcode === 0x01) { // Text opcode
                try {
                    const msg = JSON.parse(frame.payload.toString('utf-8'));
                    handleClientMessage(socket, msg);
                } catch (e) {}
            }
        }
    });

function getActivePlayersList() {
    return Array.from(players.values()).map(p => ({
        id: p.id,
        username: p.username,
        x: p.x,
        y: p.y,
        z: p.z,
        rotationY: p.rotationY,
        rotationX: p.rotationX,
        color: p.color,
        skinUrl: p.skinUrl
    }));
}

function broadcastPlayerState() {
    broadcast({
        type: 'playerCountUpdate',
        count: players.size,
        players: getActivePlayersList()
    });
}

    socket.on('close', () => {
        const p = players.get(socket);
        if (p) {
            players.delete(socket);
            broadcast({ type: 'playerLeft', playerId: p.id, count: players.size });
            broadcastPlayerState();
            console.log(`[WebSocket] Jugador desconectado: ${p.username} (${p.id})`);
        }
    });

    socket.on('error', () => {
        socket.destroy();
    });
}

/**
 * Lógica Servidor Autoritativo de Eventos Multijugador
 */
function handleClientMessage(socket, msg) {
    const player = players.get(socket);
    if (!player) return;

    switch (msg.type) {
        case 'join': {
            if (msg.username) player.username = String(msg.username).trim().substring(0, 16);
            if (msg.skinUrl) player.skinUrl = String(msg.skinUrl);

            const activePlayers = getActivePlayersList();

            const initialWorld = Array.from(worldBlocks.entries()).map(([key, type]) => {
                const [x, y, z] = key.split(',').map(Number);
                return { x, y, z, type };
            });

            socket.write(buildTextFrame(JSON.stringify({
                type: 'welcome',
                playerId: player.id,
                count: players.size,
                players: activePlayers,
                worldBlocks: initialWorld
            })));

            // 2. Notificar a los demás jugadores
            broadcast({
                type: 'playerJoined',
                count: players.size,
                player: {
                    id: player.id,
                    username: player.username,
                    x: player.x,
                    y: player.y,
                    z: player.z,
                    rotationY: player.rotationY,
                    rotationX: player.rotationX,
                    color: player.color,
                    skinUrl: player.skinUrl
                }
            }, socket);

            broadcastPlayerState();
            console.log(`[WebSocket] Jugador conectado: ${player.username} (${player.id})`);
            break;
        }

        case 'playerMove': {
            // Validación de posición
            if (typeof msg.x === 'number') player.x = msg.x;
            if (typeof msg.y === 'number') player.y = msg.y;
            if (typeof msg.z === 'number') player.z = msg.z;
            if (typeof msg.rotationY === 'number') player.rotationY = msg.rotationY;
            if (typeof msg.rotationX === 'number') player.rotationX = msg.rotationX;

            broadcast({
                type: 'playerMoved',
                playerId: player.id,
                x: player.x,
                y: player.y,
                z: player.z,
                rotationY: player.rotationY,
                rotationX: player.rotationX
            }, socket);
            break;
        }

        case 'blockPlace': {
            if (typeof msg.x === 'number' && typeof msg.y === 'number' && typeof msg.z === 'number' && msg.blockType) {
                const key = `${msg.x},${msg.y},${msg.z}`;
                worldBlocks.set(key, msg.blockType);
                broadcast({
                    type: 'blockPlaced',
                    x: msg.x,
                    y: msg.y,
                    z: msg.z,
                    blockType: msg.blockType,
                    placedBy: player.username
                });
            }
            break;
        }

        case 'playerAttack': {
            if (msg.targetId) {
                broadcast({
                    type: 'playerAttacked',
                    targetId: msg.targetId,
                    attackerId: player.id,
                    attackerName: player.username,
                    damage: msg.damage || 1,
                    kx: msg.kx || 0,
                    kz: msg.kz || 0
                });
            }
            break;
        }

        case 'blockBreak': {
            if (typeof msg.x === 'number' && typeof msg.y === 'number' && typeof msg.z === 'number') {
                const key = `${msg.x},${msg.y},${msg.z}`;
                worldBlocks.delete(key);
                broadcast({
                    type: 'blockBroken',
                    x: msg.x,
                    y: msg.y,
                    z: msg.z,
                    brokenBy: player.username
                });
            }
            break;
        }

        case 'chatMessage': {
            if (msg.text) {
                const text = String(msg.text).substring(0, 100);
                broadcast({
                    type: 'chatMessage',
                    sender: player.username,
                    text
                });
            }
            break;
        }
    }
}

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 Servidor Minecraft 3D Multijugador Activo`);
    console.log(`🌐 HTTP: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    console.log(`====================================================`);
});
