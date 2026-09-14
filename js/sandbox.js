/**
 * Motor Minecraft 3D Voxel, Herramientas, Fauna/Animales 3D y Física de Personaje (js/sandbox.js)
 * Proporciona un modo de juego real con:
 * - Física realista de personaje (Gravedad, Caminata sobre el terreno, Salto con ESPACIO para superar bloques)
 * - Animales 3D Voxel interactivos (Vacas, Cerdos, Ovejas, Lobos, Pollos) consumiendo datos de la API pública
 * - Herramientas en primera persona (Espadas, Picos, Palas, Hachas) con animación de balanceo
 * - Mochila e Inventario Creativo intercambiable con la tecla E
 * - Terreno 3D procedural extenso con colinas, árboles y minerales
 * - Hotbar de 9 ranuras y catálogo de materiales
 */

/**
 * Clase para renderizar y animar animales 3D Voxel en el mundo de Minecraft
 */
class VoxelAnimal {
    constructor(type, x, y, z, apiData = null) {
        this.type = type;
        this.apiData = apiData;
        this.mesh = new THREE.Group();
        this.mesh.position.set(x + 0.5, y, z + 0.5);
        this.targetRotation = Math.random() * Math.PI * 2;
        this.walkTimer = Math.random() * 10;
        this.moveTimer = 0;
        this.isWalking = false;
        this.speed = 0.9 + Math.random() * 0.4;
        this.legs = [];
        this.head = null;

        this.buildMesh();
    }

    createHeadFaceTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        if (this.type === 'cow') {
            // Vaca Rosa Cute (Pink Mooshroom Cow - Foto 1)
            ctx.fillStyle = '#ffb3cb'; // Rosa base
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#ffffff'; // Manchas blancas
            ctx.fillRect(0, 0, 4, 4);
            ctx.fillRect(12, 0, 4, 3);
            ctx.fillStyle = '#ffffff'; // Ojos
            ctx.fillRect(2, 5, 3, 3);
            ctx.fillRect(11, 5, 3, 3);
            ctx.fillStyle = '#000000'; // Pupilas
            ctx.fillRect(3, 6, 2, 2);
            ctx.fillRect(11, 6, 2, 2);
            ctx.fillStyle = '#c24b74'; // Hocico rosado oscuro
            ctx.fillRect(3, 9, 10, 6);
            ctx.fillStyle = '#7a2040'; // Fosas nasales
            ctx.fillRect(4, 11, 2, 2);
            ctx.fillRect(10, 11, 2, 2);
        } else if (this.type === 'pig') {
            // Cerdo Cute con Corona de Flores (Foto 2)
            ctx.fillStyle = '#ffa0be'; // Rosa cerdo
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#ffffff'; // Ojos
            ctx.fillRect(2, 5, 3, 3);
            ctx.fillRect(11, 5, 3, 3);
            ctx.fillStyle = '#000000';
            ctx.fillRect(3, 6, 2, 2);
            ctx.fillRect(11, 6, 2, 2);
            ctx.fillStyle = '#e91e63'; // Hocico rosa encendido
            ctx.fillRect(4, 9, 8, 5);
            ctx.fillStyle = '#880e4f'; // Fosas nasales
            ctx.fillRect(5, 11, 2, 2);
            ctx.fillRect(9, 11, 2, 2);
            // Corona de flores en la frente
            ctx.fillStyle = '#4caf50'; // Hojas verdes
            ctx.fillRect(0, 1, 16, 2);
            ctx.fillStyle = '#ff69b4'; // Flores rosadas
            ctx.fillRect(2, 0, 3, 2);
            ctx.fillRect(7, 0, 3, 2);
            ctx.fillRect(12, 0, 3, 2);
            ctx.fillStyle = '#ffffff'; // Flores blancas
            ctx.fillRect(4, 0, 2, 1);
            ctx.fillRect(10, 0, 2, 1);
        } else if (this.type === 'sheep') {
            // Oveja Cute con Flores de Cerezo (Sakura - Foto 5)
            ctx.fillStyle = '#fce4ec'; // Piel de cara rosada suave
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#ffffff'; // Lana blanca en frente
            ctx.fillRect(0, 0, 16, 5);
            // Flores de cerezo en el pelo
            ctx.fillStyle = '#ff69b4';
            ctx.fillRect(2, 1, 3, 3);
            ctx.fillRect(11, 1, 3, 3);
            ctx.fillStyle = '#ffffff'; // Ojos
            ctx.fillRect(2, 6, 3, 3);
            ctx.fillRect(11, 6, 3, 3);
            ctx.fillStyle = '#000000';
            ctx.fillRect(3, 7, 2, 2);
            ctx.fillRect(11, 7, 2, 2);
            ctx.fillStyle = '#f48fb1'; // Mechas/Cheeks rosados
            ctx.fillRect(1, 9, 3, 2);
            ctx.fillRect(12, 9, 3, 2);
            ctx.fillStyle = '#e91e63'; // Hocico
            ctx.fillRect(6, 11, 4, 3);
        } else if (this.type === 'wolf') {
            // Lobo/Perro Minecraft Cute (Foto 4)
            ctx.fillStyle = '#e0e0e0'; // Pelaje gris claro
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#ffffff'; // Mechas blancas alrededor de ojos
            ctx.fillRect(2, 4, 4, 4);
            ctx.fillRect(10, 4, 4, 4);
            ctx.fillStyle = '#111111'; // Ojos oscuros cute
            ctx.fillRect(3, 5, 2, 2);
            ctx.fillRect(11, 5, 2, 2);
            ctx.fillStyle = '#efebe9'; // Hocico beige claro
            ctx.fillRect(4, 9, 8, 6);
            ctx.fillStyle = '#212121'; // Nariz negra
            ctx.fillRect(6, 9, 4, 3);
        } else if (this.type === 'chicken') {
            // Patito / Pollito Cute Amarillo (Foto 3)
            ctx.fillStyle = '#ffee55'; // Amarillo pollito brillante
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#ffb74d'; // Sombrear mejillas
            ctx.fillRect(0, 12, 16, 4);
            ctx.fillStyle = '#000000'; // Ojos grandes cute
            ctx.fillRect(2, 4, 3, 4);
            ctx.fillRect(11, 4, 3, 4);
            ctx.fillStyle = '#ffffff'; // Brillo en ojos
            ctx.fillRect(3, 4, 1, 1);
            ctx.fillRect(12, 4, 1, 1);
            ctx.fillStyle = '#b78103'; // Pico marrón-naranja sobresaliente
            ctx.fillRect(4, 9, 8, 4);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        return tex;
    }

    createBodyTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        let baseColor = '#ffb3cb';
        if (this.type === 'cow') baseColor = '#ffb3cb'; // Rosa vaca
        else if (this.type === 'pig') baseColor = '#ffa0be'; // Rosa cerdo
        else if (this.type === 'sheep') baseColor = '#ffffff'; // Lana blanca oveja
        else if (this.type === 'wolf') baseColor = '#e0e0e0'; // Gris lobo
        else if (this.type === 'chicken') baseColor = '#ffee55'; // Amarillo pollo

        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 16, 16);

        if (this.type === 'cow') {
            ctx.fillStyle = '#ffffff'; // Manchas blancas de la vaca rosa
            ctx.fillRect(1, 2, 5, 5);
            ctx.fillRect(8, 7, 6, 6);
            ctx.fillRect(9, 1, 5, 4);
            ctx.fillRect(2, 10, 4, 4);
        } else if (this.type === 'sheep') {
            // Estampado de flores de cerezo (Sakura Pink Flowers) en la lana de la oveja (Foto 5)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#ff69b4'; // Pétalos de flor rosa
            // Flor 1
            ctx.fillRect(3, 2, 3, 1); ctx.fillRect(3, 4, 3, 1); ctx.fillRect(2, 3, 1, 3); ctx.fillRect(4, 3, 1, 3);
            ctx.fillStyle = '#f48fb1'; ctx.fillRect(3, 3, 1, 1);
            // Flor 2
            ctx.fillStyle = '#ff69b4';
            ctx.fillRect(10, 8, 3, 1); ctx.fillRect(10, 10, 3, 1); ctx.fillRect(9, 9, 1, 3); ctx.fillRect(11, 9, 1, 3);
            ctx.fillStyle = '#f48fb1'; ctx.fillRect(10, 9, 1, 1);
            // Flor 3
            ctx.fillStyle = '#ff69b4';
            ctx.fillRect(2, 11, 3, 1); ctx.fillRect(2, 13, 3, 1); ctx.fillRect(1, 12, 1, 3); ctx.fillRect(3, 12, 1, 3);
        } else if (this.type === 'chicken') {
            ctx.fillStyle = '#ffb74d'; // Degradado barriga inferior
            ctx.fillRect(0, 12, 16, 4);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        return tex;
    }

    buildMesh() {
        let bodyColor = 0xffb3cb;
        let headColor = 0xffb3cb;
        let legColor = 0x663344;
        let bodySize = [0.95, 0.75, 1.3];
        let headSize = [0.5, 0.5, 0.5];
        let legSize = [0.22, 0.6, 0.22];

        if (this.type === 'cow') {
            bodyColor = 0xffb3cb;
            headColor = 0xffb3cb;
            legColor = 0xff9ec1;
            bodySize = [0.95, 0.75, 1.3];
            headSize = [0.5, 0.5, 0.5];
            legSize = [0.22, 0.6, 0.22];
        } else if (this.type === 'pig') {
            bodyColor = 0xffa0be;
            headColor = 0xffa0be;
            legColor = 0xf48fb1;
            bodySize = [0.85, 0.65, 1.1];
            headSize = [0.5, 0.5, 0.5];
            legSize = [0.2, 0.45, 0.2];
        } else if (this.type === 'sheep') {
            bodyColor = 0xffffff;
            headColor = 0xfce4ec;
            legColor = 0xd7ccc8;
            bodySize = [0.95, 0.75, 1.25];
            headSize = [0.5, 0.5, 0.5];
            legSize = [0.22, 0.6, 0.22];
        } else if (this.type === 'wolf') {
            bodyColor = 0xe0e0e0;
            headColor = 0xe0e0e0;
            legColor = 0xbdbdbd;
            bodySize = [0.6, 0.55, 0.9];
            headSize = [0.48, 0.48, 0.48];
            legSize = [0.18, 0.5, 0.18];
        } else if (this.type === 'chicken') {
            bodyColor = 0xffee55;
            headColor = 0xffee55;
            legColor = 0x8d6e63;
            bodySize = [0.48, 0.48, 0.55];
            headSize = [0.38, 0.38, 0.38];
            legSize = [0.08, 0.32, 0.08];
        }

        const faceTex = this.createHeadFaceTexture();
        const bodyTex = this.createBodyTexture();

        const bodyMat = new THREE.MeshLambertMaterial({ map: bodyTex });
        const headSideMat = new THREE.MeshLambertMaterial({ color: headColor });
        const headFrontMat = new THREE.MeshLambertMaterial({ map: faceTex });
        const legMat = new THREE.MeshLambertMaterial({ color: legColor });

        const headMaterials = [
            headSideMat, // Derecha
            headSideMat, // Izquierda
            headSideMat, // Arriba
            headSideMat, // Abajo
            headFrontMat, // Frente
            headSideMat  // Atrás
        ];

        // 1. Cuerpo
        const bodyGeo = new THREE.BoxGeometry(bodySize[0], bodySize[1], bodySize[2]);
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.position.y = legSize[1] + bodySize[1] / 2;
        this.mesh.add(bodyMesh);

        // 2. Cabeza
        const headGeo = new THREE.BoxGeometry(headSize[0], headSize[1], headSize[2]);
        this.head = new THREE.Mesh(headGeo, headMaterials);
        this.head.position.set(0, legSize[1] + bodySize[1] + headSize[1] * 0.15, bodySize[2] / 2 + headSize[2] / 2);
        this.mesh.add(this.head);

        // 3. DETALLES EXCLUSIVOS SEGÚN LAS FOTOS DEL USUARIO:

        if (this.type === 'cow') {
            // Vaca Rosa: Cuernos grises
            const hornGeo = new THREE.BoxGeometry(0.08, 0.2, 0.08);
            const hornMat = new THREE.MeshLambertMaterial({ color: 0x999999 });
            const leftHorn = new THREE.Mesh(hornGeo, hornMat);
            leftHorn.position.set(-headSize[0] / 2 - 0.04, headSize[1] / 3, 0);
            const rightHorn = new THREE.Mesh(hornGeo, hornMat);
            rightHorn.position.set(headSize[0] / 2 + 0.04, headSize[1] / 3, 0);
            this.head.add(leftHorn);
            this.head.add(rightHorn);

            // Hocico 3D sobresaliente rosa oscuro
            const snoutGeo = new THREE.BoxGeometry(0.44, 0.22, 0.18);
            const snoutMat = new THREE.MeshLambertMaterial({ color: 0xc24b74 });
            const snoutMesh = new THREE.Mesh(snoutGeo, snoutMat);
            snoutMesh.position.set(0, -headSize[1] / 4, headSize[2] / 2 + 0.09);
            this.head.add(snoutMesh);

            // 🌸 4 FLORES DE CEREZO 3D EN LA ESPALDA (Exacto a la Foto 1)
            const flowerPositions = [
                [-0.22, 0.25],
                [0.22, 0.25],
                [-0.22, -0.25],
                [0.22, -0.25]
            ];

            const stemGeo = new THREE.BoxGeometry(0.04, 0.35, 0.04);
            const stemMat = new THREE.MeshLambertMaterial({ color: 0x388e3c });
            const petalGeo = new THREE.BoxGeometry(0.24, 0.24, 0.04);
            const petalMat = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
            const centerGeo = new THREE.BoxGeometry(0.08, 0.08, 0.06);
            const centerMat = new THREE.MeshLambertMaterial({ color: 0xff9800 });

            flowerPositions.forEach(pos => {
                const flowerGroup = new THREE.Group();
                flowerGroup.position.set(pos[0], bodySize[1] / 2 + 0.16, pos[1]);

                const stem = new THREE.Mesh(stemGeo, stemMat);
                flowerGroup.add(stem);

                const petals = new THREE.Mesh(petalGeo, petalMat);
                petals.position.y = 0.20;
                flowerGroup.add(petals);

                const center = new THREE.Mesh(centerGeo, centerMat);
                center.position.set(0, 0.20, 0.02);
                flowerGroup.add(center);

                bodyMesh.add(flowerGroup);
            });
        } else if (this.type === 'pig') {
            // Cerdo Cute: Hocico 3D rosa
            const snoutGeo = new THREE.BoxGeometry(0.36, 0.2, 0.18);
            const snoutMat = new THREE.MeshLambertMaterial({ color: 0xe91e63 });
            const snoutMesh = new THREE.Mesh(snoutGeo, snoutMat);
            snoutMesh.position.set(0, -headSize[1] / 6, headSize[2] / 2 + 0.09);
            this.head.add(snoutMesh);

            // 👑 CORONA 3D DE FLORES VERDES, BLANCAS Y ROSADAS (Exacto a la Foto 2)
            const crownGeo = new THREE.BoxGeometry(headSize[0] + 0.08, 0.08, headSize[2] + 0.08);
            const crownMat = new THREE.MeshLambertMaterial({ color: 0x4caf50 });
            const crownMesh = new THREE.Mesh(crownGeo, crownMat);
            crownMesh.position.y = headSize[1] / 2 + 0.02;
            this.head.add(crownMesh);

            // Flores diminutas sobre la corona
            const fMat1 = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
            const fMat2 = new THREE.MeshLambertMaterial({ color: 0xffffff });
            const fGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);

            for (let f = 0; f < 6; f++) {
                const fl = new THREE.Mesh(fGeo, f % 2 === 0 ? fMat1 : fMat2);
                const angle = (f / 6) * Math.PI * 2;
                fl.position.set(Math.sin(angle) * (headSize[0] / 2 + 0.04), headSize[1] / 2 + 0.06, Math.cos(angle) * (headSize[2] / 2 + 0.04));
                this.head.add(fl);
            }
        } else if (this.type === 'chicken') {
            // Patito / Pollito Amarillo: Alas 3D desplegadas (Exacto a la Foto 3)
            const wingGeo = new THREE.BoxGeometry(0.06, 0.22, 0.32);
            const wingMat = new THREE.MeshLambertMaterial({ color: 0xffffee });
            const leftWing = new THREE.Mesh(wingGeo, wingMat);
            leftWing.position.set(-bodySize[0] / 2 - 0.04, bodySize[1] / 2, 0);
            leftWing.rotation.z = -0.3; // Alas desplegadas hacia los lados
            const rightWing = new THREE.Mesh(wingGeo, wingMat);
            rightWing.position.set(bodySize[0] / 2 + 0.04, bodySize[1] / 2, 0);
            rightWing.rotation.z = 0.3;
            bodyMesh.add(leftWing);
            bodyMesh.add(rightWing);

            // Pico 3D marrón sobresaliente
            const beakGeo = new THREE.BoxGeometry(0.24, 0.14, 0.22);
            const beakMat = new THREE.MeshLambertMaterial({ color: 0xb78103 });
            const beakMesh = new THREE.Mesh(beakGeo, beakMat);
            beakMesh.position.set(0, -headSize[1] / 8, headSize[2] / 2 + 0.11);
            this.head.add(beakMesh);
        } else if (this.type === 'wolf') {
            // Lobo Minecraft Cute: Hocico beige sobresaliente (Exacto a la Foto 4)
            const snoutGeo = new THREE.BoxGeometry(0.26, 0.22, 0.25);
            const snoutMat = new THREE.MeshLambertMaterial({ color: 0xefebe9 });
            const snoutMesh = new THREE.Mesh(snoutGeo, snoutMat);
            snoutMesh.position.set(0, -headSize[1] / 4, headSize[2] / 2 + 0.12);
            this.head.add(snoutMesh);

            // Nariz negra
            const noseGeo = new THREE.BoxGeometry(0.14, 0.1, 0.1);
            const noseMat = new THREE.MeshLambertMaterial({ color: 0x212121 });
            const noseMesh = new THREE.Mesh(noseGeo, noseMat);
            noseMesh.position.set(0, 0.04, 0.13);
            snoutMesh.add(noseMesh);

            // 2 Orejas 3D erguidas
            const earGeo = new THREE.BoxGeometry(0.1, 0.18, 0.1);
            const earMat = new THREE.MeshLambertMaterial({ color: 0x757575 });
            const leftEar = new THREE.Mesh(earGeo, earMat);
            leftEar.position.set(-headSize[0] / 3, headSize[1] / 2 + 0.09, 0);
            const rightEar = new THREE.Mesh(earGeo, earMat);
            rightEar.position.set(headSize[0] / 3, headSize[1] / 2 + 0.09, 0);
            this.head.add(leftEar);
            this.head.add(rightEar);

            // Cola de lobo
            const tailGeo = new THREE.BoxGeometry(0.14, 0.45, 0.14);
            const tailMat = new THREE.MeshLambertMaterial({ color: 0xbdbdbd });
            const tailMesh = new THREE.Mesh(tailGeo, tailMat);
            tailMesh.position.set(0, bodySize[1] / 3, -bodySize[2] / 2 - 0.15);
            tailMesh.rotation.x = -0.6;
            bodyMesh.add(tailMesh);
        } else if (this.type === 'sheep') {
            // Oveja Cute de Cerezo: Broches de flor de cerezo en la cabeza (Exacto a la Foto 5)
            const clipGeo = new THREE.BoxGeometry(0.12, 0.12, 0.06);
            const clipMat = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
            const leftClip = new THREE.Mesh(clipGeo, clipMat);
            leftClip.position.set(-headSize[0] / 2 - 0.02, headSize[1] / 3, headSize[2] / 4);
            const rightClip = new THREE.Mesh(clipGeo, clipMat);
            rightClip.position.set(headSize[0] / 2 + 0.02, headSize[1] / 3, headSize[2] / 4);
            this.head.add(leftClip);
            this.head.add(rightClip);
        }

        // 4 Patas (2 para el pollo)
        const numLegs = this.type === 'chicken' ? 2 : 4;
        const legGeo = new THREE.BoxGeometry(legSize[0], legSize[1], legSize[2]);
        const legPositions = numLegs === 2 ? [
            [-bodySize[0] / 4, legSize[1] / 2, 0],
            [bodySize[0] / 4, legSize[1] / 2, 0]
        ] : [
            [-bodySize[0] / 3, legSize[1] / 2, bodySize[2] / 3],
            [bodySize[0] / 3, legSize[1] / 2, bodySize[2] / 3],
            [-bodySize[0] / 3, legSize[1] / 2, -bodySize[2] / 3],
            [bodySize[0] / 3, legSize[1] / 2, -bodySize[2] / 3]
        ];

        this.legs = legPositions.map(pos => {
            const legMesh = new THREE.Mesh(legGeo, legMat);
            legMesh.position.set(pos[0], pos[1], pos[2]);
            this.mesh.add(legMesh);

            // Pezuñas oscuras
            if (this.type === 'cow' || this.type === 'pig') {
                const hoofGeo = new THREE.BoxGeometry(legSize[0] + 0.02, 0.12, legSize[2] + 0.02);
                const hoofMat = new THREE.MeshLambertMaterial({ color: 0x663344 });
                const hoofMesh = new THREE.Mesh(hoofGeo, hoofMat);
                hoofMesh.position.y = -legSize[1] / 2 + 0.06;
                legMesh.add(hoofMesh);
            }
            return legMesh;
        });

        this.mesh.userData = {
            isAnimal: true,
            type: this.type,
            name: (this.apiData && this.apiData.name) || this.type.toUpperCase(),
            hp: (this.apiData && this.apiData.hp) || 10
        };
    }

    update(delta, getGroundYFunc) {
        this.moveTimer -= delta;
        if (this.moveTimer <= 0) {
            this.isWalking = Math.random() > 0.35;
            this.targetRotation += (Math.random() - 0.5) * 1.6;
            this.moveTimer = 2.5 + Math.random() * 3.5;
        }

        this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, this.targetRotation, delta * 3);

        if (this.isWalking) {
            this.walkTimer += delta * 7;
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.rotation.y);
            this.mesh.position.x += forward.x * this.speed * delta;
            this.mesh.position.z += forward.z * this.speed * delta;

            // Delimitar el movimiento estrictamente dentro de los límites del mapa para evitar que se salgan al vacío
            const maxBound = 52;
            if (Math.abs(this.mesh.position.x) > maxBound || Math.abs(this.mesh.position.z) > maxBound) {
                this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -maxBound, maxBound);
                this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -maxBound, maxBound);
                this.targetRotation = Math.atan2(-this.mesh.position.x, -this.mesh.position.z) + (Math.random() - 0.5) * 0.8;
                this.isWalking = true;
            }

            // Animación de patas (segura para animales de 2 patas como el pollo y de 4 patas)
            if (this.legs[0] && this.legs[0].rotation) this.legs[0].rotation.x = Math.sin(this.walkTimer) * 0.5;
            if (this.legs[1] && this.legs[1].rotation) this.legs[1].rotation.x = -Math.sin(this.walkTimer) * 0.5;
            if (this.legs[2] && this.legs[2].rotation) this.legs[2].rotation.x = -Math.sin(this.walkTimer) * 0.5;
            if (this.legs[3] && this.legs[3].rotation) this.legs[3].rotation.x = Math.sin(this.walkTimer) * 0.5;
        } else {
            if (Array.isArray(this.legs)) {
                this.legs.forEach(leg => {
                    if (leg && leg.rotation) leg.rotation.x = 0;
                });
            }
            if (this.head && this.head.rotation) {
                this.head.rotation.x = Math.sin(this.walkTimer * 0.5) * 0.15;
            }
        }

        // Adaptar altura al terreno constantemente para que siempre pisen sobre bloques sólidos
        if (getGroundYFunc) {
            const targetY = getGroundYFunc(this.mesh.position.x, this.mesh.position.z);
            if (targetY !== null && targetY > 0) {
                this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, targetY, delta * 12);
            }
        }
    }
}

