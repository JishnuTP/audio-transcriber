import React from 'react'
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-muted py-6 w-full">
      <div className="container flex items-center justify-between px-4 md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 Transcribe. All rights reserved JISHNU-TP.</p>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer