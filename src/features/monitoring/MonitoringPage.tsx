import { useMemo, useState } from 'react'
import './monitoring.css'

type IconName =
  | 'dashboard'
  | 'monitor'
  | 'people'
  | 'vehicle'
  | 'chart'
  | 'wrench'
  | 'report'
  | 'camera'
  | 'settings'
  | 'search'
  | 'bell'
  | 'chevron'
  | 'logout'
  | 'spark'

type Camera = {
  id: string
  name: string
  status: 'Activa' | 'Sin conexión'
  detail: string
  time: string
  variant: number
}

const navigation: { label: string; icon: IconName }[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Monitoreo en tiempo real', icon: 'monitor' },
  { label: 'Flujo de clientes', icon: 'people' },
  { label: 'Taller y rampas', icon: 'vehicle' },
  { label: 'Análisis comercial', icon: 'chart' },
  { label: 'Posventa', icon: 'wrench' },
  { label: 'Reportes', icon: 'report' },
  { label: 'Cámaras y dispositivos', icon: 'camera' },
  { label: 'Configuración', icon: 'settings' },
]

const cameras: Camera[] = [
  {
    id: 'CAM-02',
    name: 'Recepción',
    status: 'Activa',
    detail: '5 personas · IA procesando',
    time: '14:32:08',
    variant: 1,
  },
  {
    id: 'CAM-03',
    name: 'Taller · zona A',
    status: 'Activa',
    detail: '8 vehículos · IA procesando',
    time: '14:32:08',
    variant: 2,
  },
  {
    id: 'CAM-07',
    name: 'Acceso de servicio',
    status: 'Sin conexión',
    detail: 'Revisar transmisión',
    time: '14:28:51',
    variant: 3,
  },
]

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    monitor: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 19v2m10-2v2M7 9h.01M10 9h7" /><path d="m6 12 2-1 2 2 3-3 2 1" /></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    vehicle: <><path d="m5 11 1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" /><path d="M3 11h18v8H3zM6 19v2m12-2v2M6 15h.01M18 15h.01" /></>,
    chart: <><path d="M4 19V5m0 14h17" /><path d="m7 15 4-4 3 2 6-7" /><path d="M17 6h3v3" /></>,
    wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4l-5.6 5.6a2 2 0 0 0 2.8 2.8l5.6-5.6a5 5 0 0 0 6.4-6.4L14 12l-3-3z" /><path d="m16 8 2-2" /></>,
    report: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8m-8 4h8" /></>,
    camera: <><path d="M14 4h-4L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z" /><circle cx="12" cy="14" r="3" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4L7.7 15a8 8 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8H14l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 1.8Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z" /><path d="m19 14 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1z" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function CameraScene({ variant = 0 }: { variant?: number }) {
  return (
    <svg
      className={`camera-scene camera-scene--${variant}`}
      viewBox="0 0 720 270"
      role="img"
      aria-label="Vista esquemática de una cámara de seguridad"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="720" height="270" fill="#d9e5eb" />
      <path d="M0 0h720v89H0z" fill="#c6d6df" />
      <path d="M0 89h720v181H0z" fill="#e7edf0" />
      <path d="M0 154h720M60 270l143-181m85 181 92-181m78 181 35-181m167 181L528 89" stroke="#c8d1d6" strokeWidth="2" />
      <path d="M44 20h150v73H44z" fill="#9eb3c0" />
      <path d="M53 20v73m44-73v73m45-73v73" stroke="#e0e9ed" strokeWidth="5" />
      <path d="M539 61h132a5 5 0 0 1 5 5v38H534V66a5 5 0 0 1 5-5Z" fill="#91a9b8" />
      <path d="M548 104v19m113-19v19" stroke="#91a9b8" strokeWidth="8" />
      <path d="M519 196h139a8 8 0 0 1 8 8v22H511v-22a8 8 0 0 1 8-8Z" fill="#91a9b8" />
      <path d="m119 180 22-38h95l28 38v39H119z" fill="#fff" stroke="#8ba4b2" strokeWidth="3" />
      <path d="m151 145 77 0 17 26h-109z" fill="#9eb4c0" />
      <rect x="131" y="213" width="23" height="13" rx="4" fill="#4a6474" />
      <rect x="241" y="213" width="23" height="13" rx="4" fill="#4a6474" />
      <g fill="#7c96a6">
        <circle cx="390" cy="143" r="9" />
        <path d="M381 155h18v27h-18z" />
        <circle cx="457" cy="158" r="9" />
        <path d="M448 170h18v27h-18z" />
      </g>
      <rect x="369" y="127" width="42" height="62" fill="none" stroke="#198d89" strokeWidth="2" />
      <rect x="436" y="143" width="42" height="62" fill="none" stroke="#198d89" strokeWidth="2" />
      <rect x="62" y="12" width="195" height="96" rx="4" fill="none" stroke="#4b9f9b" strokeWidth="2" strokeDasharray="6 5" />
      <rect x="523" y="40" width="163" height="106" rx="4" fill="none" stroke="#325478" strokeWidth="2" strokeDasharray="6 5" />
      <rect x="501" y="177" width="187" height="70" rx="4" fill="none" stroke="#b48b3a" strokeWidth="2" strokeDasharray="6 5" />
      <text x="19" y="24" fill="#57727f" fontSize="10" fontFamily="sans-serif">ENTRADA</text>
      <text x="549" y="28" fill="#57727f" fontSize="10" fontFamily="sans-serif">RECEPCIÓN</text>
      <text x="557" y="245" fill="#8b713d" fontSize="10" fontFamily="sans-serif">SALA DE ESPERA</text>
    </svg>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="brand" href="#monitoreo" aria-label="SIGMA, inicio">
        <span className="brand__mark">Σ</span>
        <span className="brand__text">
          <strong>SIGMA</strong>
          <small>INTELIGENCIA OPERATIVA</small>
        </span>
      </a>

      <div className="sidebar__section-label">ESPACIO DE TRABAJO</div>
      <nav className="sidebar__nav" aria-label="Navegación principal">
        {navigation.map((item) => {
          const current = item.label === 'Monitoreo en tiempo real'
          return (
            <a
              className={`nav-link${current ? ' nav-link--active' : ''}`}
              href={current ? '#monitoreo' : `#${item.label.toLowerCase().replaceAll(' ', '-')}`}
              aria-current={current ? 'page' : undefined}
              key={item.label}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="integration-card">
          <span className="integration-card__title">
            <i className="status-dot" /> Integraciones activas
          </span>
          <span>Cámaras + CRM + DMS</span>
          <span>Última sincronización: 14:32</span>
        </div>
        <a className="logout-link" href="#cerrar-sesion">
          <Icon name="logout" size={17} />
          Cerrar sesión
        </a>
      </div>
    </aside>
  )
}

function CameraCard({ camera }: { camera: Camera }) {
  return (
    <article className="camera-card">
      <header className="camera-card__header">
        <h3>{camera.id} · {camera.name}</h3>
        <span className={`camera-badge${camera.status === 'Sin conexión' ? ' camera-badge--offline' : ''}`}>
          {camera.status}
        </span>
      </header>
      <div className={`camera-card__preview${camera.status === 'Sin conexión' ? ' camera-card__preview--offline' : ''}`}>
        <CameraScene variant={camera.variant} />
        {camera.status === 'Sin conexión' && (
          <span className="offline-message">Sin conexión</span>
        )}
      </div>
      <p className={camera.status === 'Sin conexión' ? 'text-warning' : 'text-positive'}>
        {camera.detail}
      </p>
      <p className="camera-card__time">Última actualización: {camera.time}</p>
    </article>
  )
}

function MonitoringPage() {
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState('Sucursal Centro')
  const [area, setArea] = useState('Todas las áreas')
  const visibleCameras = useMemo(
    () => cameras.filter(({ id, name }) => {
      const matchesQuery = `${id} ${name}`.toLowerCase().includes(query.toLowerCase())
      const matchesArea =
        area === 'Todas las áreas' ||
        (area === 'Entrada' && id === 'CAM-07') ||
        (area === 'Recepción' && id === 'CAM-02') ||
        (area === 'Taller' && id === 'CAM-03')
      return matchesQuery && matchesArea
    }),
    [area, query],
  )

  return (
    <div className="monitoring-layout" id="monitoreo">
      <Sidebar />
      <main className="monitoring-main">
        <header className="topbar">
          <label className="search-box">
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder="Buscar indicadores, reportes o dispositivos"
              aria-label="Buscar indicadores, reportes o dispositivos"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="system-status"><i className="status-dot" /> Sistema operativo</div>
          <button className="icon-button notification-button" type="button" aria-label="Notificaciones">
            <Icon name="bell" size={19} />
            <span />
          </button>
          <button className="user-menu" type="button">
            <span className="avatar">AT</span>
            <span><strong>Alejandro Torres</strong><small>Administrador</small></span>
            <Icon name="chevron" size={15} />
          </button>
        </header>

        <section className="content">
          <div className="page-heading">
            <div>
              <h1>Monitoreo en tiempo real</h1>
              <p>Detección inteligente y estado de las áreas operativas.</p>
            </div>
          </div>

          <div className="filters-row">
            <label className="select-wrap">
              <span className="sr-only">Sucursal</span>
              <select value={branch} onChange={(event) => setBranch(event.target.value)}>
                <option>Sucursal Centro</option>
                <option>Sucursal Norte</option>
                <option>Sucursal Sur</option>
              </select>
              <Icon name="chevron" size={15} />
            </label>
            <label className="select-wrap">
              <span className="sr-only">Área</span>
              <select value={area} onChange={(event) => setArea(event.target.value)}>
                <option>Todas las áreas</option>
                <option>Entrada</option>
                <option>Recepción</option>
                <option>Taller</option>
              </select>
              <Icon name="chevron" size={15} />
            </label>
            <div className="camera-summary">
              <span><i className="summary-dot summary-dot--active" /> 6 activas</span>
              <span><i className="summary-dot summary-dot--offline" /> 1 desconectada</span>
              <span><i className="summary-dot summary-dot--error" /> 1 con error</span>
            </div>
            <time className="updated-time" dateTime="2026-11-03T14:32:08">
              03 nov 2026, 14:32:08
            </time>
          </div>

          <div className="featured-grid">
            <article className="featured-camera">
              <div className="featured-camera__heading">
                <h2>CAM-01 · Acceso principal</h2>
                <span className="camera-badge"><i className="status-dot" /> Activa · IA</span>
              </div>
              <div className="featured-camera__scene">
                <CameraScene />
              </div>
              <p className="camera-card__time">Vista esquemática de demostración · ROI configuradas · actualización: 14:32:08</p>
            </article>

            <aside className="intelligence-card">
              <div className="intelligence-card__title">
                <Icon name="spark" size={18} />
                <h2>Inteligencia artificial</h2>
              </div>
              <div className="people-count"><strong>12</strong><span>personas</span></div>
              <p className="muted-label">Detectadas en las áreas</p>
              <ul className="area-counts">
                <li><span>Entrada</span><strong>4</strong></li>
                <li><span>Recepción</span><strong>5</strong></li>
                <li><span>Sala de espera</span><strong>3</strong></li>
              </ul>
              <div className="ai-status"><i className="status-dot" /> Modelo procesando</div>
              <p className="confidence-label">Confianza media: <strong>96.8%</strong></p>
              <p className="privacy-note">Conteo anonimizado</p>
            </aside>
          </div>

          <section className="camera-grid" aria-label="Cámaras adicionales">
            {visibleCameras.map((camera) => <CameraCard camera={camera} key={camera.id} />)}
            {visibleCameras.length === 0 && (
              <p className="empty-state">No se encontraron cámaras para “{query}”.</p>
            )}
          </section>

          <div className="alert-banner" role="status">
            <strong>CAM-08 · Sala de entrega: error de procesamiento.</strong>
            <span>La transmisión sigue disponible.</span>
          </div>

        </section>
      </main>
    </div>
  )
}

export default MonitoringPage
