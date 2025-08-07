'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Modal from './components/CustomModal'
import Image from 'next/image'
import ImageUploader from '../ImageUploader'

interface Seccion {
    id: number
    nombre: string
    imagen_url: string
    tipo: string
    tiene_catalogo: boolean
}

interface ItemSeccion {
    id: number
    seccion_id: number
    nombre: string
    descripcion: string
    precio: number | null
    imagen_url: string
    archivo_pdf: string | null
    es_destacado: boolean
}

export default function ServicesManagement() {
    const [secciones, setSecciones] = useState<Seccion[]>([])
    const [items, setItems] = useState<ItemSeccion[]>([])
    const [loading, setLoading] = useState(true)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [modalItemAbierto, setModalItemAbierto] = useState(false)
    const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)
    const [confirmacionData, setConfirmacionData] = useState({
        titulo: '',
        mensaje: '',
        onConfirm: () => { },
        onCancel: () => { }
    })
    const [seccionEditando, setSeccionEditando] = useState<Seccion | null>(null)
    const [itemEditando, setItemEditando] = useState<ItemSeccion | null>(null)
    const [formData, setFormData] = useState({
        nombre: '',
        imagen_url: '',
        tipo: 'servicio',
        tiene_catalogo: false
    })
    const [formItemData, setFormItemData] = useState({
        seccion_id: 0,
        nombre: '',
        descripcion: '',
        precio: null as number | null,
        imagen_url: '',
        archivo_pdf: '',
        es_destacado: false
    })
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<number | null>(null)
    const [elementoAEliminar, setElementoAEliminar] = useState<{
        tipo: 'seccion' | 'item'
        id: number
        seccionId?: number
    } | null>(null)

    // Cargar secciones
    const cargarSecciones = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/secciones')
            const data = await res.json()
            if (data.success) {
                setSecciones(data.data)
                // Si teníamos una sección seleccionada, verificar si aún existe
                if (seccionSeleccionada) {
                    const seccionExiste = data.data.some((s: Seccion) => s.id === seccionSeleccionada)
                    if (!seccionExiste) {
                        setSeccionSeleccionada(null)
                        setItems([])
                    }
                }
            }
        } catch (error) {
            toast.error('Error al cargar secciones')
        } finally {
            setLoading(false)
        }
    }

    // Cargar items de una sección
    const cargarItems = async (seccionId: number) => {
        if (!seccionId || isNaN(seccionId)) {
            console.error('ID de sección inválido:', seccionId)
            toast.error('Error al cargar items: sección no válida')
            return
        }

        try {
            const res = await fetch(`/api/secciones/${seccionId}`)
            if (!res.ok) throw new Error('Error al cargar items')

            const data = await res.json()
            if (data.success) {
                setItems(data.data.items || [])
                setSeccionSeleccionada(seccionId)
            } else {
                throw new Error(data.error || 'Error al cargar items')
            }
        } catch (error) {
            console.error('Error al cargar items:', error)
            toast.error('Error al cargar items')
            setItems([])
        }
    }

    useEffect(() => {
        cargarSecciones()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleItemChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormItemData(prev => {
            let newValue: any;

            if (type === 'checkbox') {
                newValue = (e.target as HTMLInputElement).checked;
            } else if (name === 'precio') {
                newValue = value === '' ? null : parseFloat(value);
            } else {
                newValue = value;
            }

            console.log(`Cambio en ${name}:`, newValue);

            return {
                ...prev,
                [name]: newValue
            };
        });
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (!data.url) throw new Error('No se recibió URL')
            return data.url
        } catch (error) {
            toast.error('Error al subir la imagen')
            throw error
        }
    }

    const guardarSeccion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.nombre) {
            toast.error('El nombre es requerido')
            return
        }

        try {
            const method = seccionEditando ? 'PUT' : 'POST'
            const url = seccionEditando ? `/api/secciones/${seccionEditando.id}` : '/api/secciones'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (data.success) {
                toast.success(seccionEditando ? 'Sección actualizada' : 'Sección creada')
                cargarSecciones()
                setModalAbierto(false)
            } else {
                toast.error(data.error || 'Error al guardar')
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor')
        }
    }

    const guardarItem = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación mejorada
        if (!formItemData.nombre.trim()) {
            toast.error('Por favor ingrese un nombre válido para el item');
            return;
        }

        // Verificar sección válida
        const seccionId = itemEditando ? itemEditando.seccion_id : formItemData.seccion_id;
        if (!seccionId || isNaN(seccionId)) {
            toast.error('Seleccione una sección válida');
            return;
        }

        const loadingToast = toast.loading(
            itemEditando ? 'Actualizando item...' : 'Creando item...'
        );

        try {
            const method = itemEditando ? 'PUT' : 'POST';
            const url = itemEditando
                ? `/api/items/${itemEditando.id}`
                : '/api/items';

            const payload = {
                seccion_id: Number(seccionId),
                nombre: formItemData.nombre.trim(),
                descripcion: formItemData.descripcion || null,
                precio: formItemData.precio !== null ? Number(formItemData.precio) : null,
                imagen_url: formItemData.imagen_url || null,
                archivo_pdf: formItemData.archivo_pdf || null,
                es_destacado: Boolean(formItemData.es_destacado)
            };

            console.log('Enviando datos:', payload); // Debug

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
            }

            toast.success(
                itemEditando ? '✅ Item actualizado correctamente' : '✅ Item creado correctamente',
                { id: loadingToast }
            );

            // Recargar los items de la sección
            await cargarItems(seccionId);
            cerrarModalItem();

        } catch (error: any) {
            console.error('Error al guardar item:', error);
            toast.error(
                error.message || '❌ Error al conectar con el servidor',
                { id: loadingToast }
            );
        }
    };

    const editarSeccion = (seccion: Seccion) => {
        setSeccionEditando(seccion)
        setFormData({
            nombre: seccion.nombre,
            imagen_url: seccion.imagen_url,
            tipo: seccion.tipo,
            tiene_catalogo: seccion.tiene_catalogo
        })
        setModalAbierto(true)
    }

    const editarItem = (item: ItemSeccion) => {
        console.log('Editando item:', item);
        setItemEditando(item);
        setFormItemData({
            seccion_id: item.seccion_id,
            nombre: item.nombre || '',
            descripcion: item.descripcion || '',
            precio: item.precio !== null && !isNaN(item.precio) ? item.precio : null,
            imagen_url: item.imagen_url || '',
            archivo_pdf: item.archivo_pdf || '',
            es_destacado: item.es_destacado || false
        });
        setModalItemAbierto(true);
    };

    const mostrarConfirmacion = (titulo: string, mensaje: string, onConfirm: () => void, onCancel?: () => void) => {
        setConfirmacionData({
            titulo,
            mensaje,
            onConfirm: () => {
                onConfirm()
                setModalConfirmacionAbierto(false)
            },
            onCancel: () => {
                onCancel?.()
                setModalConfirmacionAbierto(false)
            }
        })
        setModalConfirmacionAbierto(true)
    }

    const eliminarSeccion = async (id: number) => {
        mostrarConfirmacion(
            'Eliminar sección',
            '¿Estás seguro de que quieres eliminar esta sección? Todos los items asociados también serán eliminados.',
            async () => {
                try {
                    const res = await fetch(`${window.location.origin}/api/secciones/${id}`, {
                        method: 'DELETE',
                    })

                    const data = await res.json()
                    console.log('Respuesta eliminar sección:', data)

                    if (!res.ok) {
                        throw new Error(data.message || 'Error al eliminar la sección')
                    }

                    toast.success('Sección eliminada exitosamente')
                    cargarSecciones()
                    if (seccionSeleccionada === id) {
                        setSeccionSeleccionada(null)
                        setItems([])
                    }
                } catch (error: any) {
                    console.error('Error al eliminar la sección:', error)
                    toast.error(error.message || 'Error al eliminar la sección')
                }
            }
        )
    }

    const eliminarItem = async (itemId: number, seccionId: number) => {
        mostrarConfirmacion(
            'Eliminar item',
            '¿Estás seguro de que quieres eliminar este item? Esta acción no se puede deshacer.',
            async () => {
                try {
                    const res = await fetch(`${window.location.origin}/api/items/${itemId}`, {
                        method: 'DELETE',
                    })

                    const data = await res.json()
                    console.log('Respuesta eliminar item:', data)

                    if (!res.ok) {
                        throw new Error(data.error || 'Error al eliminar el item')
                    }

                    toast.success('Item eliminado exitosamente')

                    // Usar el seccion_id que viene de la respuesta o el que ya teníamos
                    const idSeccionParaRecargar = data.seccion_id || seccionId

                    if (idSeccionParaRecargar && !isNaN(idSeccionParaRecargar)) {
                        await cargarItems(idSeccionParaRecargar)
                    } else {
                        console.error('No se pudo determinar la sección para recargar')
                        // Opcional: recargar todas las secciones
                        await cargarSecciones()
                    }
                } catch (error: any) {
                    console.error('Error al eliminar el item:', error)
                    toast.error(error.message || 'Error al eliminar el item')
                }
            }
        )
    }

    const cerrarModalSeccion = () => {
        setModalAbierto(false)
        setSeccionEditando(null)
        setFormData({
            nombre: '',
            imagen_url: '',
            tipo: 'servicio',
            tiene_catalogo: false
        })
    }

    const cerrarModalItem = () => {
        setModalItemAbierto(false);
        // Resetear el formulario manteniendo la sección seleccionada
        setFormItemData(prev => ({
            seccion_id: seccionSeleccionada || prev.seccion_id,
            nombre: '',
            descripcion: '',
            precio: null,
            imagen_url: '',
            archivo_pdf: '',
            es_destacado: false
        }));
        setItemEditando(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h3 className="text-xl font-semibold">Secciones de Servicios/Productos</h3>
                <button
                    onClick={() => {
                        setSeccionEditando(null)
                        setFormData({
                            nombre: '',
                            imagen_url: '',
                            tipo: 'servicio',
                            tiene_catalogo: false
                        })
                        setModalAbierto(true)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap"
                >
                    + Nueva Sección
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {secciones.map(seccion => (
                        <div
                            key={seccion.id}
                            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full"
                        >
                            <div
                                className="relative h-48 bg-gray-100 flex-shrink-0 cursor-pointer"
                                onClick={() => cargarItems(seccion.id)}
                            >
                                {seccion.imagen_url ? (
                                    <Image
                                        src={seccion.imagen_url}
                                        alt={seccion.nombre}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        Sin imagen
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h4
                                    className="font-semibold text-lg mb-1 cursor-pointer"
                                    onClick={() => cargarItems(seccion.id)}
                                >
                                    {seccion.nombre}
                                </h4>
                                <p className="text-sm text-gray-600 capitalize mb-2">{seccion.tipo}</p>

                                <div className="flex justify-between mt-auto pt-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setFormItemData({
                                                seccion_id: seccion.id,
                                                nombre: '',
                                                descripcion: '',
                                                precio: null,
                                                imagen_url: '',
                                                archivo_pdf: '',
                                                es_destacado: false
                                            })
                                            setModalItemAbierto(true)
                                        }}
                                        className="text-green-600 hover:text-green-800 text-sm px-2 py-1"
                                    >
                                        + Agregar {seccion.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                                    </button>
                                    <div className="space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                editarSeccion(seccion)
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                eliminarSeccion(seccion.id)
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para confirmación de eliminación */}
            <Modal
                isOpen={modalConfirmacionAbierto}
                onClose={() => setModalConfirmacionAbierto(false)}
                title=""
                size="md"
            >
                <div className="space-y-5 text-white">
                    {/* Icono + Título + Mensaje */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
            1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 
            0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{confirmacionData.titulo}</h2>
                            <p className="mt-1 text-sm text-gray-900">{confirmacionData.mensaje}</p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={confirmacionData.onCancel}
                            className="px-4 py-2 rounded-md border border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={confirmacionData.onConfirm}
                            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm transition"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal para edición/creación de sección */}
            <Modal
                isOpen={modalAbierto}
                onClose={cerrarModalSeccion}
                title={seccionEditando ? 'Editar Sección' : 'Nueva Sección'}
            >
                <form onSubmit={guardarSeccion} onClick={(e) => e.stopPropagation()} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre*</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Imagen</label>
                        <ImageUploader
                            onImageUpload={handleImageUpload}
                            onUrlChange={(url) => setFormData(prev => ({ ...prev, imagen_url: url }))}
                            currentValue={formData.imagen_url}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="servicio">Servicio</option>
                            <option value="producto">Producto</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="tiene_catalogo"
                            checked={formData.tiene_catalogo}
                            onChange={handleChange}
                            className="mr-2"
                            id="tiene_catalogo"
                        />
                        <label htmlFor="tiene_catalogo" className="text-sm font-medium">
                            Incluye catálogo PDF
                        </label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={cerrarModalSeccion}
                            className="px-4 py-2 border rounded hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal para edición/creación de item */}
            <Modal
                isOpen={modalItemAbierto}
                onClose={cerrarModalItem}
                title={itemEditando ? 'Editar Item' : 'Nuevo Item'}
                size="lg"
            >
                <form onSubmit={guardarItem} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Sección*</label>
                        <select
                            name="seccion_id"
                            value={formItemData.seccion_id}
                            onChange={handleItemChange}
                            className="w-full border rounded px-3 py-2"
                            required
                            disabled={!!itemEditando}
                        >
                            <option value="">Seleccionar sección</option>
                            {secciones.map(sec => (
                                <option key={sec.id} value={sec.id}>{sec.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre*</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formItemData.nombre}
                            onChange={handleItemChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formItemData.descripcion}
                            onChange={handleItemChange}
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Precio</label>
                        <input
                            type="number"
                            name="precio"
                            value={formItemData.precio ?? ''}
                            onChange={handleItemChange}
                            className="w-full border rounded px-3 py-2"
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Imagen</label>
                        <ImageUploader
                            onImageUpload={handleImageUpload}
                            onUrlChange={(url) => setFormItemData(prev => ({ ...prev, imagen_url: url }))}
                            currentValue={formItemData.imagen_url}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">URL del catálogo PDF</label>
                        <input
                            type="text"
                            name="archivo_pdf"
                            value={formItemData.archivo_pdf}
                            onChange={handleItemChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="https://ejemplo.com/catalogo.pdf"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="es_destacado"
                            checked={formItemData.es_destacado}
                            onChange={handleItemChange}
                            className="mr-2"
                            id="es_destacado"
                        />
                        <label htmlFor="es_destacado" className="text-sm font-medium">
                            Destacar este item
                        </label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={cerrarModalItem}
                            className="px-4 py-2 border rounded hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white rounded transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal>

            {seccionSeleccionada && (
                <div className="mt-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="text-lg font-semibold">
                            {secciones.find(s => s.id === seccionSeleccionada)?.tipo === 'servicio' ? 'Servicios' : 'Productos'} de {secciones.find(s => s.id === seccionSeleccionada)?.nombre}
                        </h3>
                        <button
                            onClick={() => {
                                setFormItemData({
                                    seccion_id: seccionSeleccionada,
                                    nombre: '',
                                    descripcion: '',
                                    precio: null,
                                    imagen_url: '',
                                    archivo_pdf: '',
                                    es_destacado: false
                                })
                                setModalItemAbierto(true)
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded whitespace-nowrap"
                        >
                            + Agregar {secciones.find(s => s.id === seccionSeleccionada)?.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <p className="text-gray-500 py-4">No hay {secciones.find(s => s.id === seccionSeleccionada)?.tipo === 'servicio' ? 'servicios' : 'productos'} disponibles en esta sección.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(item => (
                                <div key={item.id} className="border rounded-lg overflow-hidden shadow flex flex-col h-full">
                                    <div className="relative h-48 bg-gray-100 flex-shrink-0">
                                        {item.imagen_url ? (
                                            <Image
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h4 className="font-semibold text-lg mb-1">{item.nombre}</h4>
                                        {item.descripcion && (
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.descripcion}</p>
                                        )}
                                        {item.precio !== null && !isNaN(item.precio) && (
                                            <p className="text-lg font-bold mt-auto">${Number(item.precio).toFixed(2)}</p>
                                        )}

                                        {item.archivo_pdf && (
                                            <div className="mt-3">
                                                <a
                                                    href={item.archivo_pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                    </svg>
                                                    Ver catálogo
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex justify-between mt-4 pt-3 border-t">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    editarItem(item)
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    eliminarItem(item.id, item.seccion_id)
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}