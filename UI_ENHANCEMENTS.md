# SOC-X UI Enhancements

## 🎨 Complete UI Overhaul

The SOC-X frontend has been completely redesigned with a modern, intuitive interface featuring real-time threat visualization.

## ✨ Key Features

### 1. **Threat Radar (Central Feature)**
- **Location**: Center of the dashboard
- **Features**:
  - Real-time rotating radar scan
  - Threat blips appear when detected by scanning beam
  - Color-coded by severity (Low/Medium/High/Critical)
  - Pulsing animations for active threats
  - Threat labels appear when detected
  - Smooth canvas-based rendering with 60fps animations

### 2. **Enhanced Dashboard**
- **Metrics Cards**:
  - Total Alerts
  - Critical Threats
  - High Risk Alerts
  - Active Threats (last hour)
  - Average Risk Score
  - Monitored Assets
  - System Status
- **Real-time Updates**: All metrics update automatically via WebSocket

### 3. **Real-Time Alert Feed**
- **Location**: Right sidebar
- **Features**:
  - Live alert stream with animations
  - Color-coded by severity
  - Shows event type, asset ID, timestamp, and risk score
  - Smooth scroll animations
  - Auto-updates when new alerts arrive

### 4. **Threat Timeline Chart**
- **Features**:
  - 24-hour activity timeline
  - Shows total alerts and critical alerts
  - Gradient area charts
  - Responsive design

### 5. **Modern UI Components**
- **Sidebar**:
  - Gradient background with glassmorphism
  - Active route indicators
  - Smooth animations
  - System status indicator
  
- **Top Bar**:
  - Search functionality
  - Notification bell
  - User profile
  - Modern design

### 6. **Animations & Transitions**
- Framer Motion animations throughout
- Smooth page transitions
- Hover effects
- Loading states
- Real-time updates with visual feedback

## 🎯 Design Principles

1. **Dark Theme**: Professional dark color scheme optimized for 24/7 monitoring
2. **Glassmorphism**: Modern frosted glass effects
3. **Gradients**: Subtle gradients for depth
4. **Color Coding**: 
   - 🔵 Blue: Low severity
   - 🟡 Yellow: Medium severity
   - 🟠 Orange: High severity
   - 🔴 Red: Critical severity
5. **Responsive**: Works on all screen sizes

## 📁 Component Structure

```
components/
├── radar/
│   └── ThreatRadar.tsx          # Central radar visualization
├── dashboard/
│   └── MetricsCard.tsx          # Metric display cards
├── alerts/
│   └── AlertFeed.tsx            # Real-time alert stream
├── graphs/
│   └── ThreatTimeline.tsx       # Activity timeline chart
└── layout/
    ├── Sidebar.tsx              # Navigation sidebar
    └── TopBar.tsx               # Top navigation bar
```

## 🚀 Usage

1. **Start the backend**:
   ```bash
   cd SOC-x-ODISSA
   uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Start the frontend**:
   ```bash
   cd soc-x-ui
   npm run dev
   ```

3. **View the dashboard**:
   - Open http://localhost:3000
   - The radar will start scanning automatically
   - Alerts will appear in real-time

## 🔌 API Integration

- **REST API**: `/api/alerts/live` - Fetches recent alerts
- **WebSocket**: `/ws/alerts` - Real-time alert stream
- **Auto-refresh**: Polls API every 5 seconds as fallback

## 🎨 Customization

### Radar Size
```tsx
<ThreatRadar alerts={alerts} size={600} />
```

### Alert Feed Limit
```tsx
<AlertFeed alerts={alerts} maxItems={15} />
```

### Color Themes
Modify colors in `globals.css` or component files to match your brand.

## 📊 Performance

- Canvas-based radar for smooth 60fps animations
- Efficient WebSocket handling
- Optimized re-renders with React hooks
- Lazy loading for charts

## 🔮 Future Enhancements

- [ ] 3D radar visualization
- [ ] Threat heatmap
- [ ] Asset topology view
- [ ] Custom alert filters
- [ ] Export capabilities
- [ ] Mobile app version

