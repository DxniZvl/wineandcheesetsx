// src/utils/pdfGenerator.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import QRCode from 'qrcode'
import { Pedido, PedidoItem } from '../services/orderService'

interface UserInfo {
    nombre: string
    apellido: string
    email: string
}

export const generateReciboPDF = async (
    pedido: Pedido,
    items: PedidoItem[],
    usuario: UserInfo,
    options: { title?: string, isQuote?: boolean } = {}
): Promise<void> => {
    const doc = new jsPDF()
    const title = options.title || 'Recibo de Pedido'

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('WINE & CHEESE', 105, 20, { align: 'center' })

    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text(title, 105, 28, { align: 'center' })

    // Línea divisoria
    doc.setLineWidth(0.5)
    doc.line(20, 32, 190, 32)

    // Información del pedido
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`${options.isQuote ? 'Cotización' : 'Pedido'}: ${pedido.numero_pedido}`, 20, 42)

    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha: ${new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}`, 20, 48)
    doc.text(`Cliente: ${usuario.nombre} ${usuario.apellido}`, 20, 54)
    doc.text(`Email: ${usuario.email}`, 20, 60)

    // Generar QR Code
    try {
        const qrDataURL = await QRCode.toDataURL(pedido.numero_pedido, {
            width: 80,
            margin: 1
        })
        doc.addImage(qrDataURL, 'PNG', 150, 38, 35, 35)
    } catch (error) {
        console.error('Error generating QR:', error)
    }

    // Tabla de items
    const tableData = items.map(item => [
        item.cantidad.toString(),
        item.nombre_vino,
        `$${item.precio_unitario.toFixed(2)}`,
        `$${item.subtotal.toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 80,
        head: [['Cant.', 'Producto', 'Precio Unit.', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [90, 0, 21],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 20 },
            1: { cellWidth: 80 },
            2: { halign: 'right', cellWidth: 35 },
            3: { halign: 'right', cellWidth: 35 }
        }
    })

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10

    doc.setLineWidth(0.5)
    doc.line(130, finalY, 190, finalY)

    doc.setFont('helvetica', 'normal')
    doc.text('Subtotal:', 130, finalY + 7)
    doc.text(`$${(pedido.total + pedido.descuento_aplicado).toFixed(2)}`, 190, finalY + 7, { align: 'right' })

    if (pedido.descuento_aplicado > 0) {
        doc.text('Descuento:', 130, finalY + 13)
        doc.text(`-$${pedido.descuento_aplicado.toFixed(2)}`, 190, finalY + 13, { align: 'right' })
    }

    doc.setLineWidth(0.8)
    doc.line(130, finalY + 16, 190, finalY + 16)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('TOTAL:', 130, finalY + 23)
    doc.text(`$${pedido.total.toFixed(2)}`, 190, finalY + 23, { align: 'right' })

    // Información importante
    const infoY = finalY + 35

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('⏰ VÁLIDO HASTA:', 20, infoY)

    doc.setFont('helvetica', 'normal')
    const fechaVencimiento = new Date(pedido.fecha_vencimiento)
    doc.text(fechaVencimiento.toLocaleString('es-ES'), 20, infoY + 6)

    doc.setFont('helvetica', 'bold')
    doc.text('📍 RECOGER EN:', 20, infoY + 16)

    doc.setFont('helvetica', 'normal')
    doc.text('Wine & Cheese - Tienda Principal', 20, infoY + 22)

    doc.setFont('helvetica', 'bold')
    doc.text('💰 PAGO:', 20, infoY + 32)

    doc.setFont('helvetica', 'normal')
    doc.text('Efectivo o tarjeta al momento de recoger', 20, infoY + 38)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    const footerText = options.isQuote
        ? 'Esta cotización es válida por 24 horas. Precios sujetos a cambios.'
        : 'Gracias por tu compra. Presenta este recibo al recoger tu pedido.'
    doc.text(footerText, 105, 280, { align: 'center' })

    // Guardar PDF
    const fileName = options.isQuote ? `Cotizacion_${pedido.numero_pedido}.pdf` : `Pedido_${pedido.numero_pedido}.pdf`
    doc.save(fileName)
}
