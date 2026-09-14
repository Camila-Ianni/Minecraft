/**
 * Animación de destello rojo de daño al ser atacado (Minecraft Damage Red Flash)
 * @param {THREE.Group|THREE.Mesh} groupMesh 
 */
function flashRedDamageAnimation(groupMesh) {
    if (!groupMesh) return;
    groupMesh.traverse(child => {
        if (child.isMesh && child.material) {
            const originalMats = Array.isArray(child.material) ? child.material : [child.material];
            originalMats.forEach(mat => {
                if (mat && mat.color) {
                    mat.color.setHex(0xff3333);
                }
            });
            setTimeout(() => {
                originalMats.forEach(mat => {
                    if (mat && mat.color) {
                        mat.color.setHex(0xffffff);
                    }
                });
            }, 260);
        }
    });
}

function drawStrawberryBearSkinCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const bearBrown = '#a38466';
    const bearLight = '#cbb195';
    const hoodRed = '#e63956';
    const whiteDot = '#ffffff';
    const pinkEar = '#f7a8b8';
    const eyeDark = '#3a2c27';
    const noseDark = '#4a3731';
    const blushPink = '#ffb7c5';

    // Base body color
    ctx.fillStyle = bearBrown;
    ctx.fillRect(0, 0, 64, 64);

    // --- HEAD FRONT (x: 8, y: 8, w: 8, h: 8) --- Capucha roja bordeando la cara
    ctx.fillStyle = hoodRed;
    ctx.fillRect(8, 8, 8, 8);
    // Puntos blancos en la capucha roja
    ctx.fillStyle = whiteDot;
    ctx.fillRect(9, 8, 1, 1);
    ctx.fillRect(14, 8, 1, 1);
    ctx.fillRect(8, 11, 1, 1);
    ctx.fillRect(15, 11, 1, 1);

    // Cara de osito en el centro (área 6x6)
    ctx.fillStyle = bearBrown;
    ctx.fillRect(9, 9, 6, 6);

    // Parche claro del hocico (área 4x3)
    ctx.fillStyle = bearLight;
    ctx.fillRect(10, 11, 4, 3);

    // Ojos oscuros de osito
    ctx.fillStyle = eyeDark;
    ctx.fillRect(9, 11, 1, 1);
    ctx.fillRect(14, 11, 1, 1);

    // Nariz de osito
    ctx.fillStyle = noseDark;
    ctx.fillRect(11, 12, 2, 1);

    // Mejillas rosadas (Blush)
    ctx.fillStyle = blushPink;
    ctx.fillRect(9, 12, 1, 1);
    ctx.fillRect(14, 12, 1, 1);

    // --- HEAD TOP (x: 8, y: 0, w: 8, h: 8) --- Capucha roja superior con puntos
    ctx.fillStyle = hoodRed;
    ctx.fillRect(8, 0, 8, 8);
    ctx.fillStyle = whiteDot;
    ctx.fillRect(9, 1, 1, 1);
    ctx.fillRect(14, 2, 1, 1);
    ctx.fillRect(10, 5, 1, 1);
    ctx.fillRect(13, 6, 1, 1);

    // --- HEAD BACK (x: 24, y: 8, w: 8, h: 8) --- Capucha roja trasera
    ctx.fillStyle = hoodRed;
    ctx.fillRect(24, 8, 8, 8);
    ctx.fillStyle = whiteDot;
    ctx.fillRect(25, 9, 1, 1);
    ctx.fillRect(30, 10, 1, 1);
    ctx.fillRect(27, 13, 1, 1);

    // --- HEAD SIDES (x: 0/16, y: 8, w: 8, h: 8) --- Capucha roja lateral
    ctx.fillStyle = hoodRed;
    ctx.fillRect(0, 8, 8, 8);
    ctx.fillRect(16, 8, 8, 8);
    ctx.fillStyle = whiteDot;
    ctx.fillRect(2, 9, 1, 1);
    ctx.fillRect(5, 12, 1, 1);
    ctx.fillRect(18, 9, 1, 1);
    ctx.fillRect(21, 12, 1, 1);

    // --- TORSO FRONT (x: 20, y: 20, w: 8, h: 12) --- Traje de osito con panza clara
    ctx.fillStyle = bearBrown;
    ctx.fillRect(20, 20, 8, 12);
    ctx.fillStyle = bearLight;
    ctx.fillRect(21, 23, 6, 7); // Parche ovalado claro en el pecho

    // Torso Back & Sides
    ctx.fillStyle = bearBrown;
    ctx.fillRect(32, 20, 8, 12);
    ctx.fillRect(16, 20, 4, 12);
    ctx.fillRect(28, 20, 4, 12);
    ctx.fillRect(20, 16, 8, 4);
    ctx.fillRect(28, 16, 8, 4);

    // --- ARMS (x: 40, y: 20, w: 16, h: 12) ---
    ctx.fillStyle = bearBrown;
    ctx.fillRect(40, 20, 16, 12);
    ctx.fillStyle = bearLight;
    ctx.fillRect(44, 30, 4, 2);
    ctx.fillRect(52, 30, 4, 2);

    // --- LEGS (x: 0, y: 20, w: 16, h: 12) ---
    ctx.fillStyle = bearBrown;
    ctx.fillRect(0, 20, 16, 12);
    ctx.fillStyle = bearLight;
    ctx.fillRect(4, 30, 4, 2);
    ctx.fillRect(12, 30, 4, 2);

    return canvas;
}

