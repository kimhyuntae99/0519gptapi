// 메셀슨-스탈 DNA 실험 시각화를 위한 JavaScript 코드
document.addEventListener('DOMContentLoaded', function() {
    // 버튼 클릭 이벤트 설정
    const visualizeBtn = document.getElementById('visualizeBtn');
    visualizeBtn.addEventListener('click', visualizeDnaReplication);
    
    // 초기 시각화
    visualizeDnaReplication();
});

/**
 * DNA 복제 과정을 시각화하는 함수
 */
function visualizeDnaReplication() {
    const generations = parseInt(document.getElementById('generationInput').value);
    const container = document.getElementById('visualizationContainer');
    
    // 유효성 검사
    if (isNaN(generations) || generations < 0 || generations > 10) {
        alert('세대 수는 0부터 10 사이의 숫자를 입력해주세요.');
        return;
    }
    
    // 기존 시각화 삭제
    container.innerHTML = '';
    
    // SVG 크기 설정
    const svgWidth = 900;
    const svgHeight = (generations + 1) * 150; // 각 세대마다 150px 높이
    
    // SVG 생성
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    // 초기 DNA (모두 무거운 질소 15N)
    drawGeneration(svg, 0, [{
        top: true,      // 상단 가닥인지 여부
        bottom: true,   // 하단 가닥인지 여부
        heavy: true     // 무거운 질소 15N인지 여부
    }]);
    
    // 세대별 DNA 복제 및 시각화
    let currentDnaStrands = [{ heavy: true, heavy: true }]; // 초기 DNA (양쪽 모두 무거운 질소)
    
    for (let gen = 1; gen <= generations; gen++) {
        const newDnaStrands = [];
        
        // 각 DNA 가닥별로 복제
        currentDnaStrands.forEach(strand => {
            // 반보존적 복제: 무거운 가닥(15N)은 그대로, 새로운 가닥은 가벼운 질소(14N)
            newDnaStrands.push({
                top: strand.heavy,     // 상단은 이전 세대의 무거운 가닥
                bottom: false,         // 하단은 항상 새로운 가벼운 가닥
                heavy: strand.heavy    // 이 DNA의 밀도 상태
            });
            
            // 가벼운 가닥(14N)은 그대로, 새로운 가닥은 가벼운 질소(14N)
            newDnaStrands.push({
                top: false,            // 상단은 이전 세대의 가벼운 가닥
                bottom: false,         // 하단은 항상 새로운 가벼운 가닥
                heavy: false           // 이 DNA의 밀도 상태
            });
        });
        
        // 현재 세대 DNA 시각화
        drawGeneration(svg, gen, newDnaStrands);
        
        // 다음 세대를 위해 현재 세대 저장
        currentDnaStrands = [];
        newDnaStrands.forEach(strand => {
            currentDnaStrands.push({
                heavy: strand.top // 다음 세대에서는 상단 가닥의 무거움/가벼움이 DNA의 상태가 됨
            });
        });
    }
    
    container.appendChild(svg);
    
    // 통계 정보 표시
    displayStatistics(generations);
}

/**
 * 특정 세대의 DNA를 그리는 함수
 * @param {SVGElement} svg - SVG 요소
 * @param {number} generation - 세대 번호
 * @param {Array} dnaStrands - DNA 가닥 정보 배열
 */
