type Props = {
  className?: string
}

// Los assets viven en public/. La versión negra (texto negro, arcoíris intacto)
// se muestra en modo claro y en el PDF; la blanca, en modo oscuro.
const base = import.meta.env.BASE_URL

/**
 * Logo oficial de FACTTIC (imagen). La altura sigue el font-size del contenedor
 * (h-[1em]), así respeta los tamaños que se venían usando con el wordmark de texto.
 */
export default function Logo({ className = '' }: Props) {
  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      <img
        src={`${base}facttic-logo.png`}
        alt="FACTTIC"
        className="logo-on-dark h-[1em] w-auto select-none"
        draggable={false}
      />
      <img
        src={`${base}facttic-logo-black.png`}
        alt="FACTTIC"
        className="logo-on-light h-[1em] w-auto select-none"
        draggable={false}
      />
    </span>
  )
}
