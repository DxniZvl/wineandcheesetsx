import '../style.css'

const isAuthed = () => localStorage.getItem('demo_auth') === 'true'

export default function Admin() {
  if (!isAuthed()) {
    return (
      <section className="container" style={{ marginTop: '7rem' }}>
        <h2>Admin</h2>
        <p>Debes iniciar sesión.</p>
      </section>
    )
  }

  return (
    <section className="container" style={{ marginTop: '7rem' }}>
      <h2>Panel de Administración</h2>
      <p>Contenido protegido (demo). Más adelante: datos desde Supabase.</p>

      <button
        className="confirm-btn"
        style={{ maxWidth: 240 }}
        onClick={() => {
          localStorage.removeItem('demo_auth')
          window.location.href = '/'
        }}
      >
        Cerrar sesión
      </button>
    </section>
  )
}
