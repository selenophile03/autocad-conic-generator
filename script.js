// Link UI Components
const conicType = document.getElementById('conicType');
const scaleParam = document.getElementById('scaleParam');
const resolutionParam = document.getElementById('resolutionParam');

const scaleVal = document.getElementById('scaleVal');
const resVal = document.getElementById('resVal');
const exportBtn = document.getElementById('exportBtn');

// Live text readout updates
scaleParam.addEventListener('input', () => scaleVal.innerText = scaleParam.value + 'mm');
resolutionParam.addEventListener('input', () => resVal.innerText = resolutionParam.value + ' points');

// Mathematical Vector Builder Execution
exportBtn.addEventListener('click', () => {
    const type = conicType.value;
    const p = parseFloat(scaleParam.value); // Semi-latus rectum or focal distance proxy
    const steps = parseInt(resolutionParam.value);

    let e = 1.0; // Eccentricity base initialization
    let thetaMin = -Math.PI / 2;
    let thetaMax = Math.PI / 2;

    // Apply strict mathematical properties based on conic geometry choice
    if (type === 'ellipse') {
        e = 0.7; // e < 1
        thetaMin = -Math.PI;
        thetaMax = Math.PI;
    } else if (type === 'parabola') {
        e = 1.0; // e = 1
        thetaMin = -Math.PI * 0.4; // Cap range to prevent plotting to infinity
        thetaMax = Math.PI * 0.4;
    } else if (type === 'hyperbola') {
        e = 1.5; // e > 1
        // Avoid the asymptotes where cos(theta) = -1/e
        const asymptoteAngle = Math.acos(-1 / e);
        thetaMin = -asymptoteAngle + 0.2;
        thetaMax = asymptoteAngle - 0.2;
    }

    // Initialize clean AutoCAD file buffer instance
    const d = new DxfWriter();
    
    // Create professional segregated layers
    d.addLayer('Conic_Curve', DxfWriter.VPORT_COLOR_CYAN, 'CONTINUOUS');
    d.addLayer('Reference_Axis', DxfWriter.VPORT_COLOR_RED, 'DASHED');

    // 1. Draw Geometric Reference Axis Grid
    d.setCurrentLayer('Reference_Axis');
    d.drawLine(-p * 2, 0, p * 2, 0); // X-Axis Line
    d.drawLine(0, -p * 2, 0, p * 2); // Y-Axis Line

    // 2. Generate Vector Curves using Polar Conic Formula: r = p / (1 + e * cos(theta))
    d.setCurrentLayer('Conic_Curve');
    const points = [];
    const stepSize = (thetaMax - thetaMin) / steps;

    for (let i = 0; i <= steps; i++) {
        const theta = thetaMin + (i * stepSize);
        const r = p / (1 + (e * Math.cos(theta)));
        
        // Convert polar coordinates to rectangular Cartesian space
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        points.push([x, y]);
    }

    // Connect generated coordinate arrays with explicit linear line vectors
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        d.drawLine(start[0], start[1], end[0], end[1]);
    }

    // 3. Compile string stream and trigger immediate browser download
    const dxfStringStream = d.toDxfString();
    const blob = new Blob([dxfStringStream], { type: 'application/dxf' });
    const downloadUrl = URL.createObjectURL(blob);
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = `conic_${type}_profile.dxf`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(downloadUrl);
});