function drawDefaultSteveSkinCanvas() {
    return drawStrawberryBearSkinCanvas();
}

/**
 * Crea un modelo 3D articulado de Personaje de Minecraft (Strawberry Bear Cute)
 * con mapeo de textura de Skin 64x64 e incorpora orejitas 3D de osito
 * @param {string} username - Nombre del jugador de Minecraft
 * @returns {THREE.Group} Grupo 3D con Cabeza, Torso, Brazos y Piernas articuladas
 */
function createMinecraftPlayer3DMesh(username = 'Steve') {
    const group = new THREE.Group();

    // Dimensiones proporcionales oficiales de Minecraft (Steve)
    const headGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);
    const torsoGeo = new THREE.BoxGeometry(0.48, 0.72, 0.24);
    const limbGeo = new THREE.BoxGeometry(0.24, 0.72, 0.24);

    // 1. Cabeza (Centro en y = 1.68)
    const headMesh = new THREE.Mesh(headGeo);
    headMesh.position.y = 1.68;

    // 🐻 Orejitas 3D de Osito Frutilla en la cabeza (Foto media_1788392306956.png)
    const earGeo = new THREE.BoxGeometry(0.12, 0.12, 0.10);
    const earMatOuter = new THREE.MeshLambertMaterial({ color: 0xa38466 });
    const earMatInner = new THREE.MeshLambertMaterial({ color: 0xf7a8b8 });

    const leftEar = new THREE.Group();
    leftEar.position.set(-0.20, 0.28, 0);
    const leftEarOuter = new THREE.Mesh(earGeo, earMatOuter);
    const leftEarInner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), earMatInner);
    leftEarInner.position.z = 0.04;
    leftEar.add(leftEarOuter);
    leftEar.add(leftEarInner);

    const rightEar = new THREE.Group();
    rightEar.position.set(0.20, 0.28, 0);
    const rightEarOuter = new THREE.Mesh(earGeo, earMatOuter);
    const rightEarInner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), earMatInner);
    rightEarInner.position.z = 0.04;
    rightEar.add(rightEarOuter);
    rightEar.add(rightEarInner);

    headMesh.add(leftEar);
    headMesh.add(rightEar);

    group.add(headMesh);

    // 2. Torso (Centro en y = 1.08)
    const torsoMesh = new THREE.Mesh(torsoGeo);
    torsoMesh.position.y = 1.08;
    group.add(torsoMesh);

    // 3. Brazo Derecho (Pivot en hombro y = 1.44)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.36, 1.44, 0);
    const rightArmMesh = new THREE.Mesh(limbGeo);
    rightArmMesh.position.y = -0.36;
    rightArmGroup.add(rightArmMesh);
    group.add(rightArmGroup);

    // 4. Brazo Izquierdo (Pivot en hombro y = 1.44)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.36, 1.44, 0);
    const leftArmMesh = new THREE.Mesh(limbGeo);
    leftArmMesh.position.y = -0.36;
    leftArmGroup.add(leftArmMesh);
    group.add(leftArmGroup);

    // 5. Pierna Derecha (Pivot en cadera y = 0.72)
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.12, 0.72, 0);
    const rightLegMesh = new THREE.Mesh(limbGeo);
    rightLegMesh.position.y = -0.36;
    rightLegGroup.add(rightLegMesh);
    group.add(rightLegGroup);

    // 6. Pierna Izquierda (Pivot en cadera y = 0.72)
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.12, 0.72, 0);
    const leftLegMesh = new THREE.Mesh(limbGeo);
    leftLegMesh.position.y = -0.36;
    leftLegGroup.add(leftLegMesh);
    group.add(leftLegGroup);

    group.userData = {
        username,
        head: headMesh,
        torso: torsoMesh,
        rightArm: rightArmGroup,
        leftArm: leftArmGroup,
        rightLeg: rightLegGroup,
        leftLeg: leftLegGroup,
        walkTimer: 0,
        lastX: 0,
        lastZ: 0,
        animateWalk: function(currentX, currentZ, delta) {
            const dx = currentX - (this.lastX || currentX);
            const dz = currentZ - (this.lastZ || currentZ);
            const dist = Math.sqrt(dx * dx + dz * dz);
            this.lastX = currentX;
            this.lastZ = currentZ;

            if (dist > 0.005) {
                this.walkTimer += (delta || 0.05) * 14;
                const angle = Math.sin(this.walkTimer) * 0.65;
                this.rightArm.rotation.x = angle;
                this.leftArm.rotation.x = -angle;
                this.rightLeg.rotation.x = -angle;
                this.leftLeg.rotation.x = angle;
            } else {
                this.rightArm.rotation.x = 0;
                this.leftArm.rotation.x = 0;
                this.rightLeg.rotation.x = 0;
                this.leftLeg.rotation.x = 0;
            }
        }
    };

    // Mapeo de 64x64 Skin PNG a materiales de bloques Three.js
    const applySkinToMesh = (skinImgSource) => {
        try {
            const getBoxMaterials = (coords) => {
                const order = ['right', 'left', 'top', 'bottom', 'front', 'back'];
                return order.map(face => {
                    const [x, y, w, h] = coords[face];
                    const canvas = document.createElement('canvas');
                    canvas.width = w * 4;
                    canvas.height = h * 4;
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(skinImgSource, x, y, w, h, 0, 0, w * 4, h * 4);

                    const tex = new THREE.CanvasTexture(canvas);
                    tex.magFilter = THREE.NearestFilter;
                    tex.minFilter = THREE.NearestFilter;
                    return new THREE.MeshLambertMaterial({ map: tex, transparent: true });
                });
            };

            const headMats = getBoxMaterials({
                right: [0, 8, 8, 8], left: [16, 8, 8, 8],
                top: [8, 0, 8, 8], bottom: [16, 0, 8, 8],
                front: [8, 8, 8, 8], back: [24, 8, 8, 8]
            });

            const torsoMats = getBoxMaterials({
                right: [16, 20, 4, 12], left: [28, 20, 4, 12],
                top: [20, 16, 8, 4], bottom: [28, 16, 8, 4],
                front: [20, 20, 8, 12], back: [32, 20, 8, 12]
            });

            const rightArmMats = getBoxMaterials({
                right: [40, 20, 4, 12], left: [48, 20, 4, 12],
                top: [44, 16, 4, 4], bottom: [48, 16, 4, 4],
                front: [44, 20, 4, 12], back: [52, 20, 4, 12]
            });

            const leftArmMats = getBoxMaterials({
                right: [40, 20, 4, 12], left: [48, 20, 4, 12],
                top: [44, 16, 4, 4], bottom: [48, 16, 4, 4],
                front: [44, 20, 4, 12], back: [52, 20, 4, 12]
            });

            const legMats = getBoxMaterials({
                right: [0, 20, 4, 12], left: [8, 20, 4, 12],
                top: [4, 16, 4, 4], bottom: [8, 16, 4, 4],
                front: [4, 20, 4, 12], back: [12, 20, 4, 12]
            });

            headMesh.material = headMats;
            torsoMesh.material = torsoMats;
            rightArmMesh.material = rightArmMats;
            leftArmMesh.material = leftArmMats;
            rightLegMesh.material = legMats;
            leftLegMesh.material = legMats;
        } catch (e) {
            console.warn('[Skin 3D] Error aplicando skin:', e);
        }
    };

    // 1. Aplicar textura de Steve procedimental de forma inmediata
    const defaultCanvas = drawDefaultSteveSkinCanvas();
    applySkinToMesh(defaultCanvas);

    // 2. Cargar Skin real remota de la API
    const skinImg = new Image();
    skinImg.crossOrigin = 'Anonymous';
    skinImg.onload = () => {
        applySkinToMesh(skinImg);
    };

    const cleanUser = encodeURIComponent(username.trim() || 'Steve');
    skinImg.src = `https://minotar.net/skin/${cleanUser}`;

    return group;
}

