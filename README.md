# 📐 Parametric Conic Sections CAD Generator

A web-based mathematical drafting utility that generates precise 2D vector configurations for conic sections (Ellipses, Parabolas, and Hyperbolas) and exports them natively into production-ready AutoCAD `.dxf` file structures.

## 📂 Project Structure
```text
autocad-conic-generator/
├── index.html   # Control dashboard interface & parameter sliders
└── script.js    # Core trigonometric coordinate engine & file stream writer
```

## 🏎️ Quick Start
1. Clone this repository locally to your computer:
   ```bash
   git clone https://github.com
   ```
2. Navigate into the folder directory:
   ```bash
   cd autocad-conic-generator
   ```
3. Open `index.html` directly in any standard modern web browser (Chrome, Edge, Firefox, or Safari).
4. Select your target conic profile from the dashboard dropdown, configure your drawing scale rules, and click **Compile & Download DXF**.

## 📐 Core Formulas Handled
The vector engine dynamically computes rectangular Cartesian coordinate translations (\(x = r \cdot \cos\theta\), \(y = r \cdot \sin\theta\)) based on the chosen geometric eccentricity parameters (e):
* **Ellipse:** e = 0.7 (Closed-loop trajectory calculation across a full 2π radian path)
* **Parabola:** e = 1.0 (Capped focus parameter bounding box calculations)
* **Hyperbola:** e = 1.5 (Safety bounded asymptote tracking using \(\theta_{limit} = \arccos(-\frac{1}{e})\))
