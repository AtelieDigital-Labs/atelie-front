export function Footer(){
  return (
    <footer className="bg-card mt-auto shadow-[0_-4px_10px_-2px_rgba(32, 16, 9, 0.3)]">
      <div className="container-app py-8 flex flex-col items-center gap-2 text-center">
        <h2 className="font-title font-bold text-xl text-primary">Seja parte do Artesanato Brasileiro</h2>
        <p className="text-xs text-text/40">
          © {new Date().getFullYear()} Ateliê Digital. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
