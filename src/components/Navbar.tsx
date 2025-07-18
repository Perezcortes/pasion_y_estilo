'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => setIsOpen(!isOpen)

    const navLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '#servicios' },
        { name: 'Citas', href: '#citas' },
        { name: 'Blog', href: '#blog' },
        { name: 'Contacto', href: '#contacto' },
    ]

    const mobileMenuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        }
    }

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-2 shadow-xl' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-white tracking-wide">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">
                        Pasión<span className="text-white">&</span>Estilo
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-white hover:text-indigo-400 transition-colors duration-300 group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}

                    <Link
                        href="/login"
                        className="flex items-center gap-2 ml-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all duration-300"
                    >
                        <User size={18} />
                        <span>Ingresar</span>
                    </Link>
                </nav>

                <div className="flex items-center gap-4 md:hidden">
                    <Link
                        href="/login"
                        className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                    >
                        <User size={20} />
                    </Link>

                    <button
                        className="text-white focus:outline-none"
                        onClick={toggleMenu}
                        aria-label="Menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu with Animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={mobileMenuVariants}
                        className="md:hidden overflow-hidden bg-black/95"
                    >
                        <div className="px-6 pb-4 pt-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block py-3 text-white hover:text-indigo-400 transition-colors duration-300 border-b border-gray-800"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-4">
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User size={18} />
                                    <span>Ingresar</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}