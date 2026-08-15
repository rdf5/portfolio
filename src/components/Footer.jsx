export default function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} anaqin5</span>
      <span>Commissions open</span>
      {/* TODO: replace with your real email address */}
      <a href="mailto:hello@anaqin5.com">hello@anaqin5.com</a>
    </footer>
  )
}