class MinecraftSandbox {
    constructor() {
        this.initialized = false;
        this.isRunning = false;

        // Elementos DOM
        this.container = null;
        this.blocker = null;
        this.hotbarEl = null;
        this.tooltipEl = null;
        this.handEl = null;
        this.handCanvas = null;

        // Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = new Map();
        this.blockMeshes = new Map();
        this.boxGeometry = null;
        this.highlightMesh = null;

        // Catálogo Extendido de Bloques, Herramientas, Comida y Supervivencia
        this.ITEMS = [
            // HERRAMIENTAS Y ARMAS
            { id: 'diamond_sword', name: 'Espada de Diamante', isTool: true, toolType: 'sword', material: '#5cedd8', category: 'tools' },
            { id: 'diamond_pickaxe', name: 'Pico de Diamante', isTool: true, toolType: 'pickaxe', material: '#5cedd8', category: 'tools' },
            { id: 'diamond_shovel', name: 'Pala de Diamante', isTool: true, toolType: 'shovel', material: '#5cedd8', category: 'tools' },
            { id: 'diamond_axe', name: 'Hacha de Diamante', isTool: true, toolType: 'axe', material: '#5cedd8', category: 'tools' },
            { id: 'iron_sword', name: 'Espada de Hierro', isTool: true, toolType: 'sword', material: '#e0e0e0', category: 'tools' },
            { id: 'iron_pickaxe', name: 'Pico de Hierro', isTool: true, toolType: 'pickaxe', material: '#e0e0e0', category: 'tools' },
            { id: 'bow', name: 'Arco de Cazador', isTool: true, toolType: 'bow', material: '#d4af37', category: 'tools' },

            // COMIDA Y SUPERVIVENCIA REAL
            { id: 'apple', name: 'Manzana Roja', isItem: true, isFood: true, healAmount: 6, color: '#e82525', category: 'food' },
            { id: 'golden_apple', name: 'Manzana Dorada', isItem: true, isFood: true, healAmount: 10, color: '#ffcc00', glow: true, category: 'food' },
            { id: 'steak', name: 'Bistec Asado', isItem: true, isFood: true, healAmount: 8, color: '#7a2412', category: 'food' },
            { id: 'bread', name: 'Pan de Trigo', isItem: true, isFood: true, healAmount: 6, color: '#b87333', category: 'food' },
            { id: 'cooked_chicken', name: 'Pollo Asado', isItem: true, isFood: true, healAmount: 6, color: '#d68b38', category: 'food' },
            { id: 'raw_porkchop', name: 'Chuleta de Cerdo', isItem: true, isFood: true, healAmount: 4, color: '#f09ca8', category: 'food' },
            { id: 'totem', name: 'Tótem de Inmortalidad', isItem: true, color: '#e5a00d', glow: true, category: 'food' },
            { id: 'torch', name: 'Antorcha', isItem: true, color: '#ffaa00', glow: true, category: 'food' },

            // BLOQUES DE CONSTRUCCIÓN
            { id: 'grass', name: 'Césped (Grass Block)', top: '#5b8c2a', side: '#4e331e', bottom: '#4e331e', category: 'blocks' },
            { id: 'dirt', name: 'Tierra (Dirt)', color: '#593d26', noise: '#3e2817', category: 'blocks' },
            { id: 'stone', name: 'Piedra (Stone)', color: '#7a7a7a', noise: '#5e5e5e', category: 'blocks' },
            { id: 'cobblestone', name: 'Adoquín (Cobblestone)', color: '#686868', noise: '#3a3a3a', grid: true, category: 'blocks' },
            { id: 'oak_log', name: 'Tronco de Roble (Oak Log)', top: '#997343', side: '#503c23', category: 'blocks' },
            { id: 'oak_planks', name: 'Tablones de Roble (Planks)', color: '#9d7f4e', planks: true, category: 'blocks' },
            { id: 'leaves', name: 'Hojas (Leaves)', color: '#386c1f', leaves: true, transparent: true, category: 'blocks' },
            { id: 'cherry_leaves', name: 'Hojas de Cerezo (Sakura)', color: '#ffb7c5', leaves: true, transparent: true, category: 'blocks' },
            { id: 'cherry_log', name: 'Tronco de Cerezo', top: '#6d4c41', side: '#3e2723', category: 'blocks' },
            { id: 'pink_quartz', name: 'Bloque Rosa Cute', color: '#ffb3cb', gem: true, category: 'blocks' },
            { id: 'pink_glass', name: 'Cristal Rosa Cute', color: 'rgba(255, 128, 171, 0.55)', glass: true, transparent: true, category: 'blocks' },
            { id: 'glass', name: 'Cristal (Glass)', color: 'rgba(215, 240, 255, 0.45)', glass: true, transparent: true, category: 'blocks' },
            { id: 'bricks', name: 'Ladrillos (Bricks)', color: '#944432', bricks: true, category: 'blocks' },
            { id: 'sand', name: 'Arena (Sand)', color: '#dbcb97', noise: '#c6b47c', category: 'blocks' },
            { id: 'crafting_table', name: 'Mesa de Trabajo', color: '#75512b', crafting: true, category: 'blocks' },
            { id: 'bookshelf', name: 'Estantería de Libros', color: '#8a6438', books: true, category: 'blocks' },
            { id: 'tnt', name: 'TNT', color: '#b82b1d', tnt: true, category: 'blocks' },

            // MINERALES Y METALES
            { id: 'diamond_block', name: 'Bloque de Diamante', color: '#5cedd8', gem: true, category: 'minerals' },
            { id: 'gold_block', name: 'Bloque de Oro', color: '#f7d33b', metal: true, category: 'minerals' },
            { id: 'iron_block', name: 'Bloque de Hierro', color: '#dcdcdc', metal: true, category: 'minerals' },
            { id: 'emerald_block', name: 'Bloque de Esmeralda', color: '#17dd62', gem: true, category: 'minerals' },
            { id: 'lapis_block', name: 'Bloque de Lapislázuli', color: '#1344a0', gem: true, category: 'minerals' },
            { id: 'redstone_block', name: 'Bloque de Redstone', color: '#e60000', glow: true, category: 'minerals' },
            { id: 'obsidian', name: 'Obsidiana (Obsidian)', color: '#161024', noise: '#2e194f', category: 'minerals' },
            { id: 'glowstone', name: 'Piedra Luminosa (Glowstone)', color: '#e6a845', glow: true, category: 'minerals' },
            { id: 'diamond_ore', name: 'Mineral de Diamante', color: '#7a7a7a', ore: '#5cedd8', category: 'minerals' },
            { id: 'gold_ore', name: 'Mineral de Oro', color: '#7a7a7a', ore: '#f7d33b', category: 'minerals' },
            { id: 'bedrock', name: 'Lecho de Roca (Bedrock)', color: '#222222', noise: '#111111', category: 'minerals' }
        ];

        // Hotbar Activa (9 Ranuras iniciales asignadas de forma segura por id)
        const getItem = (id) => this.ITEMS.find(i => i.id === id) || this.ITEMS[0];
        this.hotbarSlots = [
            getItem('diamond_sword'),
            getItem('diamond_pickaxe'),
            getItem('diamond_shovel'),
            getItem('diamond_axe'),
            getItem('apple'),
            getItem('grass'),
            getItem('dirt'),
            getItem('cobblestone'),
            getItem('oak_planks')
        ];
        this.activeSlotIndex = 0;

        // Estado del Jugador y Física Real (Caminata + Gravedad por Defecto)
        this.isLocked = false;
        this.isFlightMode = false;
        this.isGrounded = false;
        this.velocityY = 0;
        this.eyeHeight = 1.62;
        this.playerHeight = 1.8;
        this.playerRadius = 0.28;
        this.walkTimer = 0;

        this.playerX = 0;
        this.playerY = 12;
        this.playerZ = 0;
        this.cameraMode = 0;
        this.knockbackX = 0;
        this.knockbackZ = 0;

        this.moveState = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.pitch = 0;
        this.yaw = 0;
        this.lastTime = performance.now();

        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.centerCoords = new THREE.Vector2(0, 0);

        // Texturas y Materiales
        this.textureCache = {};
        this.blockMaterials = {};

        // Partículas, Nubes y Animales 3D
        this.particles = [];
        this.cloudsGroup = null;
        this.animals = [];

        // Audio
        this.audioCtx = null;
    }

    /**
     * Inicialización del Sandbox al entrar a la vista
     */
    init() {
        if (this.initialized) {
            this.onResize();
            return;
        }

        this.container = document.getElementById('sandbox-canvas-container');
        if (!this.container) return;

        this.blocker = document.getElementById('sandbox-blocker');
        this.hotbarEl = document.getElementById('sandbox-hotbar');
        this.tooltipEl = document.getElementById('sandbox-block-tooltip');
        this.handEl = document.getElementById('first-person-hand');
        this.handCanvas = document.getElementById('hand-item-canvas');

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);

        // 1. Configuración de Three.js Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffa6c9); // Cielo Rosado Atardecer Cute Sakura (Fotos 1 y 2)
        this.scene.fog = new THREE.FogExp2(0xffb7c5, 0.015);