function drawGeneration(svg, generation, dnaStrands) {
    const yOffset = generation * 150 + 50; // 세대별 Y 위치
    const dnaLength = 300; // DNA 가닥의 길이
    const strandSpacing = 50; // DNA 가닥 간의 간격
    
    // 세대 레이블 추가
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 20);
    text.setAttribute('y', yOffset - 30);
    text.setAttribute('font-size', '16');
    text.setAttribute('font-weight', 'bold');
    text.textContent = `세대 ${generation}`;
    svg.appendChild(text);
    
    // 밀도 구배 표시 (왼쪽)
    const gradientGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // 원심분리관 배경
    const tube = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tube.setAttribute('x', 20);
    tube.setAttribute('y', yOffset - 20);
    tube.setAttribute('width', 40);
    tube.setAttribute('height', 100);
    tube.setAttribute('fill', '#f0f0f0');
    tube.setAttribute('stroke', '#888');
    gradientGroup.appendChild(tube);
    
    // 원심분리관 그라데이션
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', `density-gradient-${generation}`);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#e0e0e0');
    gradient.appendChild(stop1);
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#aaaaaa');
    gradient.appendChild(stop2);
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(gradient);
    gradientGroup.appendChild(defs);
    
    // 그라데이션 적용
    const gradientRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    gradientRect.setAttribute('x', 22);
    gradientRect.setAttribute('y', yOffset - 18);
    gradientRect.setAttribute('width', 36);
    gradientRect.setAttribute('height', 96);
    gradientRect.setAttribute('fill', `url(#density-gradient-${generation})`);
    gradientGroup.appendChild(gradientRect);
    
    // 텍스트 라벨
    const densityLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    densityLabel.setAttribute('x', 40);
    densityLabel.setAttribute('y', yOffset - 25);
    densityLabel.setAttribute('font-size', '10');
    densityLabel.setAttribute('text-anchor', 'middle');
    densityLabel.textContent = '밀도';
    gradientGroup.appendChild(densityLabel);
    
    svg.appendChild(gradientGroup);
    
    // DNA 가닥 그리기
    dnaStrands.forEach((strand, index) => {
        // 각 가닥의 위치 계산
        const xOffset = 100 + index * strandSpacing;
        
        // DNA 가닥 그룹
        const dnaGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // DNA 상단 가닥
        const topStrand = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        topStrand.setAttribute('d', generateDnaPath(xOffset, yOffset - 15, dnaLength, 15, 'top'));
        topStrand.setAttribute('stroke', strand.top ? '#FF6B6B' : '#4ECDC4'); // 무거우면 빨강, 가벼우면 청록색
        topStrand.setAttribute('stroke-width', '3');
        topStrand.setAttribute('fill', 'none');
        dnaGroup.appendChild(topStrand);
        
        // DNA 하단 가닥
        const bottomStrand = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bottomStrand.setAttribute('d', generateDnaPath(xOffset, yOffset + 15, dnaLength, 15, 'bottom'));
        bottomStrand.setAttribute('stroke', strand.bottom ? '#FF6B6B' : '#4ECDC4'); // 무거우면 빨강, 가벼우면 청록색
        bottomStrand.setAttribute('stroke-width', '3');
        bottomStrand.setAttribute('fill', 'none');
        dnaGroup.appendChild(bottomStrand);
        
        // DNA 연결선
        for (let i = 0; i <= 10; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const lineX = xOffset + i * (dnaLength / 10);
            line.setAttribute('x1', lineX);
            line.setAttribute('y1', yOffset - 15 + Math.sin(i * Math.PI) * 15);
            line.setAttribute('x2', lineX);
            line.setAttribute('y2', yOffset + 15 + Math.sin(i * Math.PI + Math.PI) * 15);
            line.setAttribute('stroke', '#888');
            line.setAttribute('stroke-width', '1.5');
            dnaGroup.appendChild(line);
        }
        
        // 원 표시 - 무거운 가닥끼리, 혼합, 가벼운 가닥끼리 구분
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', 40);
        
        // DNA 밀도에 따른 위치 결정
        if (strand.top && strand.bottom) { // 두 가닥 모두 무거움 (HH)
            circle.setAttribute('cy', yOffset + 30); // 맨 아래
            circle.setAttribute('fill', '#FF6B6B');
        } 
        else if (!strand.top && !strand.bottom) { // 두 가닥 모두 가벼움 (LL)
            circle.setAttribute('cy', yOffset - 10); // 맨 위
            circle.setAttribute('fill', '#4ECDC4');
        }
        else { // 한 가닥만 무거움 (HL)
            circle.setAttribute('cy', yOffset + 10); // 중간
            circle.setAttribute('fill', '#9966CC'); // 보라색
        }
        
        circle.setAttribute('r', 5);
        gradientGroup.appendChild(circle);
        
        // DNA 유형 텍스트
        const dnaTypeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dnaTypeText.setAttribute('x', xOffset + dnaLength / 2);
        dnaTypeText.setAttribute('y', yOffset + 40);
        dnaTypeText.setAttribute('font-size', '12');
        dnaTypeText.setAttribute('text-anchor', 'middle');
        
        if (strand.top && strand.bottom) {
            dnaTypeText.textContent = 'HH (무거운/무거운)';
        } else if (!strand.top && !strand.bottom) {
            dnaTypeText.textContent = 'LL (가벼운/가벼운)';
        } else {
            dnaTypeText.textContent = 'HL (혼합)';
        }
        
        dnaGroup.appendChild(dnaTypeText);
        
        svg.appendChild(dnaGroup);
    });
}