class MinecraftMultiplayer {
    constructor() {
        this.socket = null;
        this.myPlayerId = null;
        this.username = 'Steve';
        this.skinAvatarUrl = 'https://mineskin.eu/avatar/Steve/100.png';
        this.remotePlayers = new Map(); // id -> { mesh, username }
        this.isConnected = false;
        this.lastMoveSent = 0;
        this.eventsInitialized = false;

        setTimeout(() => this.setupChatAndNickEvents(), 100);
    }

    init(username = 'Steve') {
        this.username = username || 'Steve';
        this.skinAvatarUrl = `https://mineskin.eu/avatar/${encodeURIComponent(this.username)}/100.png`;

        this.setupChatAndNickEvents();

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;

        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                this.isConnected = true;
                console.log('[Multiplayer] Conectado al Servidor WebSocket Nativo');

                // Enviar evento de unión
                this.send({
                    type: 'join',
                    username: this.username,
                    skinUrl: this.skinAvatarUrl
                });

                this.updateHudPlayerCount();
            };

            this.socket.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    this.handleMessage(msg);
                } catch (e) {
                    console.error('[Multiplayer] Error al parsear mensaje:', e);
                }
            };

            this.socket.onclose = () => {
                this.isConnected = false;
                if (window.isMultiplayerMode) {
                    console.warn('[Multiplayer] Desconectado del Servidor WebSocket. Reintentando en 3s...');
                    setTimeout(() => {
                        if (window.isMultiplayerMode) this.init(this.username);
                    }, 3000);
                }
            };

            this.socket.onerror = (err) => {
                console.error('[Multiplayer] Error de Socket:', err);
            };

        } catch (e) {
            console.error('[Multiplayer] No se pudo inicializar WebSocket nativo:', e);
        }
    }

    disconnect() {
        this.isConnected = false;
        if (this.socket) {
            try { this.socket.close(); } catch(e) {}
            this.socket = null;
        }
        if (this.remotePlayers) {
            this.remotePlayers.forEach((val, id) => this.removeRemotePlayer(id));
            this.remotePlayers.clear();
        }
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    handleMessage(msg) {
        switch (msg.type) {
            case 'welcome': {
                this.myPlayerId = msg.playerId;
                console.log(`[Multiplayer] Bienvenido! Mi ID es: ${this.myPlayerId}`);

                // 1. Limpiar jugadores remotos anteriores
                this.remotePlayers.forEach((val, id) => this.removeRemotePlayer(id));

                // 2. Cargar jugadores existentes EXCLUYÉNDOME A MÍ MISMO
                if (Array.isArray(msg.players)) {
                    msg.players.forEach(p => {
                        if (p.id && p.id !== this.myPlayerId) {
                            this.addRemotePlayer(p);
                        }
                    });
                }

                // 3. Aplicar bloques compartidos del servidor
                if (Array.isArray(msg.worldBlocks) && window.minecraftSandbox) {
                    msg.worldBlocks.forEach(b => {
                        window.minecraftSandbox.setBlock(b.x, b.y, b.z, b.type, false);
                    });
                }

                this.updateHudPlayerCount(msg.count);
                break;
            }

            case 'playerCountUpdate': {
                if (Array.isArray(msg.players)) {
                    msg.players.forEach(p => {
                        if (p.id && p.id !== this.myPlayerId) {
                            this.addRemotePlayer(p);
                        }
                    });
                }
                this.updateHudPlayerCount(msg.count);
                break;
            }

            case 'playerJoined': {
                if (msg.player && msg.player.id && msg.player.id !== this.myPlayerId) {
                    this.addRemotePlayer(msg.player);
                    this.addChatMessage('Servidor', `¡${msg.player.username} se ha unido al mundo multijugador!`);
                }
                this.updateHudPlayerCount(msg.count);
                break;
            }

            case 'playerMoved': {
                if (msg.playerId && msg.playerId !== this.myPlayerId) {
                    this.moveRemotePlayer(msg.playerId, msg.x, msg.y, msg.z, msg.rotationY);
                }
                break;
            }

            case 'playerLeft': {
                if (msg.playerId) {
                    const p = this.remotePlayers.get(msg.playerId);
                    if (p) {
                        this.addChatMessage('Servidor', `¡${p.username} ha salido del juego!`);
                        this.removeRemotePlayer(msg.playerId);
                    }
                }
                this.updateHudPlayerCount(msg.count);
                break;
            }

            case 'blockPlaced': {
                if (window.minecraftSandbox && typeof msg.x === 'number') {
                    window.minecraftSandbox.setBlock(msg.x, msg.y, msg.z, msg.blockType, false);
                }
                break;
            }

            case 'blockBroken': {
                if (window.minecraftSandbox && typeof msg.x === 'number') {
                    window.minecraftSandbox.removeBlock(msg.x, msg.y, msg.z, false);
                }
                break;
            }

            case 'playerAttacked': {
                if (msg.targetId === this.myPlayerId) {
                    // ¡El jugador local recibió el ataque!
                    if (window.minecraftSandbox && typeof window.minecraftSandbox.receiveAttack === 'function') {
                        window.minecraftSandbox.receiveAttack(msg.damage || 1, msg.kx || 0, msg.kz || 0);
                    }
                } else {
                    // Un jugador remoto recibió el ataque -> destello rojo y empuje
                    const p = this.remotePlayers.get(msg.targetId);
                    if (p && p.mesh) {
                        flashRedDamageAnimation(p.mesh);
                        p.mesh.position.x += (msg.kx || 0) * 0.4;
                        p.mesh.position.z += (msg.kz || 0) * 0.4;
                    }
                }
                break;
            }

            case 'chatMessage': {
                this.addChatMessage(msg.sender, msg.text);
                break;
            }
        }
    }

    sendPlayerAttack(targetId, damage = 1, kx = 0, kz = 0) {
        if (!targetId) return;
        this.send({
            type: 'playerAttack',
            targetId,
            damage,
            kx,
            kz
        });
    }

    sendMove(x, y, z, rotationY, rotationX) {
        const now = Date.now();
        if (now - this.lastMoveSent > 50) { // Limit a 20 FPS para alta eficiencia de red
            this.lastMoveSent = now;
            this.send({
                type: 'playerMove',
                x, y, z, rotationY, rotationX
            });
        }
    }

    sendBlockPlace(x, y, z, blockType) {
        this.send({
            type: 'blockPlace',
            x, y, z, blockType
        });
    }

    sendBlockBreak(x, y, z) {
        this.send({
            type: 'blockBreak',
            x, y, z
        });
    }

    sendChat(text) {
        if (text && text.trim()) {
            this.send({
                type: 'chatMessage',
                text: text.trim()
            });
        }
    }

    addRemotePlayer(p) {
        if (!p || !p.id || p.id === this.myPlayerId) return;

        let existing = this.remotePlayers.get(p.id);
        if (!existing) {
            existing = {
                id: p.id,
                mesh: null,
                username: p.username || 'Steve',
                x: p.x || 0,
                y: p.y || 12,
                z: p.z || 0
            };
            this.remotePlayers.set(p.id, existing);
        } else {
            existing.username = p.username || existing.username;
            existing.x = typeof p.x === 'number' ? p.x : existing.x;
            existing.y = typeof p.y === 'number' ? p.y : existing.y;
            existing.z = typeof p.z === 'number' ? p.z : existing.z;
        }

        if (!existing.mesh && window.minecraftSandbox && window.minecraftSandbox.scene) {
            const group = createMinecraftPlayer3DMesh(existing.username);
            group.position.set(existing.x, existing.y, existing.z);
            window.minecraftSandbox.scene.add(group);
            existing.mesh = group;
        }
    }

    attachMeshesIfPending() {
        if (!window.minecraftSandbox || !window.minecraftSandbox.scene) return;
        this.remotePlayers.forEach((p) => {
            if (!p.mesh) {
                const group = createMinecraftPlayer3DMesh(p.username || 'Steve');
                group.position.set(p.x || 0, p.y || 12, p.z || 0);
                window.minecraftSandbox.scene.add(group);
                p.mesh = group;
            }
        });
    }

    moveRemotePlayer(id, x, y, z, rotationY) {
        const p = this.remotePlayers.get(id);
        if (p) {
            p.x = x;
            p.y = y;
            p.z = z;
            if (!p.mesh && window.minecraftSandbox && window.minecraftSandbox.scene) {
                this.attachMeshesIfPending();
            }
            if (p.mesh) {
                p.mesh.position.set(x, y, z);
                if (typeof rotationY === 'number') {
                    p.mesh.rotation.y = rotationY;
                }
                if (p.mesh.userData && typeof p.mesh.userData.animateWalk === 'function') {
                    p.mesh.userData.animateWalk(x, z, 0.05);
                }
            }
        }
    }

    removeRemotePlayer(id) {
        const p = this.remotePlayers.get(id);
        if (p) {
            if (p.mesh && window.minecraftSandbox && window.minecraftSandbox.scene) {
                window.minecraftSandbox.scene.remove(p.mesh);
            }
            this.remotePlayers.delete(id);
        }
    }

    updateHudPlayerCount(explicitCount = null) {
        let count = 1;
        if (typeof explicitCount === 'number' && explicitCount > 0) {
            count = explicitCount;
        } else {
            count = this.remotePlayers.size + (this.isConnected ? 1 : 0);
        }

        const label = document.getElementById('mp-player-count');
        if (label) {
            label.textContent = `🎮 JUGADORES: ${count} / 8`;
        }

        const serverListBadge = document.getElementById('server-list-count-badge');
        if (serverListBadge) {
            serverListBadge.textContent = `👥 ${count} / 8`;
        }

        const avatarImg = document.getElementById('player-skin-avatar');
        if (avatarImg && this.username) {
            avatarImg.src = `https://mineskin.eu/avatar/${encodeURIComponent(this.username)}/100.png`;
        }

        this.attachMeshesIfPending();
    }

    addChatMessage(sender, text) {
        const chatBox = document.getElementById('mp-chat-messages');
        if (chatBox) {
            const msgEl = document.createElement('div');
            msgEl.className = 'mp-chat-item';
            msgEl.innerHTML = `<span class="mp-sender">${sender}:</span> <span class="mp-text">${text}</span>`;
            chatBox.appendChild(msgEl);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    setupChatAndNickEvents() {
        if (this.eventsInitialized) return;
        this.eventsInitialized = true;

        const nickBtn = document.getElementById('mp-nick-btn');
        const nickInput = document.getElementById('mp-nick-input');
        if (nickBtn && nickInput) {
            const updateNick = () => {
                const val = nickInput.value.trim();
                if (val) {
                    this.username = val;
                    this.send({ type: 'join', username: this.username, skinUrl: `https://mineskin.eu/avatar/${encodeURIComponent(this.username)}/100.png` });
                    this.updateHudPlayerCount();
                    this.addChatMessage('Sistema', `Nick actualizado a "${this.username}". Skin de MineSkin cargada.`);
                    nickInput.blur();
                    if (window.minecraftSandbox) window.minecraftSandbox.requestPointerLock();
                }
            };
            nickBtn.addEventListener('click', updateNick);
            nickInput.addEventListener('keydown', (e) => {
                e.stopPropagation();
                if (e.key === 'Enter') updateNick();
            });
            nickInput.addEventListener('keyup', (e) => e.stopPropagation());
        }

        const chatForm = document.getElementById('mp-chat-form');
        const chatInput = document.getElementById('mp-chat-input');
        if (chatForm && chatInput) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (text) {
                    this.sendChat(text);
                    chatInput.value = '';
                    chatInput.blur();
                    if (window.minecraftSandbox) {
                        window.minecraftSandbox.requestPointerLock();
                    }
                }
            });

            chatInput.addEventListener('keydown', (e) => {
                e.stopPropagation();
                if (e.key === 'Escape') {
                    chatInput.blur();
                    if (window.minecraftSandbox) {
                        window.minecraftSandbox.requestPointerLock();
                    }
                }
            });
            chatInput.addEventListener('keyup', (e) => e.stopPropagation());
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.minecraftMultiplayer) {
        window.minecraftMultiplayer.setupChatAndNickEvents();
    }
});

window.minecraftMultiplayer = new MinecraftMultiplayer();
