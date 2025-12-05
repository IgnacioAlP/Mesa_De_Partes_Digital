#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de Documentos PDF de Ejemplo para Mesa de Partes Digital
Municipalidad Distrital de Mochumi
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas
from datetime import datetime
import os

# Crear carpeta de salida
OUTPUT_DIR = "documentos_ejemplo"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Estilos
styles = getSampleStyleSheet()
style_title = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=16,
    textColor=colors.HexColor('#1e3a8a'),
    spaceAfter=30,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

style_subtitle = ParagraphStyle(
    'CustomSubtitle',
    parent=styles['Heading2'],
    fontSize=12,
    textColor=colors.HexColor('#1e40af'),
    spaceAfter=20,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

style_normal = ParagraphStyle(
    'CustomNormal',
    parent=styles['Normal'],
    fontSize=10,
    alignment=TA_JUSTIFY,
    spaceAfter=12,
    fontName='Helvetica'
)

style_small = ParagraphStyle(
    'CustomSmall',
    parent=styles['Normal'],
    fontSize=8,
    alignment=TA_JUSTIFY,
    fontName='Helvetica'
)

def agregar_encabezado(canvas_obj, doc):
    """Agrega encabezado oficial a cada página"""
    canvas_obj.saveState()
    
    # Logo y título
    canvas_obj.setFont('Helvetica-Bold', 14)
    canvas_obj.setFillColor(colors.HexColor('#1e3a8a'))
    canvas_obj.drawCentredString(A4[0]/2, A4[1] - 2*cm, "MUNICIPALIDAD DISTRITAL DE MOCHUMI")
    
    canvas_obj.setFont('Helvetica', 10)
    canvas_obj.setFillColor(colors.black)
    canvas_obj.drawCentredString(A4[0]/2, A4[1] - 2.5*cm, "Provincia de Lambayeque - Departamento de Lambayeque")
    
    # Línea separadora
    canvas_obj.setStrokeColor(colors.HexColor('#1e3a8a'))
    canvas_obj.setLineWidth(2)
    canvas_obj.line(2*cm, A4[1] - 3*cm, A4[0] - 2*cm, A4[1] - 3*cm)
    
    # Pie de página
    canvas_obj.setFont('Helvetica', 8)
    canvas_obj.setFillColor(colors.grey)
    canvas_obj.drawCentredString(A4[0]/2, 1.5*cm, "Plaza de Armas s/n - Mochumi - Lambayeque")
    canvas_obj.drawCentredString(A4[0]/2, 1*cm, "Teléfono: (074) 123-4567 | Email: mesapartes@mochumi.gob.pe")
    
    canvas_obj.restoreState()

# ============================================
# 1. SOLICITUD DE LICENCIA DE FUNCIONAMIENTO
# ============================================
def generar_solicitud_licencia_funcionamiento():
    filename = os.path.join(OUTPUT_DIR, "01_Solicitud_Licencia_Funcionamiento.pdf")
    doc = SimpleDocTemplate(filename, pagesize=A4, topMargin=4*cm, bottomMargin=3*cm)
    story = []
    
    # Título
    story.append(Paragraph("SOLICITUD DE LICENCIA DE FUNCIONAMIENTO", style_title))
    story.append(Spacer(1, 0.5*cm))
    
    # Datos del solicitante
    story.append(Paragraph("<b>SEÑOR ALCALDE DE LA MUNICIPALIDAD DISTRITAL DE MOCHUMI</b>", style_normal))
    story.append(Paragraph("<b>Presente.-</b>", style_normal))
    story.append(Spacer(1, 0.5*cm))
    
    # Datos del titular
    data_titular = [
        ['<b>DATOS DEL TITULAR</b>', ''],
        ['Nombre o Razón Social:', 'COMERCIAL "EL SOL" S.A.C.'],
        ['RUC:', '20601234567'],
        ['Representante Legal:', 'Juan Carlos Pérez Morales'],
        ['DNI:', '43215678'],
        ['Domicilio Legal:', 'Jr. Bolognesi N° 456 - Mochumi'],
        ['Teléfono:', '979-123-456'],
        ['Email:', 'comercialelsol@gmail.com']
    ]
    
    tabla_titular = Table(data_titular, colWidths=[6*cm, 10*cm])
    tabla_titular.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#e0e7ff')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    story.append(tabla_titular)
    story.append(Spacer(1, 0.5*cm))
    
    # Datos del establecimiento
    data_establecimiento = [
        ['<b>DATOS DEL ESTABLECIMIENTO</b>', ''],
        ['Nombre Comercial:', 'Bodega y Minimarket "El Sol"'],
        ['Giro del Negocio:', 'Venta al por menor de abarrotes y productos de primera necesidad'],
        ['Dirección:', 'Av. Grau N° 123 - Mochumi'],
        ['Referencia:', 'A media cuadra de la Plaza de Armas'],
        ['Área del local:', '85 m²'],
        ['Aforo:', '15 personas'],
        ['N° de trabajadores:', '3 personas'],
        ['Horario de atención:', 'Lunes a Domingo de 7:00 AM a 10:00 PM']
    ]
    
    tabla_establecimiento = Table(data_establecimiento, colWidths=[6*cm, 10*cm])
    tabla_establecimiento.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#e0e7ff')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    story.append(tabla_establecimiento)
    story.append(Spacer(1, 0.5*cm))
    
    # Solicitud
    texto_solicitud = """
    <b>SOLICITO:</b> Licencia de Funcionamiento para el establecimiento comercial antes descrito,
    de conformidad con la Ley N° 28976 - Ley Marco de Licencia de Funcionamiento.
    <br/><br/>
    <b>FUNDAMENTO:</b> El establecimiento cumple con los requisitos establecidos en el TUPA municipal
    y las normas de seguridad vigentes. Adjunto la documentación requerida para el trámite correspondiente.
    <br/><br/>
    Declaro bajo juramento que la información proporcionada es veraz y me comprometo a cumplir con
    las disposiciones municipales, normativa de Defensa Civil y demás regulaciones aplicables.
    <br/><br/>
    POR LO EXPUESTO:<br/>
    Solicito a Ud. señor Alcalde, acceder a mi petición por ser de justicia que espero alcanzar.
    """
    story.append(Paragraph(texto_solicitud, style_normal))
    story.append(Spacer(1, 1*cm))
    
    # Lugar y fecha
    fecha_actual = datetime.now().strftime("%d de %B de %Y")
    story.append(Paragraph(f"Mochumi, {fecha_actual}", ParagraphStyle('Right', parent=style_normal, alignment=TA_RIGHT)))
    story.append(Spacer(1, 2*cm))
    
    # Firma
    story.append(Paragraph("_______________________________", ParagraphStyle('Center', parent=style_normal, alignment=TA_CENTER)))
    story.append(Paragraph("<b>Juan Carlos Pérez Morales</b>", ParagraphStyle('Center', parent=style_normal, alignment=TA_CENTER)))
    story.append(Paragraph("DNI: 43215678", ParagraphStyle('Center', parent=style_normal, alignment=TA_CENTER)))
    story.append(Paragraph("Representante Legal", ParagraphStyle('Center', parent=style_normal, alignment=TA_CENTER)))
    
    doc.build(story, onFirstPage=agregar_encabezado, onLaterPages=agregar_encabezado)
    print(f"✅ Generado: {filename}")

# ============================================
# 2. DNI (SIMULADO)
# ============================================
def generar_dni_ejemplo():
    filename = os.path.join(OUTPUT_DIR, "02_DNI_Juan_Perez.pdf")
    c = canvas.Canvas(filename, pagesize=(8.5*cm, 5.4*cm))
    
    # Fondo
    c.setFillColor(colors.HexColor('#e8f4f8'))
    c.rect(0, 0, 8.5*cm, 5.4*cm, fill=True, stroke=False)
    
    # Borde
    c.setStrokeColor(colors.HexColor('#1e3a8a'))
    c.setLineWidth(2)
    c.rect(0.2*cm, 0.2*cm, 8.1*cm, 5*cm)
    
    # Título
    c.setFillColor(colors.HexColor('#1e3a8a'))
    c.setFont('Helvetica-Bold', 10)
    c.drawString(0.5*cm, 4.8*cm, "REPÚBLICA DEL PERÚ")
    c.setFont('Helvetica', 8)
    c.drawString(0.5*cm, 4.5*cm, "DOCUMENTO NACIONAL DE IDENTIDAD")
    
    # Foto (simulada)
    c.setFillColor(colors.lightgrey)
    c.rect(0.5*cm, 1.5*cm, 2*cm, 2.5*cm, fill=True, stroke=True)
    c.setFillColor(colors.black)
    c.setFont('Helvetica', 6)
    c.drawCentredString(1.5*cm, 2.7*cm, "FOTO")
    
    # Datos
    c.setFont('Helvetica-Bold', 7)
    c.drawString(2.7*cm, 3.8*cm, "APELLIDOS:")
    c.setFont('Helvetica', 7)
    c.drawString(3.7*cm, 3.8*cm, "PÉREZ MORALES")
    
    c.setFont('Helvetica-Bold', 7)
    c.drawString(2.7*cm, 3.5*cm, "NOMBRES:")
    c.setFont('Helvetica', 7)
    c.drawString(3.7*cm, 3.5*cm, "JUAN CARLOS")
    
    c.setFont('Helvetica-Bold', 8)
    c.drawString(2.7*cm, 3.1*cm, "DNI:")
    c.setFont('Helvetica-Bold', 10)
    c.drawString(3.3*cm, 3.1*cm, "43215678")
    
    c.setFont('Helvetica-Bold', 7)
    c.drawString(2.7*cm, 2.7*cm, "FECHA NAC:")
    c.setFont('Helvetica', 7)
    c.drawString(3.7*cm, 2.7*cm, "15/03/1985")
    
    c.setFont('Helvetica-Bold', 7)
    c.drawString(2.7*cm, 2.4*cm, "SEXO:")
    c.setFont('Helvetica', 7)
    c.drawString(3.2*cm, 2.4*cm, "M")
    
    c.setFont('Helvetica-Bold', 7)
    c.drawString(2.7*cm, 2.1*cm, "ESTADO CIVIL:")
    c.setFont('Helvetica', 7)
    c.drawString(3.9*cm, 2.1*cm, "CASADO")
    
    c.setFont('Helvetica-Bold', 7)
    c.drawString(0.5*cm, 1.2*cm, "DIRECCIÓN:")
    c.setFont('Helvetica', 6)
    c.drawString(0.5*cm, 0.9*cm, "Jr. Bolognesi N° 456 - Mochumi - Lambayeque")
    
    c.setFont('Helvetica', 5)
    c.drawString(0.5*cm, 0.5*cm, "FECHA EMISIÓN: 12/05/2023")
    c.drawString(4*cm, 0.5*cm, "FECHA CADUCIDAD: 12/05/2031")
    
    c.save()
    print(f"✅ Generado: {filename}")

# ============================================
# 3. RUC Y FICHA RUC
# ============================================
def generar_ficha_ruc():
    filename = os.path.join(OUTPUT_DIR, "03_RUC_Comprobante_Informacion.pdf")
    doc = SimpleDocTemplate(filename, pagesize=A4, topMargin=3*cm, bottomMargin=2*cm)
    story = []
    
    # Encabezado SUNAT
    story.append(Paragraph("<b>SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA - SUNAT</b>", 
                          ParagraphStyle('Center', parent=style_subtitle, fontSize=11, alignment=TA_CENTER)))
    story.append(Paragraph("COMPROBANTE DE INFORMACIÓN REGISTRADA", style_title))
    story.append(Spacer(1, 0.3*cm))
    
    # Fecha de consulta
    fecha_consulta = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    story.append(Paragraph(f"<b>Fecha y Hora de Consulta:</b> {fecha_consulta}", style_small))
    story.append(Spacer(1, 0.5*cm))
    
    # Datos principales
    data_ruc = [
        ['<b>DATOS DEL CONTRIBUYENTE</b>', ''],
        ['RUC:', '<b>20601234567</b>'],
        ['Tipo Contribuyente:', 'SOCIEDAD ANONIMA CERRADA'],
        ['Nombre/Razón Social:', 'COMERCIAL EL SOL S.A.C.'],
        ['Nombre Comercial:', 'BODEGA Y MINIMARKET EL SOL'],
        ['Fecha de Inscripción:', '15/08/2020'],
        ['Estado:', 'ACTIVO'],
        ['Condición:', 'HABIDO'],
        ['Domicilio Fiscal:', 'JR. BOLOGNESI NRO. 456 - MOCHUMI - LAMBAYEQUE - LAMBAYEQUE'],
        ['Sistema de Emisión:', 'MANUAL/COMPUTARIZADO'],
        ['Actividad Comercial Exterior:', 'SIN ACTIVIDAD'],
        ['Sistema de Contabilidad:', 'MANUAL/COMPUTARIZADO']
    ]
    
    tabla_ruc = Table(data_ruc, colWidths=[7*cm, 10*cm])
    tabla_ruc.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#c41e3a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    story.append(tabla_ruc)
    story.append(Spacer(1, 0.5*cm))
    
    # Actividades económicas
    story.append(Paragraph("<b>ACTIVIDADES ECONÓMICAS (CIIU)</b>", style_subtitle))
    data_actividades = [
        ['<b>Código</b>', '<b>Descripción</b>', '<b>Principal</b>'],
        ['47110', 'Venta al por menor en comercios no especializados con predominio de la venta de alimentos, bebidas o tabaco', 'SÍ'],
        ['47190', 'Otros tipos de venta al por menor en comercios no especializados', 'NO']
    ]
    
    tabla_actividades = Table(data_actividades, colWidths=[3*cm, 11*cm, 3*cm])
    tabla_actividades.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#c41e3a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    story.append(tabla_actividades)
    story.append(Spacer(1, 0.5*cm))
    
    # Comprobantes de pago
    story.append(Paragraph("<b>COMPROBANTES DE PAGO Y/O DOCUMENTOS AUTORIZADOS</b>", style_subtitle))
    data_comprobantes = [
        ['<b>Tipo</b>', '<b>Estado</b>'],
        ['Factura', 'AUTORIZADO'],
        ['Boleta de Venta', 'AUTORIZADO'],
        ['Nota de Crédito', 'AUTORIZADO'],
        ['Nota de Débito', 'AUTORIZADO']
    ]
    
    tabla_comprobantes = Table(data_comprobantes, colWidths=[10*cm, 7*cm])
    tabla_comprobantes.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#c41e3a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
    ]))
    story.append(tabla_comprobantes)
    story.append(Spacer(1, 1*cm))
    
    # Nota al pie
    nota = """
    <b>NOTA:</b> Este comprobante no constituye autorización de impresión ni comprobante de pago.
    La información aquí contenida corresponde a la registrada en el RUC a la fecha y hora de consulta.
    """
    story.append(Paragraph(nota, style_small))
    
    doc.build(story)
    print(f"✅ Generado: {filename}")

# Función principal
def main():
    print("=" * 60)
    print("GENERADOR DE DOCUMENTOS PDF DE EJEMPLO")
    print("Mesa de Partes Digital - Municipalidad de Mochumi")
    print("=" * 60)
    print()
    
    generar_solicitud_licencia_funcionamiento()
    generar_dni_ejemplo()
    generar_ficha_ruc()
    
    print()
    print("=" * 60)
    print(f"✅ Generación completada. {3} documentos creados en '{OUTPUT_DIR}'")
    print("=" * 60)

if __name__ == "__main__":
    main()