        // 2. Cámara
        this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 12, 0);
        this.camera.rotation.order = 'YXZ';

        // 3. Renderizador WebGL
        this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // 4. Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfffaed, 0.85);
        sunLight.position.set(40, 80, 40);
        this.scene.add(sunLight);

        // 5. Nubes Cúbicas de Minecraft
        this.initClouds();

        // 6. Highlight de Bloque Apuntado
        const highlightGeo = new THREE.BoxGeometry(1.005, 1.005, 1.005);
        const highlightMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 2 });
        this.highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
        this.highlightMesh.visible = false;
        this.scene.add(this.highlightMesh);

        // 7. Pre-generar texturas y materiales Three.js con texturas oficiales PNG
        this.initMaterials();

        // 8. Generar Terreno Extenso
        this.generateTerrain();

        // Posicionar al jugador en la superficie del terreno
        this.spawnPlayerOnGround();

        // 9. Configurar Controles e Interacción
        this.setupEventListeners();
        this.renderHotbar();
        this.updateHandItem();
        this.setupPaletteModal();

        // 10. Conectar al Servidor WebSocket Multijugador Real-Time (Solo en modo Multijugador)
        if (window.isMultiplayerMode && window.minecraftMultiplayer && !window.minecraftMultiplayer.isConnected) {
            window.minecraftMultiplayer.init(window.minecraftMultiplayer.username);
        }

        // 11. Crear Modelo 3D del Jugador Local (para modo de Cámara F5 / Tercera Persona)
        const myName = window.minecraftMultiplayer ? window.minecraftMultiplayer.username : 'Steve';
        if (typeof createMinecraftPlayer3DMesh === 'function') {
            this.localPlayerMesh = createMinecraftPlayer3DMesh(myName);
            this.localPlayerMesh.visible = false;
            this.scene.add(this.localPlayerMesh);
        }

        this.initialized = true;
        this.isRunning = true;

        // Loop de Renderizado
        requestAnimationFrame((t) => this.animate(t));
    }

    /**
     * Generador de Nubes Cúbicas Voxel en Forma de Corazón 🩷
     */
    initClouds() {
        this.cloudsGroup = new THREE.Group();

        const cloudMat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.88
        });

        const cloudPinkMat = new THREE.MeshLambertMaterial({
            color: 0xffd6e0,
            transparent: true,
            opacity: 0.92
        });

        // Matriz Voxel de Forma de Corazón
        const heartPattern = [
            [0, 1, 1, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0]
        ];

        const boxGeo = new THREE.BoxGeometry(2.4, 1.8, 2.4);

        for (let i = 0; i < 20; i++) {
            const heartCloudGroup = new THREE.Group();
            const cx = (Math.random() - 0.5) * 160;
            const cz = (Math.random() - 0.5) * 160;
            const cy = 34 + Math.random() * 6;
            const mat = i % 2 === 0 ? cloudMat : cloudPinkMat;

            heartPattern.forEach((row, rIdx) => {
                row.forEach((cell, cIdx) => {
                    if (cell === 1) {
                        const block = new THREE.Mesh(boxGeo, mat);
                        block.position.set((cIdx - 3) * 2.4, 0, (rIdx - 2.5) * 2.4);
                        heartCloudGroup.add(block);
                    }
                });
            });

            heartCloudGroup.position.set(cx, cy, cz);
            heartCloudGroup.scale.setScalar(0.85 + Math.random() * 0.55);
            this.cloudsGroup.add(heartCloudGroup);
        }

        this.scene.add(this.cloudsGroup);
    }

    /**
     * Dibuja y genera texturas procedurales pixeladas
     */
    createPixelTexture(item, face = 'side') {
        if (!item) item = { id: 'unknown', name: 'Item', color: '#888888' };
        const key = `${item.id}_${face}`;
        if (this.textureCache[key]) return this.textureCache[key];

        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        if (item.isTool) {
            const handleCol = '#8b5a3e';
            const sageGreenCol = '#769f6f';
            const gemCol = '#cbe08b';
            const pinkCoreCol = '#ffb7c5';
            const pinkEdgeCol = '#f8637c';

            if (item.toolType === 'sword') {
                // Espada Cute Rosa (Exacta a la Foto 3 - media_1788362351137.png)
                ctx.fillStyle = sageGreenCol;
                ctx.fillRect(7, 14, 2, 2);
                ctx.fillRect(6, 15, 4, 1);
                ctx.fillStyle = pinkCoreCol;
                ctx.fillRect(7, 15, 2, 1);

                ctx.fillStyle = handleCol;
                ctx.fillRect(7, 11, 2, 3);
                ctx.fillRect(6, 12, 4, 1);

                ctx.fillStyle = sageGreenCol;
                ctx.fillRect(3, 9, 10, 2);
                ctx.fillRect(2, 9, 2, 2);
                ctx.fillRect(12, 9, 2, 2);
                ctx.fillStyle = gemCol;
                ctx.fillRect(7, 9, 2, 2);

                ctx.fillStyle = pinkEdgeCol;
                for (let i = 0; i < 9; i++) {
                    ctx.fillRect(6 - (i > 7 ? 1 : 0), 8 - i, 4, 2);
                }
                ctx.fillStyle = pinkCoreCol;
                for (let i = 0; i < 8; i++) {
                    ctx.fillRect(7, 8 - i, 2, 1);
                }
            } else if (item.toolType === 'pickaxe') {
                // Pico Cute Rosa (Exacto a la Foto 2 - media_1788362323886.png)
                ctx.fillStyle = sageGreenCol;
                ctx.fillRect(2, 13, 2, 2);
                ctx.fillStyle = handleCol;
                for (let i = 0; i < 10; i++) {
                    ctx.fillRect(3 + i, 12 - i, 2, 2);
                }
                ctx.fillStyle = pinkEdgeCol;
                ctx.fillRect(8, 1, 7, 3);
                ctx.fillRect(13, 2, 3, 7);
                ctx.fillRect(7, 2, 3, 3);
                ctx.fillRect(6, 4, 3, 3);
                ctx.fillStyle = pinkCoreCol;
                ctx.fillRect(9, 2, 5, 2);
                ctx.fillRect(13, 3, 2, 5);
            } else if (item.toolType === 'shovel') {
                // Pala Cute Rosa
                ctx.fillStyle = sageGreenCol;
                ctx.fillRect(2, 13, 2, 2);
                ctx.fillStyle = handleCol;
                for (let i = 0; i < 9; i++) {
                    ctx.fillRect(3 + i, 12 - i, 2, 2);
                }
                ctx.fillStyle = pinkEdgeCol;
                ctx.fillRect(10, 2, 5, 5);
                ctx.fillStyle = pinkCoreCol;
                ctx.fillRect(11, 3, 3, 3);
            } else if (item.toolType === 'axe') {
                // Hacha Cute Rosa
                ctx.fillStyle = sageGreenCol;
                ctx.fillRect(2, 13, 2, 2);
                ctx.fillStyle = handleCol;
                for (let i = 0; i < 10; i++) {
                    ctx.fillRect(3 + i, 12 - i, 2, 2);
                }
                ctx.fillStyle = pinkEdgeCol;
                ctx.fillRect(8, 1, 6, 5);
                ctx.fillRect(12, 1, 3, 7);
                ctx.fillStyle = pinkCoreCol;
                ctx.fillRect(9, 2, 4, 3);
                ctx.fillRect(12, 2, 2, 5);
            }
        } else if (item.isFood || item.id === 'apple' || item.id === 'golden_apple' || item.category === 'food') {
            ctx.clearRect(0, 0, 16, 16);
            if (item.id === 'apple' || item.id === 'golden_apple') {
                const bodyCol = item.id === 'golden_apple' ? '#f0c000' : '#e82525';
                const shineCol = item.id === 'golden_apple' ? '#ffff88' : '#ff9999';
                // Manzana roja pixelada (coincidiendo con la foto de referencia del usuario)
                ctx.fillStyle = bodyCol;
                ctx.fillRect(4, 4, 8, 9);
                ctx.fillRect(3, 5, 10, 7);
                ctx.fillRect(5, 3, 6, 11);
                // Borde oscuro
                ctx.fillStyle = '#610c0c';
                ctx.fillRect(4, 13, 8, 1);
                ctx.fillRect(3, 12, 1, 1);
                ctx.fillRect(12, 12, 1, 1);
                // Tallo marrón
                ctx.fillStyle = '#5c3818';
                ctx.fillRect(8, 1, 2, 3);
                // Brillo blanco
                ctx.fillStyle = shineCol;
                ctx.fillRect(5, 5, 2, 2);
                ctx.fillRect(6, 4, 2, 1);
            } else if (item.id === 'bread') {
                ctx.fillStyle = '#c48e48';
                ctx.fillRect(2, 5, 12, 7);
                ctx.fillStyle = '#7a4e21';
                ctx.fillRect(4, 4, 3, 2);
                ctx.fillRect(9, 4, 3, 2);
            } else if (item.id === 'steak') {
                ctx.fillStyle = '#8a331c';
                ctx.fillRect(3, 4, 10, 8);
                ctx.fillStyle = '#f0c0a0';
                ctx.fillRect(2, 5, 2, 3);
            } else {
                ctx.fillStyle = item.color || '#e82525';
                ctx.fillRect(3, 3, 10, 10);
            }
        } else if (item.id === 'grass') {
            if (face === 'top') {
                ctx.fillStyle = '#5b8c2a';
                ctx.fillRect(0, 0, 16, 16);
                for (let x = 0; x < 16; x++) {
                    for (let y = 0; y < 16; y++) {
                        if (Math.random() > 0.6) {
                            ctx.fillStyle = Math.random() > 0.5 ? '#679e30' : '#4f7b24';
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            } else if (face === 'bottom') {
                ctx.fillStyle = '#593d26';
                ctx.fillRect(0, 0, 16, 16);
            } else {
                ctx.fillStyle = '#593d26';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#5b8c2a';
                ctx.fillRect(0, 0, 16, 3);
                for (let x = 0; x < 16; x++) {
                    ctx.fillRect(x, 3, 1, Math.floor(Math.random() * 4));
                }
            }
        } else if (item.top && item.side) {
            if (face === 'top' || face === 'bottom') {
                ctx.fillStyle = item.top;
                ctx.fillRect(0, 0, 16, 16);
                ctx.strokeStyle = '#503c23';
                ctx.strokeRect(2, 2, 12, 12);
            } else {
                ctx.fillStyle = item.side;
                ctx.fillRect(0, 0, 16, 16);
                for (let x = 0; x < 16; x += 3) {
                    ctx.fillStyle = '#3c2b17';
                    ctx.fillRect(x, 0, 1, 16);
                }
            }
        } else if (item.tnt) {
            if (face === 'top' || face === 'bottom') {
                ctx.fillStyle = '#782218';
                ctx.fillRect(0, 0, 16, 16);
            } else {
                ctx.fillStyle = '#b82b1d';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 5, 16, 6);
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 5px sans-serif';
                ctx.fillText('TNT', 2, 10);
            }
        } else if (item.bricks) {
            ctx.fillStyle = '#b5b5b5';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#944432';
            for (let y = 0; y < 16; y += 4) {
                const offset = (y % 8 === 0) ? 0 : 4;
                for (let x = 0; x < 16; x += 8) {
                    ctx.fillRect((x + offset) % 16 + 1, y + 1, 6, 2);
                }
            }
        } else if (item.planks) {
            ctx.fillStyle = '#9d7f4e';
            ctx.fillRect(0, 0, 16, 16);
            for (let y = 0; y < 16; y += 4) {
                ctx.fillStyle = '#6e542d';
                ctx.fillRect(0, y, 16, 1);
            }
        } else if (item.glass) {
            ctx.clearRect(0, 0, 16, 16);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.strokeRect(0, 0, 16, 16);
            ctx.fillStyle = 'rgba(215, 240, 255, 0.3)';
            ctx.fillRect(1, 1, 14, 14);
        } else if (item.ore) {
            ctx.fillStyle = '#7a7a7a';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = item.ore;
            ctx.fillRect(4, 4, 3, 2);
            ctx.fillRect(10, 5, 2, 3);
            ctx.fillRect(5, 11, 4, 2);
        } else {
            ctx.fillStyle = item.color || '#888';
            ctx.fillRect(0, 0, 16, 16);
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 16; y++) {
                    if (Math.random() > 0.5) {
                        ctx.fillStyle = item.noise || (Math.random() > 0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)');
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        this.textureCache[key] = { texture, canvas };
        return this.textureCache[key];
    }

    initMaterials() {
        const textureLoader = new THREE.TextureLoader();

        const loadPngTex = (url) => {
            const tex = textureLoader.load(url);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            tex.generateMipmaps = false;
            return tex;
        };

        // Texturas reales extraídas de los assets de Minecraft
        const realTextures = {
            grass_top: loadPngTex('img/assets/grass_carried.png'),
            grass_side: loadPngTex('img/assets/grass_side_carried.png'),
            dirt: loadPngTex('img/assets/dirt.png'),
            stone: loadPngTex('img/assets/stone.png'),
            planks: loadPngTex('img/assets/oak_planks.png'),
            log_side: loadPngTex('img/assets/log_oak.png'),
            log_top: loadPngTex('img/assets/log_oak_top.png'),
            leaves: loadPngTex('img/assets/azalea_leaves.png'),
            glass: loadPngTex('img/assets/glass.png'),
        };

        this.ITEMS.forEach(item => {
            if (item.isTool) return;

            if (item.id === 'grass') {
                this.blockMaterials[item.id] = [
                    new THREE.MeshLambertMaterial({ map: realTextures.grass_side }),
                    new THREE.MeshLambertMaterial({ map: realTextures.grass_side }),
                    new THREE.MeshLambertMaterial({ map: realTextures.grass_top }),
                    new THREE.MeshLambertMaterial({ map: realTextures.dirt }),
                    new THREE.MeshLambertMaterial({ map: realTextures.grass_side }),
                    new THREE.MeshLambertMaterial({ map: realTextures.grass_side }),
                ];
            } else if (item.id === 'dirt') {
                this.blockMaterials[item.id] = new THREE.MeshLambertMaterial({ map: realTextures.dirt });
            } else if (item.id === 'stone') {
                this.blockMaterials[item.id] = new THREE.MeshLambertMaterial({ map: realTextures.stone });
            } else if (item.id === 'oak_planks') {
                this.blockMaterials[item.id] = new THREE.MeshLambertMaterial({ map: realTextures.planks });
            } else if (item.id === 'oak_log') {
                this.blockMaterials[item.id] = [
                    new THREE.MeshLambertMaterial({ map: realTextures.log_side }),
                    new THREE.MeshLambertMaterial({ map: realTextures.log_side }),
                    new THREE.MeshLambertMaterial({ map: realTextures.log_top }),
                    new THREE.MeshLambertMaterial({ map: realTextures.log_top }),
                    new THREE.MeshLambertMaterial({ map: realTextures.log_side }),
                    new THREE.MeshLambertMaterial({ map: realTextures.log_side }),
                ];
            } else if (item.id === 'leaves') {
                this.blockMaterials[item.id] = new THREE.MeshLambertMaterial({
                    map: realTextures.leaves,
                    transparent: true,
                    opacity: 0.85
                });
            } else if (item.id === 'glass') {
                this.blockMaterials[item.id] = new THREE.MeshLambertMaterial({
                    map: realTextures.glass,
                    transparent: true,
                    opacity: 0.55
                });
            } else if (item.top || item.tnt) {
                const topTex = this.createPixelTexture(item, 'top').texture;
                const bottomTex = this.createPixelTexture(item, 'bottom').texture;
                const sideTex = this.createPixelTexture(item, 'side').texture;
                this.blockMaterials[item.id] = [
                    new THREE.MeshLambertMaterial({ map: sideTex, transparent: !!item.transparent, opacity: item.transparent ? 0.8 : 1 }),
                    new THREE.MeshLambertMaterial({ map: sideTex, transparent: !!item.transparent, opacity: item.transparent ? 0.8 : 1 }),
                    new THREE.MeshLambertMaterial({ map: topTex, transparent: !!item.transparent, opacity: item.transparent ? 0.8 : 1 }),
                    new THREE.MeshLambertMaterial({ map: bottomTex, transparent: !!item.transparent, opacity: item.transparent ? 0.8 : 1 }),
                    new THREE.MeshLambertMaterial({ map: sideTex, transparent: !!item.transparent, opacity: item.transparent ? 0.8 : 1 }),
                    new THREE.MeshLambertMaterial({ map: sideTex, transparent: !!item.transparent, opacity: item.transparent ? 0.8 : 1 }),
                ];
            } else {
                const tex = this.createPixelTexture(item, 'all').texture;
                this.blockMaterials[item.id] = new THREE.MeshLambertMaterial({
                    map: tex,
                    transparent: !!item.transparent,
                    opacity: item.transparent ? 0.6 : 1
                });
            }
        });
    }

    createFlowerMesh(flowerType = 'pink_tulip') {
        const group = new THREE.Group();
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        if (flowerType === 'pink_tulip') {
            // Tulipán Rosa (Exacto a la Foto 1 - media_1788362309094.png)
            ctx.fillStyle = '#428038';
            ctx.fillRect(7, 6, 2, 9);
            ctx.fillRect(4, 9, 3, 4);
            ctx.fillRect(9, 8, 3, 4);
            ctx.fillStyle = '#ff80ab';
            ctx.fillRect(5, 1, 6, 5);
            ctx.fillRect(5, 1, 2, 3);
            ctx.fillRect(9, 1, 2, 3);
            ctx.fillStyle = '#ffb2dd';
            ctx.fillRect(6, 2, 4, 3);
        } else if (flowerType === 'rose') {
            ctx.fillStyle = '#388e3c';
            ctx.fillRect(7, 5, 2, 10);
            ctx.fillStyle = '#e91e63';
            ctx.fillRect(5, 2, 6, 5);
        } else if (flowerType === 'blue_orchid') {
            ctx.fillStyle = '#388e3c';
            ctx.fillRect(7, 4, 2, 11);
            ctx.fillStyle = '#29b6f6';
            ctx.fillRect(5, 2, 6, 5);
        } else {
            ctx.fillStyle = '#388e3c';
            ctx.fillRect(7, 5, 2, 10);
            ctx.fillStyle = '#ab47bc';
            ctx.fillRect(5, 1, 6, 6);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;

        const mat = new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide, transparent: true });
        const planeGeo = new THREE.PlaneGeometry(0.8, 0.8);

        const p1 = new THREE.Mesh(planeGeo, mat);
        p1.position.y = 0.4;
        const p2 = new THREE.Mesh(planeGeo, mat);
        p2.position.y = 0.4;
        p2.rotation.y = Math.PI / 2;

        group.add(p1);
        group.add(p2);
        return group;
    }

    /**
     * Culling Dinámico por Distancia (Rendimiento 60 FPS Sedoso en Mapa Extenso)
     */
    updateVisibleChunkMeshes() {
        if (!this.camera) return;
        const camX = Math.floor(this.camera.position.x);
        const camZ = Math.floor(this.camera.position.z);
        const maxDistSq = 40 * 40;

        if (this.lastChunkCamX !== undefined && Math.hypot(camX - this.lastChunkCamX, camZ - this.lastChunkCamZ) < 5) {
            return;
        }
        this.lastChunkCamX = camX;
        this.lastChunkCamZ = camZ;

        // Quitar mallas distantes
        this.blockMeshes.forEach((mesh, key) => {
            const [x, y, z] = key.split(',').map(Number);
            const distSq = (x - camX) * (x - camX) + (z - camZ) * (z - camZ);
            if (distSq > maxDistSq + 120) {
                this.scene.remove(mesh);
                this.blockMeshes.delete(key);
            }
        });

        // Generar mallas en rango de visión
        this.world.forEach((blockId, key) => {
            const [x, y, z] = key.split(',').map(Number);
            const distSq = (x - camX) * (x - camX) + (z - camZ) * (z - camZ);
            if (distSq <= maxDistSq && !this.blockMeshes.has(key)) {
                if (this.isBlockExposed(x, y, z)) {
                    this.createBlockMesh(x, y, z, blockId);
                }
            }
        });
    }

    /**
     * Generación de Terreno Procedural Extenso (Bioma Gigante 120x120 Optimizado a 60 FPS)
     */
    generateTerrain() {
        this.blockMeshes.forEach(mesh => this.scene.remove(mesh));
        this.blockMeshes.clear();
        this.world.clear();
        this.lastChunkCamX = undefined;

        if (this.flowerGroup) {
            this.scene.remove(this.flowerGroup);
        }
        this.flowerGroup = new THREE.Group();

        const WORLD_SIZE = 120; // Mapa extenso de 120x120
        const half = Math.floor(WORLD_SIZE / 2);

        // 1. Registrar estructura del mundo en memoria (World Matrix)
        for (let x = -half; x <= half; x++) {
            for (let z = -half; z <= half; z++) {
                const hill1 = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 4.5;
                const hill2 = Math.sin(x * 0.03 + z * 0.03) * 5.0;
                const surfaceY = Math.max(2, Math.floor(5 + hill1 + hill2));

                const bKey = this.getKey(x, 0, z);
                this.world.set(bKey, 'bedrock');

                for (let y = 1; y < surfaceY - 2; y++) {
                    const r = Math.random();
                    const bType = r < 0.02 ? 'diamond_ore' : (r < 0.05 ? 'gold_ore' : 'stone');
                    this.world.set(this.getKey(x, y, z), bType);
                }

                for (let y = Math.max(1, surfaceY - 2); y < surfaceY; y++) {
                    this.world.set(this.getKey(x, y, z), 'dirt');
                }

                this.world.set(this.getKey(x, surfaceY, z), 'grass');

                // Densidad de vegetación variada por ruido de bioma
                const biomeNoise = Math.sin(x * 0.04) + Math.cos(z * 0.04);

                if ((Math.abs(x) > 4 || Math.abs(z) > 4)) {
                    if (biomeNoise > 0.3) {
                        // Zonas con bosque denso de cerezo
                        if (x % 5 === 0 && z % 5 === 0 && Math.random() < 0.45) {
                            this.createTreeStructure(x, surfaceY + 1, z);
                        }
                    } else if (biomeNoise <= 0.3) {
                        // Zonas de pradera despejada con poquísimos árboles y flores en el piso (Fotos 1 y 4)
                        if (x % 9 === 0 && z % 9 === 0 && Math.random() < 0.10) {
                            this.createTreeStructure(x, surfaceY + 1, z);
                        } else if (Math.random() < 0.08) {
                            // Generar flores 3D en el piso
                            const types = ['pink_tulip', 'allium', 'rose', 'blue_orchid'];
                            const fType = types[Math.floor(Math.random() * types.length)];
                            const fMesh = this.createFlowerMesh(fType);
                            fMesh.position.set(x + 0.5, surfaceY + 1.0, z + 0.5);
                            this.flowerGroup.add(fMesh);
                        }
                    }
                }
            }
        }

        this.scene.add(this.flowerGroup);

        // 2. Renderizar mallas visibles iniciales a 60 FPS
        this.updateVisibleChunkMeshes();

        // 3. Generar fauna y animales 3D distribuidos por el bioma extenso
        this.spawnVoxelAnimals();
    }

    createTreeStructure(x, baseY, z) {
        const height = 4 + Math.floor(Math.random() * 3);
        const trunkBlock = Math.random() > 0.2 ? 'cherry_log' : 'oak_log';
        const leafBlock = Math.random() > 0.15 ? 'cherry_leaves' : 'leaves';

        for (let y = 0; y < height; y++) {
            this.world.set(this.getKey(x, baseY + y, z), trunkBlock);
        }
        const leafY = baseY + height - 2;
        for (let lx = -3; lx <= 3; lx++) {
            for (let lz = -3; lz <= 3; lz++) {
                for (let ly = 0; ly <= 3; ly++) {
                    if (Math.abs(lx) === 3 && Math.abs(lz) === 3) continue;
                    if (lx === 0 && lz === 0 && ly < 2) continue;
                    this.world.set(this.getKey(x + lx, leafY + ly, z + lz), leafBlock);
                }
            }
        }
        this.world.set(this.getKey(x, leafY + 4, z), leafBlock);
    }

    isBlockExposed(x, y, z) {
        if (!this.world.has(this.getKey(x, y + 1, z))) return true;
        if (!this.world.has(this.getKey(x, y - 1, z))) return true;
        if (!this.world.has(this.getKey(x + 1, y, z))) return true;
        if (!this.world.has(this.getKey(x - 1, y, z))) return true;
        if (!this.world.has(this.getKey(x, y, z + 1))) return true;
        if (!this.world.has(this.getKey(x, y, z - 1))) return true;
        return false;
    }

    /**
     * Genera animales 3D voxel (Vacas, Ovejas, Cerdos, Lobos, Pollos) consumiendo datos de la API
     */
    async spawnVoxelAnimals() {
        if (this.animals && this.animals.length > 0) {
            this.animals.forEach(a => this.scene.remove(a.mesh));
        }
        this.animals = [];

        // Obtener datos de animales de la API de Minecraft / Astroworld
        let apiAnimals = [];
        try {
            if (typeof getAnimals === 'function') {
                apiAnimals = await getAnimals();
            }
        } catch (e) {
            console.warn('Cargando fauna local por fallback:', e);
        }

        const animalTypes = ['cow', 'sheep', 'pig', 'wolf', 'chicken'];
        const numAnimals = 35; // Fauna abundante en el mapa extenso

        for (let i = 0; i < numAnimals; i++) {
            const rx = Math.floor((Math.random() - 0.5) * 80);
            const rz = Math.floor((Math.random() - 0.5) * 80);
            if (Math.abs(rx) < 4 && Math.abs(rz) < 4) continue;

            const groundY = this.getAnimalGroundY(rx, rz);

            if (groundY !== null && groundY > 0) {
                const type = animalTypes[i % animalTypes.length];
                const matchingApiData = apiAnimals.find(a => (a.name || '').toLowerCase().includes(type)) || apiAnimals[i % apiAnimals.length];
                const animal = new VoxelAnimal(type, rx, groundY, rz, matchingApiData);
                this.scene.add(animal.mesh);
                this.animals.push(animal);
            }
        }
    }

    getAnimalGroundY(x, z) {
        const ix = Math.floor(x);
        const iz = Math.floor(z);
        if (Math.abs(ix) > 55 || Math.abs(iz) > 55) return null;

        for (let y = 35; y >= 1; y--) {
            const blockId = this.world.get(this.getKey(ix, y, iz));
            if (blockId && !blockId.includes('leaves') && !blockId.includes('glass') && !blockId.includes('flower')) {
                return y + 1.0;
            }
        }
        return null;
    }

    createTree(x, baseY, z) {
        const height = 4 + Math.floor(Math.random() * 2);
        for (let y = 0; y < height; y++) {
            this.setBlock(x, baseY + y, z, 'oak_log');
        }
        const leafY = baseY + height - 2;
        for (let lx = -2; lx <= 2; lx++) {
            for (let lz = -2; lz <= 2; lz++) {
                for (let ly = 0; ly <= 2; ly++) {
                    if (Math.abs(lx) === 2 && Math.abs(lz) === 2 && (ly === 0 || ly === 2)) continue;
                    if (lx === 0 && lz === 0 && ly < 2) continue;
                    this.setBlock(x + lx, leafY + ly, z + lz, 'leaves');
                }
            }
        }
        this.setBlock(x, leafY + 3, z, 'leaves');
    }

    spawnPlayerOnGround() {
        let highestY = 5;
        for (let y = 35; y >= 0; y--) {
            if (this.isBlockSolid(0, y, 0)) {
                highestY = y;
                break;
            }
        }
        this.playerX = 0;
        this.playerY = highestY + 1.05;
        this.playerZ = 0;
        this.camera.position.set(0, this.playerY + this.eyeHeight, 0);
        this.velocityY = 0;
        this.isGrounded = true;
    }

    getKey(x, y, z) {
        return `${x},${y},${z}`;
    }

    isBlockSolid(x, y, z) {
        const blockId = this.world.get(this.getKey(Math.floor(x), Math.floor(y), Math.floor(z)));
        if (!blockId) return false;
        if (blockId.includes('leaves') || blockId.includes('flower') || blockId.includes('glass')) {
            return false;
        }
        return true;
    }

    /**
     * Detección de Colisiones del Personaje con Bloques Sólidos
     */
    checkCollision(px, py, pz) {
        const minX = Math.floor(px - this.playerRadius);
        const maxX = Math.floor(px + this.playerRadius);
        const minY = Math.floor(py);
        const maxY = Math.floor(py + this.playerHeight);
        const minZ = Math.floor(pz - this.playerRadius);
        const maxZ = Math.floor(pz + this.playerRadius);

        for (let bx = minX; bx <= maxX; bx++) {
            for (let by = minY; by <= maxY; by++) {
                for (let bz = minZ; bz <= maxZ; bz++) {
                    if (this.isBlockSolid(bx, by, bz)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    createBlockMesh(x, y, z, blockId) {
        const key = this.getKey(x, y, z);
        if (this.blockMeshes.has(key)) return;

        const mat = this.blockMaterials[blockId];
        if (!mat) return;

        const mesh = new THREE.Mesh(this.boxGeometry, mat);
        mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
        mesh.userData = { x, y, z, blockId };
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        this.scene.add(mesh);
        this.blockMeshes.set(key, mesh);
    }

    setBlock(x, y, z, blockId, broadcastNetwork = true) {
        const key = this.getKey(x, y, z);
        if (this.world.has(key)) {
            const oldMesh = this.blockMeshes.get(key);
            if (oldMesh) this.scene.remove(oldMesh);
            this.blockMeshes.delete(key);
        }

        if (!blockId) {
            this.world.delete(key);
            if (window.isMultiplayerMode && broadcastNetwork && window.minecraftMultiplayer) {
                window.minecraftMultiplayer.sendBlockBreak(x, y, z);
            }
            return;
        }

        this.world.set(key, blockId);
        this.createBlockMesh(x, y, z, blockId);

        if (window.isMultiplayerMode && broadcastNetwork && window.minecraftMultiplayer) {
            window.minecraftMultiplayer.sendBlockPlace(x, y, z, blockId);
        }
    }

    removeBlock(x, y, z, broadcastNetwork = true) {
        this.setBlock(x, y, z, null, broadcastNetwork);
    }

    spawnBlockParticles(x, y, z, blockId) {
        if (!this.particles) this.particles = [];
        const item = this.ITEMS.find(i => i.id === blockId) || { color: '#888888' };
        const particleColor = item.color || item.side || item.top || '#7a7a7a';

        const partGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
        const partMat = new THREE.MeshLambertMaterial({
            color: new THREE.Color(particleColor),
            transparent: true,
            opacity: 0.95
        });

        for (let i = 0; i < 14; i++) {
            const mesh = new THREE.Mesh(partGeo, partMat.clone());
            mesh.position.set(
                x + 0.2 + Math.random() * 0.6,
                y + 0.2 + Math.random() * 0.6,
                z + 0.2 + Math.random() * 0.6
            );
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 4.2,
                Math.random() * 3.8 + 1.8,
                (Math.random() - 0.5) * 4.2
            );
            this.scene.add(mesh);
            this.particles.push({
                mesh,
                velocity,
                life: 0.6,
                maxLife: 0.6
            });
        }
    }

    removeBlock(x, y, z) {
        const key = this.getKey(x, y, z);
        const blockId = this.world.get(key);
        if (blockId) {
            this.spawnBlockParticles(x, y, z, blockId);
            const mesh = this.blockMeshes.get(key);
            if (mesh) {
                this.scene.remove(mesh);
                this.blockMeshes.delete(key);
            }
            this.world.delete(key);
            this.playSound('break', blockId);

            // Revelar dinámicamente bloques vecinos ahora expuestos
            const neighbors = [
                [x + 1, y, z], [x - 1, y, z],
                [x, y + 1, z], [x, y - 1, z],
                [x, y, z + 1], [x, y, z - 1]
            ];
            neighbors.forEach(([nx, ny, nz]) => {
                const nKey = this.getKey(nx, ny, nz);
                const nBlockId = this.world.get(nKey);
                if (nBlockId && !this.blockMeshes.has(nKey)) {
                    this.createBlockMesh(nx, ny, nz, nBlockId);
                }
            });
        }
    }

    /**
     * Controles en Primera Persona (WASD + Mouse Look)
     */
    setupEventListeners() {
        const playBtn = document.getElementById('btn-play-sandbox');
        const blocker = document.getElementById('sandbox-blocker');

        let lastMouseX = 0;
        let lastMouseY = 0;

        const startGame = () => {
            if (this.blocker) this.blocker.style.display = 'none';
            if (blocker) blocker.style.display = 'none';
            this.isLocked = true;
            try {
                if (this.container && typeof this.container.requestPointerLock === 'function') {
                    this.container.requestPointerLock();
                }
            } catch (err) {
                console.warn('Pointer lock request fallback:', err);
            }
        };

        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startGame();
            });
        }

        if (blocker) {
            blocker.addEventListener('click', (e) => {
                startGame();
            });
        }

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === this.container || document.pointerLockElement === document.body) {
                this.isLocked = true;
                if (this.blocker) this.blocker.style.display = 'none';
            }
        });

        // Movimiento de Ratón / Trackpad (FPS 360° Camera Look) sin límites ni trabas
        document.addEventListener('mousemove', (e) => {
            const sandboxScreen = document.getElementById('sandbox-screen');
            if (!sandboxScreen || sandboxScreen.classList.contains('hidden')) return;

            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

            let movementX = 0;
            let movementY = 0;

            if (typeof e.movementX === 'number' && e.movementX !== 0) {
                movementX = e.movementX;
                movementY = e.movementY || 0;
            } else if (lastMouseX !== 0 && lastMouseY !== 0) {
                movementX = e.clientX - lastMouseX;
                movementY = e.clientY - lastMouseY;
            }
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;

            // Si el puntero está bloqueado o el usuario está interactuando con el mapa
            if (!this.isLocked && document.pointerLockElement !== this.container && document.pointerLockElement !== document.body) {
                return;
            }

            const sensitivity = 0.0032;
            this.yaw -= movementX * sensitivity;
            this.pitch -= movementY * sensitivity;

            const maxPitch = Math.PI / 2 - 0.02;
            this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

            this.camera.rotation.set(0, 0, 0, 'YXZ');
            this.camera.rotation.y = this.yaw;
            this.camera.rotation.x = this.pitch;
        });

        // Teclado (Multidispositivo WASD + Teclas de Flecha + E + ESC + Digit 1-9)
        document.addEventListener('keydown', (e) => {
            const sandboxScreen = document.getElementById('sandbox-screen');
            if (!sandboxScreen || sandboxScreen.classList.contains('hidden')) return;

            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                return; // Si el foco está en la barra de chat o nick, no interceptar teclas del juego
            }

            const k = (e.key || '').toLowerCase();
            const code = e.code || '';

            // Presionar T o Enter para abrir el chat multijugador
            if ((code === 'KeyT' || code === 'Enter' || k === 't') && window.isMultiplayerMode) {
                const chatInput = document.getElementById('mp-chat-input');
                if (chatInput) {
                    e.preventDefault();
                    this.isLocked = false;
                    if (document.exitPointerLock) {
                        try { document.exitPointerLock(); } catch(err) {}
                    }
                    chatInput.focus();
                    return;
                }
            }

            if (code === 'F5' || k === 'f5') {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCameraMode();
                return;
            }

            if (code === 'KeyE' || k === 'e') {
                e.preventDefault();
                this.togglePalette();
                return;
            }

            if (code === 'Escape' || k === 'escape') {
                const paletteModal = document.getElementById('palette-modal');
                if (paletteModal && paletteModal.style.display === 'flex') {
                    paletteModal.style.display = 'none';
                    this.requestPointerLock();
                    return;
                }
                this.isLocked = false;
                if (this.blocker) this.blocker.style.display = 'flex';
                if (document.exitPointerLock) {
                    try { document.exitPointerLock(); } catch(err) {}
                }
                return;
            }

            if (!this.isLocked) return;

            if (code === 'KeyW' || k === 'w' || code === 'ArrowUp') this.moveState.forward = true;
            if (code === 'KeyS' || k === 's' || code === 'ArrowDown') this.moveState.backward = true;
            if (code === 'KeyA' || k === 'a' || code === 'ArrowLeft') this.moveState.left = true;
            if (code === 'KeyD' || k === 'd' || code === 'ArrowRight') this.moveState.right = true;
            if (code === 'Space' || k === ' ') { this.moveState.up = true; e.preventDefault(); }
            if (code === 'ShiftLeft' || code === 'ShiftRight' || k === 'shift' || k === 'c') this.moveState.down = true;
            if (code === 'KeyF' || k === 'f') { this.isFlightMode = !this.isFlightMode; this.velocityY = 0; }

            if (code.startsWith('Digit') || (k >= '1' && k <= '9')) {
                const num = parseInt(k) || parseInt(code.replace('Digit', ''));
                if (num >= 1 && num <= 9) this.selectSlot(num - 1);
            }
        });

        document.addEventListener('keyup', (e) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                return;
            }

            const k = (e.key || '').toLowerCase();
            const code = e.code || '';

            if (code === 'KeyW' || k === 'w' || code === 'ArrowUp') this.moveState.forward = false;
            if (code === 'KeyS' || k === 's' || code === 'ArrowDown') this.moveState.backward = false;
            if (code === 'KeyA' || k === 'a' || code === 'ArrowLeft') this.moveState.left = false;
            if (code === 'KeyD' || k === 'd' || code === 'ArrowRight') this.moveState.right = false;
            if (code === 'Space' || k === ' ') this.moveState.up = false;
            if (code === 'ShiftLeft' || code === 'ShiftRight' || k === 'shift' || k === 'c') this.moveState.down = false;
        });

        // Clic de Ratón (Romper, Colocar y Comer Alimentos)
        window.addEventListener('mousedown', (e) => {
            const sandboxScreen = document.getElementById('sandbox-screen');
            if (!sandboxScreen || sandboxScreen.classList.contains('hidden')) return;

            // Activar juego al hacer clic en cualquier parte del canvas 3D
            if (!this.isLocked && (e.target === this.container || e.target.tagName === 'CANVAS')) {
                startGame();
            }

            if (!this.isLocked) return;

            const activeItem = this.hotbarSlots[this.activeSlotIndex];

            // Si el jugador sostiene un alimento y hace clic derecho/izquierdo sin bloque
            if (activeItem && (activeItem.isFood || activeItem.category === 'food')) {
                if (e.button === 2 || e.button === 0) {
                    e.preventDefault();
                    this.eatFood(activeItem);
                    return;
                }
            }

            this.triggerHandSwing();
            const target = this.getTargetBlock();

            if (e.button === 0) {
                // Clic Izquierdo: Atacar Jugador O Romper Bloque
                let attacked = false;
                if (window.isMultiplayerMode && window.minecraftMultiplayer) {
                    attacked = this.tryAttackPlayer();
                }

                if (!attacked) {
                    if (target && target.object.userData.blockId !== 'bedrock') {
                        const ud = target.object.userData;
                        this.removeBlock(ud.x, ud.y, ud.z);
                    } else {
                        this.playSound('swing');
                    }
                }
            } else if (e.button === 2) {
                // Clic Derecho: Colocar Bloque (solo si no es herramienta ni alimento)
                e.preventDefault();
                if (activeItem && !activeItem.isTool && !activeItem.isFood && activeItem.category !== 'food' && target) {
                    const normal = target.face.normal;
                    const ud = target.object.userData;
                    const newX = ud.x + normal.x;
                    const newY = ud.y + normal.y;
                    const newZ = ud.z + normal.z;

                    // No colocar bloque dentro del cuerpo del jugador
                    const feetY = this.camera.position.y - this.eyeHeight;
                    const isInsidePlayer = Math.floor(newX) === Math.floor(this.camera.position.x) &&
                                          Math.floor(newZ) === Math.floor(this.camera.position.z) &&
                                          (Math.floor(newY) === Math.floor(feetY) || Math.floor(newY) === Math.floor(feetY + 1));

                    if (!isInsidePlayer) {
                        this.setBlock(newX, newY, newZ, activeItem.id);
                        this.playSound('place');
                    }
                }
            }
        });

        window.addEventListener('contextmenu', (e) => {
            const sandboxScreen = document.getElementById('sandbox-screen');
            if (sandboxScreen && !sandboxScreen.classList.contains('hidden')) {
                e.preventDefault();
            }
        });

        // Rueda del Ratón para cambiar Hotbar
        window.addEventListener('wheel', (e) => {
            if (!this.isLocked) return;
            if (e.deltaY > 0) {
                this.selectSlot((this.activeSlotIndex + 1) % 9);
            } else if (e.deltaY < 0) {
                this.selectSlot((this.activeSlotIndex + 8) % 9);
            }
        });

        window.addEventListener('resize', () => this.onResize());

        // Botones superiores de la barra de herramientas
        const btnCamera = document.getElementById('btn-camera-toggle');
        if (btnCamera) btnCamera.addEventListener('click', () => this.toggleCameraMode());

        const btnInv = document.getElementById('btn-inventory-toggle');
        if (btnInv) btnInv.addEventListener('click', () => this.togglePalette());

        const btnNewWorld = document.getElementById('btn-new-world');
        if (btnNewWorld) {
            btnNewWorld.addEventListener('click', () => {
                this.generateTerrain();
                this.spawnPlayerOnGround();
            });
        }
    }

    toggleCameraMode() {
        this.cameraMode = ((this.cameraMode || 0) + 1) % 3;
        const names = ['PRIMERA PERSONA (1st)', 'TERCERA PERSONA (ESPALDA)', 'TERCERA PERSONA (FRENTE)'];
        this.showToast(`📷 CÁMARA: ${names[this.cameraMode]}`);
    }

    showToast(msg) {
        let toastBox = document.getElementById('sandbox-toast');
        if (!toastBox) {
            toastBox = document.createElement('div');
            toastBox.id = 'sandbox-toast';
            toastBox.style.cssText = `
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.88);
                border: 2px solid #55ff55;
                color: #ffff55;
                font-family: var(--mc-font-pixel), sans-serif;
                font-size: 13px;
                padding: 8px 16px;
                border-radius: 4px;
                z-index: 2000;
                pointer-events: none;
                text-shadow: 1px 1px 0 #000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.8);
            `;
            document.body.appendChild(toastBox);
        }
        toastBox.textContent = msg;
        toastBox.style.display = 'block';
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toastBox.style.display = 'none';
        }, 2200);
    }

    eatFood(foodItem) {
        if (!foodItem) return;

        this.triggerHandSwing();
        this.playEatSound();

        // Regenerar salud (HP)
        const heal = foodItem.healAmount || 6;
        this.playerHp = Math.min(20, (this.playerHp || 10) + heal);

        // Actualizar HUD de corazones de vida
        this.updateHudHearts();

        // Notificación flotante de consumo de alimento
        if (this.tooltipEl) {
            this.tooltipEl.textContent = `¡Comiste ${foodItem.name}! (+${heal / 2} HP ❤)`;
            this.tooltipEl.classList.add('visible');
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(() => {
                this.tooltipEl.classList.remove('visible');
            }, 2500);
        }
    }

    updateHudHearts() {
        const heartsContainer = document.querySelector('.hud-hearts-container');
        if (!heartsContainer) return;

        const hp = this.playerHp || 20;
        const activeHearts = Math.ceil(hp / 2);

        let html = '';
        for (let i = 0; i < 10; i++) {
            if (i < activeHearts) {
                html += `<span class="hud-heart" style="color: #ff70a6; filter: drop-shadow(1px 1px 0 #000);">🩷</span>`;
            } else {
                html += `<span class="hud-heart" style="opacity: 0.35; filter: grayscale(100%);">🩷</span>`;
            }
        }
        heartsContainer.innerHTML = html;
    }

    playEatSound() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        try {
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(180 + Math.random() * 120, this.audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start();
                    osc.stop(this.audioCtx.currentTime + 0.05);
                }, i * 90);
            }
        } catch (e) {}
    }

    tryAttackPlayer() {
        if (!window.isMultiplayerMode || !window.minecraftMultiplayer) return false;

        const attackerX = this.playerX;
        const attackerY = this.playerY + this.eyeHeight;
        const attackerZ = this.playerZ;

        // Vector de vista del atacante
        const lookDir = new THREE.Vector3(
            -Math.sin(this.yaw) * Math.cos(this.pitch),
            Math.sin(this.pitch),
            -Math.cos(this.yaw) * Math.cos(this.pitch)
        ).normalize();

        let targetId = null;
        let minDistance = 3.8; // Rango de ataque (3.8m)

        // Detección Dual: Raycast preciso + Proximidad Angular
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.centerCoords, this.camera);

        for (const [id, remoteP] of window.minecraftMultiplayer.remotePlayers.entries()) {
            if (!remoteP || !remoteP.mesh) continue;

            let hit = false;
            let dist = 999;

            const intersects = raycaster.intersectObject(remoteP.mesh, true);
            if (intersects.length > 0) {
                hit = true;
                dist = intersects[0].distance;
            } else {
                // Detección por Proximidad Angular (si miras al jugador dentro de 3.8m)
                const targetPos = new THREE.Vector3(remoteP.x, remoteP.y + 0.9, remoteP.z);
                const toTarget = new THREE.Vector3().subVectors(targetPos, new THREE.Vector3(attackerX, attackerY, attackerZ));
                const d = toTarget.length();
                toTarget.normalize();
                const dot = lookDir.dot(toTarget);

                if (d <= minDistance && dot > 0.40) {
                    hit = true;
                    dist = d;
                }
            }

            if (hit && dist <= minDistance) {
                targetId = id;
                minDistance = dist;
            }
        }

        if (targetId) {
            // Dirección de empuje (knockback hacia atrás)
            const kx = -Math.sin(this.yaw);
            const kz = -Math.cos(this.yaw);

            const activeItem = this.hotbarSlots[this.activeSlotIndex];
            const isSword = activeItem && (activeItem.id.includes('sword') || (activeItem.name && activeItem.name.toLowerCase().includes('espada')));
            const damage = isSword ? 2 : 1; // Espada: 2 HP (1 corazón), Mano/Herramienta: 1 HP (medio corazón)

            window.minecraftMultiplayer.sendPlayerAttack(targetId, damage, kx, kz);
            this.playHitSound();
            return true;
        }

        return false;
    }

    receiveAttack(damage = 1, kx = 0, kz = 0) {
        // 1. Reducir HP
        this.playerHp = Math.max(0, (this.playerHp || 20) - damage);
        this.updateHudHearts();

        // 2. Sonido de recibir daño
        this.playHurtSound();

        // 3. Impulso de Knockback estilo Minecraft (Velocidad horizontal + Salto vertical)
        const force = 14.0;
        this.knockbackX = (kx || 0) * force;
        this.knockbackZ = (kz || 0) * force;
        this.velocityY = 5.5; // Impulso vertical hacia arriba
        this.isGrounded = false;

        // 4. Destello rojo en el modelo del personaje
        if (this.localPlayerMesh && typeof flashRedDamageAnimation === 'function') {
            flashRedDamageAnimation(this.localPlayerMesh);
        }

        // 5. Notificación en pantalla
        const heartsLost = damage / 2;
        this.showToast(`💥 ¡Recibiste un golpe! (-${heartsLost} ❤)`);

        // 6. Muerte y Respawn
        if (this.playerHp <= 0) {
            this.showToast(`☠ ¡Has muerto! Regenerando vida...`);
            setTimeout(() => {
                this.playerHp = 20;
                this.updateHudHearts();
                this.spawnPlayerOnGround();
            }, 1200);
        }
    }

    playHurtSound() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(70, this.audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.15);
        } catch (e) {}
    }

    playHitSound() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(340, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.08);
        } catch (e) {}
    }

    requestPointerLock() {
        if (this.blocker) this.blocker.style.display = 'none';
        this.isLocked = true;
        if (this.container && typeof this.container.requestPointerLock === 'function') {
            try {
                this.container.requestPointerLock();
            } catch (e) {}
        }
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || (window.innerHeight - 58);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    getTargetBlock() {
        this.raycaster.setFromCamera(this.centerCoords, this.camera);
        this.raycaster.far = 7.0;
        const meshes = Array.from(this.blockMeshes.values());
        const intersects = this.raycaster.intersectObjects(meshes);
        return intersects.length > 0 ? intersects[0] : null;
    }

    /**
     * Hotbar y Herramienta en Mano
     */
    renderHotbar() {
        if (!this.hotbarEl) return;
        this.hotbarEl.innerHTML = '';

        this.hotbarSlots.forEach((item, idx) => {
            if (!item) item = this.ITEMS[0];
            const slot = document.createElement('div');
            slot.className = `hotbar-slot ${idx === this.activeSlotIndex ? 'active' : ''}`;
            slot.dataset.index = idx;

            const slotNum = document.createElement('span');
            slotNum.className = 'slot-number';
            slotNum.textContent = idx + 1;
            slot.appendChild(slotNum);

            const texData = this.createPixelTexture(item, item.isTool ? 'tool' : 'top');
            const preview = document.createElement('canvas');
            preview.width = 38;
            preview.height = 38;
            const pCtx = preview.getContext('2d');
            pCtx.imageSmoothingEnabled = false;
            pCtx.drawImage(texData.canvas, 0, 0, 38, 38);
            slot.appendChild(preview);

            slot.addEventListener('click', () => {
                this.selectSlot(idx);
            });

            this.hotbarEl.appendChild(slot);
        });

        this.showTooltip();
    }

    selectSlot(idx) {
        this.activeSlotIndex = idx;
        const slots = document.querySelectorAll('.hotbar-slot');
        slots.forEach((s, i) => {
            if (i === idx) s.classList.add('active');
            else s.classList.remove('active');
        });
        this.showTooltip();
        this.updateHandItem();
    }

    showTooltip() {
        if (!this.tooltipEl) return;
        const activeItem = this.hotbarSlots[this.activeSlotIndex];
        if (activeItem) {
            this.tooltipEl.textContent = activeItem.name;
            this.tooltipEl.classList.add('visible');
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(() => {
                this.tooltipEl.classList.remove('visible');
            }, 2000);
        }
    }

    updateHandItem() {
        if (!this.handCanvas) return;
        let activeItem = this.hotbarSlots[this.activeSlotIndex];
        if (!activeItem) activeItem = this.ITEMS[0];

        const ctx = this.handCanvas.getContext('2d');
        ctx.clearRect(0, 0, 128, 128);
        ctx.imageSmoothingEnabled = false;

        const texData = this.createPixelTexture(activeItem, activeItem.isTool ? 'tool' : 'top');
        if (texData && texData.canvas) {
            ctx.drawImage(texData.canvas, 0, 0, 128, 128);
        }
    }

    triggerHandSwing() {
        if (!this.handEl) return;
        this.handEl.classList.remove('swinging');
        void this.handEl.offsetWidth;
        this.handEl.classList.add('swinging');
    }

    /**
     * Modal de Inventario Creativo y Mochila Completa (Tecla E)
     */
    setupPaletteModal() {
        const modalContent = document.getElementById('palette-content');
        if (!modalContent) return;

        modalContent.innerHTML = `
            <div class="palette-header">
                <h2 style="font-family: var(--mc-font-pixel); font-size: 13px; color: #3f3f3f; margin-bottom: 8px;">Mochila & Inventario Creativo (Tecla E)</h2>
                <div class="palette-categories" id="palette-categories">
                    <button class="mc-btn mc-btn-sm cat-btn active" data-cat="all">Todos</button>
                    <button class="mc-btn mc-btn-sm cat-btn" data-cat="tools">⚔ Armas & Herramientas</button>
                    <button class="mc-btn mc-btn-sm cat-btn" data-cat="blocks">🧱 Bloques</button>
                    <button class="mc-btn mc-btn-sm cat-cat" data-cat="minerals">💎 Minerales</button>
                    <button class="mc-btn mc-btn-sm cat-btn" data-cat="food">🍎 Comida</button>
                </div>
            </div>

            <div class="palette-grid" id="palette-grid"></div>

            <div class="palette-hotbar-preview-section">
                <p style="font-size: 11px; font-weight: 700; color: #444; margin-bottom: 4px;">Asignar a Ranura de Hotbar Activa (Slot #${this.activeSlotIndex + 1}):</p>
                <div id="palette-hotbar-slots" class="palette-hotbar-slots"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="font-size: 11px; color: #666;">Haz clic en cualquier ítem para equiparlo en tu Hotbar.</span>
                <button class="mc-btn mc-btn-sm" id="btn-close-palette">Cerrar (E / ESC)</button>
            </div>
        `;

        const renderGrid = (category = 'all') => {
            const grid = document.getElementById('palette-grid');
            if (!grid) return;
            grid.innerHTML = '';

            const filteredItems = category === 'all' 
                ? this.ITEMS 
                : this.ITEMS.filter(i => (i.category === category) || (category === 'tools' && i.isTool));

            filteredItems.forEach(item => {
                const el = document.createElement('div');
                el.className = 'palette-item';
                el.title = `${item.name} (Clic para equipar en slot #${this.activeSlotIndex + 1})`;

                const texData = this.createPixelTexture(item, item.isTool ? 'tool' : 'top');
                const preview = document.createElement('canvas');
                preview.width = 38;
                preview.height = 38;
                const pCtx = preview.getContext('2d');
                pCtx.imageSmoothingEnabled = false;
                pCtx.drawImage(texData.canvas, 0, 0, 38, 38);
                el.appendChild(preview);

                const nameLabel = document.createElement('span');
                nameLabel.className = 'palette-item-name';
                nameLabel.textContent = item.name.split(' ')[0];
                el.appendChild(nameLabel);

                el.addEventListener('click', () => {
                    this.hotbarSlots[this.activeSlotIndex] = item;
                    this.renderHotbar();
                    this.updateHandItem();
                    this.renderPaletteHotbarSlots();
                    this.playSound('place');
                });

                grid.appendChild(el);
            });
        };

        renderGrid('all');

        const catBtns = modalContent.querySelectorAll('.cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderGrid(btn.dataset.cat);
            });
        });

        this.renderPaletteHotbarSlots();

        const closeBtn = document.getElementById('btn-close-palette');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.togglePalette();
            });
        }
    }

    renderPaletteHotbarSlots() {
        const container = document.getElementById('palette-hotbar-slots');
        if (!container) return;
        container.innerHTML = '';

        this.hotbarSlots.forEach((item, idx) => {
            const slot = document.createElement('div');
            slot.className = `palette-mini-slot ${idx === this.activeSlotIndex ? 'active' : ''}`;
            slot.title = `Slot ${idx + 1}: ${item ? item.name : 'Vacío'}`;

            if (item) {
                const texData = this.createPixelTexture(item, item.isTool ? 'tool' : 'top');
                const preview = document.createElement('canvas');
                preview.width = 28;
                preview.height = 28;
                const pCtx = preview.getContext('2d');
                pCtx.imageSmoothingEnabled = false;
                pCtx.drawImage(texData.canvas, 0, 0, 28, 28);
                slot.appendChild(preview);
            }

            slot.addEventListener('click', () => {
                this.selectSlot(idx);
                this.renderPaletteHotbarSlots();
            });

            container.appendChild(slot);
        });
    }

    togglePalette() {
        const modal = document.getElementById('palette-modal');
        if (!modal) return;
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
            this.requestPointerLock();
        } else {
            modal.style.display = 'flex';
            this.setupPaletteModal();
            if (document.exitPointerLock) document.exitPointerLock();
        }
    }

    toggleStructuresModal() {
        const modal = document.getElementById('structures-modal');
        if (!modal) return;
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
            this.requestPointerLock();
        } else {
            modal.style.display = 'flex';
            this.setupStructuresEvents();
            if (document.exitPointerLock) document.exitPointerLock();
        }
    }

    setupStructuresEvents() {
        const closeBtn = document.getElementById('btn-close-structures');
        if (closeBtn) {
            closeBtn.onclick = () => this.toggleStructuresModal();
        }

        const toolbarBtn = document.getElementById('btn-structures-toggle');
        if (toolbarBtn && !toolbarBtn.dataset.bound) {
            toolbarBtn.dataset.bound = 'true';
            toolbarBtn.onclick = () => this.toggleStructuresModal();
        }

        const presetBtns = document.querySelectorAll('.btn-paste-preset');
        presetBtns.forEach(btn => {
            btn.onclick = () => {
                const preset = btn.getAttribute('data-preset');
                const yaw = this.yaw || 0;
                const dist = 7;
                const px = Math.floor((this.playerX || 0) - Math.sin(yaw) * dist);
                const pz = Math.floor((this.playerZ || 0) - Math.cos(yaw) * dist);
                const py = Math.max(2, Math.floor(this.playerY || 5));

                if (preset === 'cherry_arch') {
                    this.buildCherryArch(px, py, pz);
                    this.showToast(`🌸 ¡Arco de Jardín Cerezo construido frente a ti!`);
                } else if (preset === 'picnic_spot') {
                    this.buildPicnicSpot(px, py, pz);
                    this.showToast(`🧺 ¡Área de Picnic Cute construida frente a ti!`);
                } else if (preset === 'wishing_well') {
                    this.buildWishingWell(px, py, pz);
                    this.showToast(`⛲ ¡Pozo Místico de los Deseos construido frente a ti!`);
                } else if (preset === 'cottage_house') {
                    this.buildCottageHouse(px, py, pz);
                    this.showToast(`🏠 ¡Cabaña de Bibliotecario construida frente a ti!`);
                }

                this.toggleStructuresModal();
            };
        });
    }

    buildCherryArch(centerX, groundY, centerZ) {
        // Arco de Jardín Cerezo (Exacto a la Foto 2 - media_1788364336972.jpg)
        for (let dz = -2; dz <= 2; dz++) {
            for (let dx = -1; dx <= 1; dx++) {
                this.setBlock(centerX + dx, groundY, centerZ + dz, 'dirt');
            }
        }
        [-2, 2].forEach(px => {
            this.setBlock(centerX + px, groundY + 1, centerZ, 'pink_quartz');
            this.setBlock(centerX + px, groundY + 2, centerZ, 'cherry_leaves');
            this.setBlock(centerX + px, groundY + 3, centerZ, 'cherry_leaves');
            for (let dy = 4; dy <= 6; dy++) {
                this.setBlock(centerX + px, groundY + dy, centerZ, 'pink_quartz');
            }
        });
        for (let dx = -2; dx <= 2; dx++) {
            this.setBlock(centerX + dx, groundY + 7, centerZ, 'pink_quartz');
        }
        this.setBlock(centerX - 1, groundY + 6, centerZ, 'pink_quartz');
        this.setBlock(centerX + 1, groundY + 6, centerZ, 'pink_quartz');
    }

    buildPicnicSpot(centerX, groundY, centerZ) {
        // Área de Picnic Cute (Exacta a la Foto 3 - media_1788364350321.jpg)
        for (let dx = -2; dx <= 1; dx++) {
            for (let dz = -2; dz <= 1; dz++) {
                const isRed = (Math.abs(dx + dz) % 2 === 0);
                this.setBlock(centerX + dx, groundY, centerZ + dz, isRed ? 'red_wool' : 'pink_quartz');
            }
        }
        this.setBlock(centerX, groundY + 1, centerZ, 'pink_glass');
        this.setBlock(centerX - 2, groundY + 1, centerZ - 2, 'oak_log');
        this.setBlock(centerX + 2, groundY, centerZ, 'dirt');
        this.setBlock(centerX - 3, groundY, centerZ + 1, 'dirt');
    }

    buildWishingWell(centerX, groundY, centerZ) {
        // Pozo Místico de los Deseos (Exacto a la Foto 4 - media_1788364358649.jpg)
        for (let dx = -2; dx <= 2; dx++) {
            for (let dz = -2; dz <= 2; dz++) {
                const isEdge = (Math.abs(dx) === 2 || Math.abs(dz) === 2);
                if (isEdge) {
                    this.setBlock(centerX + dx, groundY + 1, centerZ + dz, 'stone');
                } else {
                    this.setBlock(centerX + dx, groundY + 1, centerZ + dz, 'pink_glass');
                }
            }
        }
        [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(([dx, dz]) => {
            for (let dy = 2; dy <= 5; dy++) {
                this.setBlock(centerX + dx, groundY + dy, centerZ + dz, 'oak_log');
            }
        });
        for (let dx = -3; dx <= 3; dx++) {
            for (let dz = -3; dz <= 3; dz++) {
                if (Math.abs(dx) <= 2 && Math.abs(dz) <= 2) {
                    this.setBlock(centerX + dx, groundY + 6, centerZ + dz, 'stone');
                }
            }
        }
        this.setBlock(centerX - 3, groundY + 5, centerZ - 2, 'leaves');
        this.setBlock(centerX + 3, groundY + 5, centerZ + 2, 'leaves');
    }

    buildCottageHouse(centerX, groundY, centerZ) {
        // Casa de Bibliotecario / Cabaña Cute (wbuilds.app)
        const height = 4;
        for (let dx = -3; dx <= 3; dx++) {
            for (let dz = -3; dz <= 3; dz++) {
                this.setBlock(centerX + dx, groundY, centerZ + dz, 'stone');
            }
        }
        [[-3, -3], [3, -3], [-3, 3], [3, 3]].forEach(([dx, dz]) => {
            for (let dy = 1; dy <= height; dy++) {
                this.setBlock(centerX + dx, groundY + dy, centerZ + dz, 'oak_log');
            }
        });
        for (let dy = 1; dy < height; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const isWindow = (dy === 2 && Math.abs(dx) === 1);
                this.setBlock(centerX + dx, groundY + dy, centerZ - 3, isWindow ? 'pink_glass' : 'pink_quartz');
                this.setBlock(centerX + dx, groundY + dy, centerZ + 3, isWindow ? 'pink_glass' : 'pink_quartz');
            }
            for (let dz = -2; dz <= 2; dz++) {
                const isWindow = (dy === 2 && Math.abs(dz) === 1);
                this.setBlock(centerX - 3, groundY + dy, centerZ + dz, isWindow ? 'pink_glass' : 'pink_quartz');
                this.setBlock(centerX + 3, groundY + dy, centerZ + dz, isWindow ? 'pink_glass' : 'pink_quartz');
            }
        }
        this.setBlock(centerX, groundY + 1, centerZ + 3, 'planks');
        this.setBlock(centerX, groundY + 2, centerZ + 3, 'pink_glass');

        for (let step = 0; step <= 3; step++) {
            const r = 3 - step;
            for (let dx = -r; dx <= r; dx++) {
                for (let dz = -r; dz <= r; dz++) {
                    this.setBlock(centerX + dx, groundY + height + step, centerZ + dz, 'cherry_log');
                }
            }
        }
    }

    /**
     * Sintetizador de Sonidos Web Audio
     */
    playSound(type, blockId = '') {
        try {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) this.audioCtx = new AudioContext();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            if (!this.audioCtx) return;

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            if (type === 'break') {
                let baseFreq = 160;
                if (blockId.includes('stone') || blockId.includes('ore') || blockId.includes('bedrock')) baseFreq = 220;
                else if (blockId.includes('wood') || blockId.includes('log') || blockId.includes('plank')) baseFreq = 130;
                else if (blockId.includes('leaves') || blockId.includes('grass')) baseFreq = 90;

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(baseFreq + Math.random() * 40, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime + 0.09);
                gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.09);
            } else if (type === 'place') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(340 + Math.random() * 60, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.06);
                gain.gain.setValueAtTime(0.28, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.06);
            } else if (type === 'jump') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.09);
                gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.09);
            } else {
                // Swing
                osc.type = 'sine';
                osc.frequency.setValueAtTime(240, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(70, this.audioCtx.currentTime + 0.07);
                gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.07);
            }

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.1);
        } catch (e) {}
    }

    /**
     * Bucle Principal de Renderizado, Nubes, Partículas, Fauna 3D y Físicas
     */
    animate(currentTime) {
        requestAnimationFrame((t) => this.animate(t));

        const delta = Math.min((currentTime - this.lastTime) / 1000, 0.05);
        this.lastTime = currentTime;

        const sandboxScreen = document.getElementById('sandbox-screen');
        if (!sandboxScreen || sandboxScreen.classList.contains('hidden')) return;

        // 1. Movimiento continuo de nubes cúbicas
        if (this.cloudsGroup) {
            this.cloudsGroup.children.forEach(cloud => {
                cloud.position.x += delta * 1.5;
                if (cloud.position.x > 80) cloud.position.x = -80;
            });
        }

        // 2. Actualizar fauna y animales 3D voxel adaptados al terreno (Suelo real sin subirse a hojas)
        if (this.animals && this.animals.length > 0) {
            this.animals.forEach(animal => animal.update(delta, (x, z) => this.getAnimalGroundY(x, z)));
        }

        // 3. Actualizar física de partículas de rotura de bloques
        if (this.particles && this.particles.length > 0) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.life -= delta;
                p.velocity.y -= 18 * delta;
                p.mesh.position.addScaledVector(p.velocity, delta);
                p.mesh.rotation.x += 4 * delta;
                p.mesh.rotation.y += 4 * delta;
                p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
                const scale = Math.max(0.01, p.life / p.maxLife);
                p.mesh.scale.set(scale, scale, scale);

                if (p.life <= 0) {
                    this.scene.remove(p.mesh);
                    p.mesh.geometry.dispose();
                    p.mesh.material.dispose();
                    this.particles.splice(i, 1);
                }
            }
        }

        // 4. Lluvia constante de pétalos de Cerezo Sakura (Cherry Petals Falling)
        if (!this.sakuraPetals) {
            this.sakuraPetals = [];
            const petalGeo = new THREE.PlaneGeometry(0.14, 0.14);
            const petalMat = new THREE.MeshBasicMaterial({ color: 0xff80ab, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });

            for (let i = 0; i < 70; i++) {
                const mesh = new THREE.Mesh(petalGeo, petalMat);
                mesh.position.set((Math.random() - 0.5) * 100, 10 + Math.random() * 20, (Math.random() - 0.5) * 100);
                mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                this.scene.add(mesh);
                this.sakuraPetals.push({
                    mesh,
                    rotSpeed: 1 + Math.random() * 2,
                    fallSpeed: 1.2 + Math.random() * 1.5,
                    sway: Math.random() * Math.PI * 2
                });
            }
        } else {
            this.sakuraPetals.forEach(p => {
                p.sway += delta * 2;
                p.mesh.position.y -= p.fallSpeed * delta;
                p.mesh.position.x += Math.sin(p.sway) * 0.4 * delta;
                p.mesh.rotation.z += p.rotSpeed * delta;

                if (p.mesh.position.y < 2) {
                    p.mesh.position.y = 22 + Math.random() * 8;
                    p.mesh.position.x = (Math.random() - 0.5) * 100;
                    p.mesh.position.z = (Math.random() - 0.5) * 100;
                }
            });
        }

        if (this.isLocked) {
            let px = typeof this.playerX === 'number' ? this.playerX : 0;
            let py = typeof this.playerY === 'number' ? this.playerY : 12;
            let pz = typeof this.playerZ === 'number' ? this.playerZ : 0;

            if (this.isFlightMode) {
                // Modo Vuelo Libre
                const speed = 12.0;
                const forwardVector = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
                const sideVector = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

                if (this.moveState.forward) { px += forwardVector.x * speed * delta; pz += forwardVector.z * speed * delta; }
                if (this.moveState.backward) { px -= forwardVector.x * speed * delta; pz -= forwardVector.z * speed * delta; }
                if (this.moveState.right) { px += sideVector.x * speed * delta; pz += sideVector.z * speed * delta; }
                if (this.moveState.left) { px -= sideVector.x * speed * delta; pz -= sideVector.z * speed * delta; }
                if (this.moveState.up) py += speed * delta;
                if (this.moveState.down) py -= speed * delta;
            } else {
                // MODO CAMINATA REAL CON GRAVEDAD, SALTO Y COLISIONES DE BLOQUES
                const walkSpeed = 6.5;
                const forwardVector = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
                const sideVector = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

                let moveX = 0;
                let moveZ = 0;

                if (this.moveState.forward) {
                    moveX += forwardVector.x * walkSpeed;
                    moveZ += forwardVector.z * walkSpeed;
                }
                if (this.moveState.backward) {
                    moveX -= forwardVector.x * walkSpeed;
                    moveZ -= forwardVector.z * walkSpeed;
                }
                if (this.moveState.right) {
                    moveX += sideVector.x * walkSpeed;
                    moveZ += sideVector.z * walkSpeed;
                }
                if (this.moveState.left) {
                    moveX -= sideVector.x * walkSpeed;
                    moveZ -= sideVector.z * walkSpeed;
                }

                // Salto con ESPACIO (solo si está en el suelo)
                if (this.moveState.up && this.isGrounded) {
                    this.velocityY = 8.5; // Impulso vertical para superar 1 bloque
                    this.isGrounded = false;
                    this.playSound('jump');
                }

                // Aplicar Gravedad
                this.velocityY -= 26.0 * delta;
                this.velocityY = Math.max(this.velocityY, -32.0); // Velocidad terminal

                // Aplicar Impulso de Knockback estilo Minecraft
                if (Math.abs(this.knockbackX || 0) > 0.05 || Math.abs(this.knockbackZ || 0) > 0.05) {
                    moveX += this.knockbackX;
                    moveZ += this.knockbackZ;
                    this.knockbackX *= Math.pow(0.01, delta); // Fricción rápida de empuje
                    this.knockbackZ *= Math.pow(0.01, delta);
                } else {
                    this.knockbackX = 0;
                    this.knockbackZ = 0;
                }

                // Movimiento Horizontal X con Detección de Colisión
                let nextPx = px + moveX * delta;
                if (!this.checkCollision(nextPx, py, pz)) {
                    px = nextPx;
                } else {
                    if (this.isGrounded && !this.checkCollision(nextPx, py + 1.05, pz)) {
                        py += 0.4;
                        px = nextPx;
                    }
                }

                // Movimiento Horizontal Z con Detección de Colisión
                let nextPz = pz + moveZ * delta;
                if (!this.checkCollision(px, py, nextPz)) {
                    pz = nextPz;
                } else {
                    if (this.isGrounded && !this.checkCollision(px, py + 1.05, nextPz)) {
                        py += 0.4;
                        pz = nextPz;
                    }
                }

                // Movimiento Vertical Y y Apoyo en Suelo
                let nextPy = py + this.velocityY * delta;
                if (this.velocityY < 0) {
                    // Cayendo hacia el suelo
                    if (this.checkCollision(px, nextPy, pz)) {
                        py = Math.floor(nextPy) + 1.0;
                        this.velocityY = 0;
                        this.isGrounded = true;
                    } else {
                        py = nextPy;
                        this.isGrounded = false;
                    }
                } else if (this.velocityY > 0) {
                    // Subiendo / Saltando
                    if (this.checkCollision(px, nextPy, pz)) {
                        this.velocityY = 0; // Chocar contra el techo
                    } else {
                        py = nextPy;
                        this.isGrounded = false;
                    }
                }
            }

            // Guardar posición real del personaje (pies)
            this.playerX = px;
            this.playerY = py;
            this.playerZ = pz;

            // Actualizar Posición del Modelo 3D del Jugador Local
            if (this.localPlayerMesh) {
                this.localPlayerMesh.position.set(this.playerX, this.playerY, this.playerZ);
                this.localPlayerMesh.rotation.y = this.yaw;
                if (this.localPlayerMesh.userData && typeof this.localPlayerMesh.userData.animateWalk === 'function') {
                    this.localPlayerMesh.userData.animateWalk(this.playerX, this.playerZ, delta);
                }
            }

            // Posicionamiento de Cámara según Modo F5 (0: 1ª Persona, 1: 3ª Persona Espalda, 2: 3ª Persona Frente)
            const mode = this.cameraMode || 0;
            if (mode === 0) {
                // 1ª Persona
                if (this.localPlayerMesh) this.localPlayerMesh.visible = false;
                this.camera.position.set(this.playerX, this.playerY + this.eyeHeight, this.playerZ);
                this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
            } else if (mode === 1) {
                // 3ª Persona (Espalda)
                if (this.localPlayerMesh) this.localPlayerMesh.visible = true;
                const dist = 3.6;
                const camX = this.playerX - Math.sin(this.yaw) * Math.cos(this.pitch) * dist;
                const camY = this.playerY + this.eyeHeight + Math.sin(this.pitch) * dist;
                const camZ = this.playerZ - Math.cos(this.yaw) * Math.cos(this.pitch) * dist;
                this.camera.position.set(camX, camY, camZ);
                this.camera.lookAt(this.playerX, this.playerY + 1.2, this.playerZ);
            } else if (mode === 2) {
                // 3ª Persona (Frente)
                if (this.localPlayerMesh) this.localPlayerMesh.visible = true;
                const dist = 3.6;
                const camX = this.playerX + Math.sin(this.yaw) * Math.cos(this.pitch) * dist;
                const camY = this.playerY + this.eyeHeight - Math.sin(this.pitch) * dist;
                const camZ = this.playerZ + Math.cos(this.yaw) * Math.cos(this.pitch) * dist;
                this.camera.position.set(camX, camY, camZ);
                this.camera.lookAt(this.playerX, this.playerY + 1.2, this.playerZ);
            }

            // Actualizar renderizado dinámico de trozos (60 FPS en mapa extenso)
            this.updateVisibleChunkMeshes();

            // Transmitir posición 3D real de los pies al servidor WebSocket multijugador (Solo en Multijugador)
            if (window.isMultiplayerMode && window.minecraftMultiplayer && typeof window.minecraftMultiplayer.sendMove === 'function') {
                window.minecraftMultiplayer.sendMove(this.playerX, this.playerY, this.playerZ, this.yaw, this.pitch);
            }

            // Actualizar Bloque Resaltado en la mira
            const target = this.getTargetBlock();
            if (target) {
                this.highlightMesh.position.copy(target.object.position);
                this.highlightMesh.visible = true;
            } else {
                this.highlightMesh.visible = false;
            }
        } else {
            this.highlightMesh.visible = false;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Instancia global
window.minecraftSandbox = new MinecraftSandbox();

// Captura global prioritaria de F5 para evitar que el navegador recargue la pestaña
window.addEventListener('keydown', (e) => {
    if (e.key === 'F5' || e.code === 'F5') {
        const sandboxScreen = document.getElementById('sandbox-screen');
        if (sandboxScreen && !sandboxScreen.classList.contains('hidden')) {
            e.preventDefault();
            e.stopPropagation();
            if (window.minecraftSandbox) {
                window.minecraftSandbox.toggleCameraMode();
            }
        }
    }
}, true);
