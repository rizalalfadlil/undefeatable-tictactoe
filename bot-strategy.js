// bot-strategy.js

// Fungsi untuk menentukan langkah bot berdasarkan strategi tertentu
function determineBotMove(cells, currentPlayer) {
    const availableMoves = cells.reduce((acc, value, index) => {
        if (!value) {
            acc.push(index);
        }
        return acc;
    }, []);

    // Implementasikan strategi bot berdasarkan langkah pertama
    const opponentMove = getOpponentMove(cells);
    const isFirstMove = cells.every(cell => cell === null);
    const isSecondMove = cells.filter(cell => cell !== null).length === 1;
    if (isFirstMove) {
        // Bot bermain pertama
        const isFirstMoveInCorner = Math.random() < 0.5; // Misalnya, 50% kemungkinan bermain di sudut

        if (isFirstMoveInCorner) {
            const cornerIndices = [0, 2, 6, 8];
            const randomCornerIndex = Math.floor(Math.random() * cornerIndices.length);
            const botMove = cornerIndices[randomCornerIndex];
            
            return botMove;
        } else {
            const centerIndex = 4;
            
            return centerIndex;
        }
    }
    // Langkah kedua hanya dijalankan ketika bukan langkah pertama
    if (isSecondMove) {
        
        // Lawan bermain pertama
        const opponentType = opponentMove.type;
        const opponentIndex = opponentMove.index;
    
        if (opponentType === 'sisi' || opponentType === 'tengah') {
            // Jika lawan mengambil sisi atau tengah, bot ambil sudut
            const cornerIndices = [0, 2, 6, 8];
            const availableCorners = cornerIndices.filter(index => cells[index] === null);
    
            // Perbaruan: Cari sudut yang tidak terhalang oleh lawan
            const opponentBlockingCorners = getBlockingCorners(opponentIndex);
            const availableCornersToTake = availableCorners.filter(corner => opponentBlockingCorners.includes(corner));
    
            if (availableCornersToTake.length > 0) {
                // Jika ada sudut yang tidak terhalang, ambil salah satu secara acak
                const randomCornerIndex = Math.floor(Math.random() * availableCornersToTake.length);
                const botMove = availableCornersToTake[randomCornerIndex];
                
                return botMove;
            } else {
                // Jika semua sudut terhalang, ambil sudut secara acak (tidak memperhatikan halangan)
                const randomCornerIndex = Math.floor(Math.random() * availableCorners.length);
                const botMove = availableCorners[randomCornerIndex];
                
                return botMove;
            }
        } else if (opponentType === 'sudut') {
            // Jika lawan mengambil sudut, bot ambil tengah
            const centerIndex = 4;
            
            return centerIndex;
        }
    }

    const botMove = makeMove(cells);

    // Jika strategi makeMove memberikan langkah yang valid, gunakan langkah tersebut
    if (botMove !== null && availableMoves.includes(botMove)) {
        
        return botMove;
    }

    // Jika strategi makeMove tidak berlaku atau lawan bermain pertama, ambil langkah secara acak
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    
    return availableMoves[randomIndex];
}