/**
 * DNA 가닥의 경로를 생성하는 함수
 * @param {number} x - 시작 x 좌표
 * @param {number} y - 시작 y 좌표
 * @param {number} length - DNA 길이
 * @param {number} amplitude - 진폭
 * @param {string} position - 상단(top) 또는 하단(bottom)
 * @returns {string} - SVG 경로 문자열
 */
function generateDnaPath(x, y, length, amplitude, position) {
    let path = `M ${x} ${y}`;
    const segments = 20;
    const segmentLength = length / segments;
    
    for (let i = 1; i <= segments; i++) {
        const phase = position === 'top' ? 0 : Math.PI;
        const newY = y + Math.sin(i * Math.PI / 5 + phase) * amplitude;
        path += ` L ${x + i * segmentLength} ${newY}`;
    }
    
    return path;
}

/**
 * 세대별 DNA 분포 통계를 표시하는 함수
 * @param {number} generations - 총 세대 수
 */
function displayStatistics(generations) {
    // 통계 정보 계산 (이론적으로)
    const statistics = [];
    
    // 초기 세대 (모두 무거운 DNA)
    statistics.push({
        generation: 0,
        heavy: 100,
        hybrid: 0,
        light: 0
    });
    
    // 세대별 분포 계산
    for (let gen = 1; gen <= generations; gen++) {
        const prev = statistics[gen - 1];
        
        // 반보존적 복제 모델에 따른 분포 계산
        // 1세대: 100% 하이브리드
        // 2세대: 50% 하이브리드, 50% 가벼운
        // 3세대: 25% 하이브리드, 75% 가벼운
        // ... 등
        
        if (gen === 1) {
            statistics.push({
                generation: gen,
                heavy: 0,
                hybrid: 100,
                light: 0
            });
        } else {
            const hybrid = prev.hybrid / 2 + prev.heavy / 2;
            const light = prev.light + prev.hybrid / 2 + prev.heavy / 2;
            statistics.push({
                generation: gen,
                heavy: 0,
                hybrid: hybrid,
                light: light
            });
        }
    }
    
    // 통계 정보 표시
    const container = document.getElementById('visualizationContainer');
    
    // 통계 정보 컨테이너
    const statsDiv = document.createElement('div');
    statsDiv.className = 'statistics';
    statsDiv.style.marginTop = '30px';
    statsDiv.style.padding = '15px';
    statsDiv.style.backgroundColor = '#f9f9f9';
    statsDiv.style.borderRadius = '8px';
    
    // 제목
    const title = document.createElement('h3');
    title.textContent = '세대별 DNA 분포';
    statsDiv.appendChild(title);
    
    // 테이블 생성
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '10px';
    
    // 테이블 헤더
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['세대', '무거운 DNA (HH) %', '하이브리드 DNA (HL) %', '가벼운 DNA (LL) %'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2';
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 테이블 본문
    const tbody = document.createElement('tbody');
    
    statistics.forEach(stat => {
        const row = document.createElement('tr');
        
        const genCell = document.createElement('td');
        genCell.textContent = stat.generation;
        genCell.style.border = '1px solid #ddd';
        genCell.style.padding = '8px';
        genCell.style.textAlign = 'center';
        row.appendChild(genCell);
        
        const heavyCell = document.createElement('td');
        heavyCell.textContent = stat.heavy.toFixed(1);
        heavyCell.style.border = '1px solid #ddd';
        heavyCell.style.padding = '8px';
        heavyCell.style.textAlign = 'center';
        row.appendChild(heavyCell);
        
        const hybridCell = document.createElement('td');
        hybridCell.textContent = stat.hybrid.toFixed(1);
        hybridCell.style.border = '1px solid #ddd';
        hybridCell.style.padding = '8px';
        hybridCell.style.textAlign = 'center';
        row.appendChild(hybridCell);
        
        const lightCell = document.createElement('td');
        lightCell.textContent = stat.light.toFixed(1);
        lightCell.style.border = '1px solid #ddd';
        lightCell.style.padding = '8px';
        lightCell.style.textAlign = 'center';
        row.appendChild(lightCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    statsDiv.appendChild(table);
    
    // 설명 추가
    const explanation = document.createElement('p');
    explanation.textContent = '메셀슨-스탈의 실험은 DNA가 반보존적으로 복제됨을 보여줍니다. 세대가 지남에 따라 무거운 DNA는 사라지고, 하이브리드 DNA와 가벼운 DNA의 비율이 변화합니다.';
    explanation.style.marginTop = '15px';
    statsDiv.appendChild(explanation);
    
    container.appendChild(statsDiv);
}