function makeMove(cells) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Prioritas 1: Menang dalam permainan
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;

        // Cek jika ada dua langkah yang sudah diambil oleh bot dan satu kosong
        if (cells[a] === 'O' && cells[a] === cells[b] && !cells[c]) {
            
            return c;
        } else if (cells[a] === 'O' && cells[a] === cells[c] && !cells[b]) {
            
            return b;
        } else if (cells[b] === 'O' && cells[b] === cells[c] && !cells[a]) {
            
            return a;
        }
    }
    // Prioritas 3: Blokir langkah lawan
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;

        // Cek jika ada dua langkah yang sudah diambil oleh bot dan satu kosong
        if (cells[a] === 'X' && cells[a] === cells[b] && !cells[c]) {
            
            return c;
        } else if (cells[a] === 'X' && cells[a] === cells[c] && !cells[b]) {
            
            return b;
        } else if (cells[b] === 'X' && cells[b] === cells[c] && !cells[a]) {
            
            return a;
        }
    }
    // Prioritas 2: Hindari jebakan diagonal
    const diagonalTrapPatterns = [
        [0, 4, 8], // diagonal utama
        [2, 4, 6]  // diagonal sekunder
    ];

    // Cek apakah baru ada 3 sel yang diisi
    const filledCellsCount = cells.filter(cell => cell !== null).length;
    if (filledCellsCount === 3) {
        for (const pattern of diagonalTrapPatterns) {
            const [a, b, c] = pattern;

            if (
                cells[a] === 'X' && cells[b] === 'O' && cells[c] === 'X' ||
                cells[a] === 'X' && cells[b] === 'O' && cells[c] === null ||
                cells[a] === null && cells[b] === 'O' && cells[c] === 'X'
            ) {
                
                const sideIndices = [1, 3, 5, 7];
                const availableSides = sideIndices.filter(index => cells[index] === null);
                const randomSideIndex = Math.floor(Math.random() * availableSides.length);
                return availableSides[randomSideIndex];
            }
        }
    }

    // Prioritas 4: Pilih sudut yang tidak terhalang oleh lawan
    const cornerIndices = [0, 2, 6, 8];
    for (const cornerIndex of cornerIndices) {
        const adjacentIndices = getAdjacentIndices(cornerIndex);
        const isAdjacentBlocked = adjacentIndices.some(adjacentIndex => cells[adjacentIndex] === 'X');
        
        if (!isAdjacentBlocked && cells[cornerIndex] === null) {
            
            return cornerIndex;
        }
    }

    // Prioritas 5: Pilih sudut mana saja yang tersedia
    const availableCorners = cornerIndices.filter(index => cells[index] === null);
    if (availableCorners.length > 0) {
        const randomCornerIndex = Math.floor(Math.random() * availableCorners.length);
        
        return availableCorners[randomCornerIndex];
    }

    
    return null; // Return null jika tidak ada langkah yang dapat diambil
}

// Fungsi untuk mendapatkan indeks tetangga dari sebuah sudut
function getAdjacentIndices(cornerIndex) {
    const adjacentMappings = {
        0: [1, 3],
        2: [1, 5],
        6: [3, 7],
        8: [5, 7]
    };

    return adjacentMappings[cornerIndex] || [];
}


// Fungsi untuk mendapatkan indeks tetangga dari sebuah sudut
function getAdjacentIndices(cornerIndex) {
    const adjacentMappings = {
        0: [1, 3],
        2: [1, 5],
        6: [3, 7],
        8: [5, 7]
    };

    return adjacentMappings[cornerIndex] || [];
}

// Fungsi untuk menentukan langkah pertama lawan
function getOpponentMove(cells) {
    const cornerIndices = [0, 2, 6, 8];
    const sideIndices = [1, 3, 5, 7];
    const centerIndex = 4;

    // Menghitung jumlah langkah-lawan yang sudah diambil
    const opponentMovesCount = cells.filter(cell => cell === 'X').length;

    const opponentMoveIndex = cells.findIndex((cell, index) => {
        return (
            (cornerIndices.includes(index) && cell === 'X') ||
            (sideIndices.includes(index) && cell === 'X') ||
            (index === centerIndex && cell === 'X')
        );
    });

    // Mendapatkan nama tempat yang diambil (sudut/sisi/tengah)
    let opponentMoveType;
    if (cornerIndices.includes(opponentMoveIndex)) {
        opponentMoveType = 'sudut';
    } else if (sideIndices.includes(opponentMoveIndex)) {
        opponentMoveType = 'sisi';
    } else {
        opponentMoveType = 'tengah';
    }

    return {
        type: opponentMoveType,
        count: opponentMovesCount,
        index: opponentMoveIndex
    };
}
// Fungsi untuk mendapatkan sudut yang terhalang oleh lawan
function getBlockingCorners(opponentIndex) {
    const blockingCorners = {
        1: [0, 2], // Lawan mengambil tengah atas
        3: [0, 6], // Lawan mengambil tengah kiri
        5: [2, 8], // Lawan mengambil tengah kanan
        7: [6, 8], // Lawan mengambil tengah bawah
    };

    return blockingCorners[opponentIndex] || [];
}