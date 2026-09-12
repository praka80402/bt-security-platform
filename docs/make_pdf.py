import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(num_pages)
            super().showPage()
        super().save()

    def draw_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        if self._pageNumber > 1:
            self.drawString(54, 11 * inch - 36, "Yash Enterprises — Technical Documentation & Architecture Reference")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)
        
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 8.5 * inch - 54, 46)
        
        self.drawString(54, 32, "Confidential - For Internal & Administrative Use Only | bestcctvservice.com")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 54, 32, page_str)
        self.restoreState()

def build_pdf():
    pdf_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(pdf_dir, "Yash_Enterprises_Technical_Documentation.pdf")

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    primary_color = colors.HexColor("#1E3A8A")
    secondary_color = colors.HexColor("#D97706")
    dark_slate = colors.HexColor("#0F172A")
    light_bg = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#E2E8F0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=dark_slate,
        spaceBefore=10,
        spaceAfter=5
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=5
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=dark_slate
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=dark_slate
    )

    story = []

    story.append(Paragraph("YASH ENTERPRISES", title_style))
    story.append(Paragraph("Platform Architecture, Technology Stack & Database Schema Documentation", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=0, spaceAfter=12))

    overview_text = (
        "<b>Platform Name:</b> Yash Enterprises Security & Biometric Solutions Portal<br/>"
        "<b>Live Domain:</b> bestcctvservice.com | <b>Support Phone:</b> +91 9308907319<br/>"
        "<b>Environment:</b> Production / Enterprise Grade Web Application<br/>"
        "<b>Document Purpose:</b> Complete technical specification of technology stack, system architecture, "
        "and Relational Database Management System (MySQL) schema design."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Technology Stack Architecture", h1_style))
    story.append(Paragraph(
        "The platform is built using modern full-stack web standards ensuring high performance, SEO optimization, and secure operations.",
        body_style
    ))

    tech_table_data = [
        [Paragraph("<b>Layer / Domain</b>", table_header_style), 
         Paragraph("<b>Technologies & Frameworks</b>", table_header_style), 
         Paragraph("<b>Role & Key Highlights</b>", table_header_style)],
        
        [Paragraph("<b>Frontend Framework</b>", table_cell_bold),
         Paragraph("Next.js 14 (App Router), React 18, TypeScript", table_cell_style),
         Paragraph("Server-Side Rendering (SSR), Static Generation (SSG), dynamic SEO tags, strict typing.", table_cell_style)],

        [Paragraph("<b>Styling & UI</b>", table_cell_bold),
         Paragraph("Tailwind CSS, Lucide React, Responsive Grid", table_cell_style),
         Paragraph("Custom enterprise UI theme, mobile-first responsive layout, accessible modal portals.", table_cell_style)],

        [Paragraph("<b>Backend API Layer</b>", table_cell_bold),
         Paragraph("Next.js Route Handlers (Node.js runtime)", table_cell_style),
         Paragraph("RESTful API endpoints for leads, tickets, AMC contracts, products, and admin auth.", table_cell_style)],

        [Paragraph("<b>Database Engine</b>", table_cell_bold),
         Paragraph("MySQL 8.0 Community / Server (Port 3306)", table_cell_style),
         Paragraph("ACID compliant relational database, foreign key relations, auto-indexing on primary keys.", table_cell_style)],

        [Paragraph("<b>ORM & Query Layer</b>", table_cell_bold),
         Paragraph("Prisma ORM v5", table_cell_style),
         Paragraph("Schema-first migrations, type-safe database queries, connection pool management.", table_cell_style)],

        [Paragraph("<b>Security & Auth</b>", table_cell_bold),
         Paragraph("JSON Web Tokens (JWT), Bcrypt password hashing", table_cell_style),
         Paragraph("Role-Based Access Control (SUPERADMIN / ADMIN / TECHNICIAN), secure HTTP cookies.", table_cell_style)],

        [Paragraph("<b>Media & Branding</b>", table_cell_bold),
         Paragraph("Local static assets + Scalable SVG vector icons", table_cell_style),
         Paragraph("High-resolution Yash Enterprises logo, official WhatsApp vector emblem, product images.", table_cell_style)]
    ]

    tech_table = Table(tech_table_data, colWidths=[1.5 * inch, 2.5 * inch, 3.0 * inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("2. Database Specifications", h1_style))
    db_spec_info = (
        "<b>Database Engine:</b> MySQL Relational Database (RDBMS)<br/>"
        "<b>Database Name:</b> <font color='#1E3A8A'><b>bt_security_db</b></font><br/>"
        "<b>Default Port:</b> 3306 | <b>Encoding:</b> utf8mb4 | <b>Collation:</b> utf8mb4_unicode_ci<br/>"
        "<b>Connection String Pattern:</b> <code>mysql://root:password@localhost:3306/bt_security_db</code><br/>"
        "<b>Schema Definition File:</b> <code>prisma/schema.prisma</code>"
    )
    story.append(Paragraph(db_spec_info, body_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("3. Complete Schema & Table Structures", h1_style))
    story.append(Paragraph(
        "The database contains <b>5 core production tables</b> managing staff credentials, product catalog, customer inquiries, service tickets, and AMC maintenance contracts.",
        body_style
    ))

    tables_detail = [
        {
            'name': '1. admin_users',
            'purpose': 'Stores administrative login credentials, role permissions (SUPERADMIN, ADMIN, TECHNICIAN), and timestamps.',
            'cols': [
                ('id', 'VARCHAR(191)', 'PRIMARY KEY', 'UUID string generated via cuid()'),
                ('name', 'VARCHAR(191)', 'NOT NULL', 'Full display name of the staff / administrator'),
                ('email', 'VARCHAR(191)', 'UNIQUE NOT NULL', 'Unique email address used for portal login'),
                ('passwordHash', 'VARCHAR(191)', 'NOT NULL', 'Bcrypt hashed password (salted and encrypted)'),
                ('role', 'ENUM/VARCHAR(50)', 'DEFAULT "ADMIN"', 'Role: SUPERADMIN, ADMIN, or TECHNICIAN'),
                ('createdAt', 'DATETIME(3)', 'DEFAULT NOW()', 'Timestamp when account was created'),
                ('updatedAt', 'DATETIME(3)', 'ON UPDATE NOW()', 'Automatic timestamp of last profile / role update')
            ]
        },
        {
            'name': '2. products',
            'purpose': 'Inventory & catalog for CCTV cameras (HD Analog, IP, PTZ, Dome, Bullet), Biometric machines, and Accessories.',
            'cols': [
                ('id', 'VARCHAR(191)', 'PRIMARY KEY', 'Unique product ID'),
                ('name', 'VARCHAR(191)', 'NOT NULL', 'Item display name (e.g. 2MP Full HD Dome Camera)'),
                ('slug', 'VARCHAR(191)', 'UNIQUE NOT NULL', 'URL-friendly SEO slug (e.g. 2mp-dome-camera)'),
                ('category', 'VARCHAR(191)', 'NOT NULL', 'Category: CCTV, BIOMETRIC, ACCESS_CONTROL, ACCESSORY'),
                ('brand', 'VARCHAR(191)', 'NOT NULL', 'Manufacturer brand: CP Plus, Hikvision, Dahua, eSSL, Realtime'),
                ('modelNumber', 'VARCHAR(191)', 'NULLABLE', 'Manufacturer hardware model / serial identifier'),
                ('price', 'DECIMAL(10,2)', 'DEFAULT 0.00', 'Base retail/display price in INR'),
                ('description', 'TEXT', 'NOT NULL', 'Detailed specifications and technical datasheet text'),
                ('features', 'TEXT / JSON', 'NULLABLE', 'Bullet points / feature highlights in JSON format'),
                ('imageUrl', 'VARCHAR(500)', 'NULLABLE', 'URL to the product image'),
                ('inStock', 'BOOLEAN', 'DEFAULT TRUE', 'Availability indicator for customer orders'),
                ('featured', 'BOOLEAN', 'DEFAULT FALSE', 'Flag to showcase product on homepage')
            ]
        },
        {
            'name': '3. leads',
            'purpose': 'Captures customer quotations, website inquiry forms, callback requests, and installation requirements.',
            'cols': [
                ('id', 'VARCHAR(191)', 'PRIMARY KEY', 'Unique lead ID'),
                ('name', 'VARCHAR(191)', 'NOT NULL', 'Prospect / Customer full name'),
                ('phone', 'VARCHAR(20)', 'NOT NULL', 'Primary mobile / WhatsApp contact number'),
                ('email', 'VARCHAR(191)', 'NULLABLE', 'Customer email address for sending quotations'),
                ('serviceType', 'VARCHAR(100)', 'NOT NULL', 'CCTV Installation, Biometric Setup, AMC, Repair, Custom'),
                ('message', 'TEXT', 'NULLABLE', 'Customer notes, camera count, or location details'),
                ('status', 'VARCHAR(50)', 'DEFAULT "NEW"', 'Lead status: NEW, CONTACTED, QUOTED, WON, LOST'),
                ('createdAt', 'DATETIME(3)', 'DEFAULT NOW()', 'Timestamp when enquiry was submitted')
            ]
        },
        {
            'name': '4. service_tickets',
            'purpose': 'Doorstep repair & technician dispatch management. Tracks ticket number, customer address, issue description, and technician status.',
            'cols': [
                ('id', 'VARCHAR(191)', 'PRIMARY KEY', 'Unique ticket record ID'),
                ('ticketNumber', 'VARCHAR(50)', 'UNIQUE NOT NULL', 'Public tracking ID formatted as TIC-YYYY-XXXX'),
                ('customerName', 'VARCHAR(191)', 'NOT NULL', 'Full name of customer needing service'),
                ('phone', 'VARCHAR(20)', 'NOT NULL', 'Customer contact number for technician coordination'),
                ('address', 'TEXT', 'NOT NULL', 'Doorstep physical installation / repair address'),
                ('city', 'VARCHAR(100)', 'DEFAULT "Patna"', 'Service city / locality'),
                ('serviceType', 'VARCHAR(100)', 'NOT NULL', 'CCTV Offline, DVR Beeping, HDD Failure, Biometric Sync'),
                ('issueDescription', 'TEXT', 'NOT NULL', 'Exact fault details described by customer'),
                ('status', 'VARCHAR(50)', 'DEFAULT "OPEN"', 'OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CANCELLED'),
                ('technicianName', 'VARCHAR(191)', 'NULLABLE', 'Assigned field technician name'),
                ('technicianPhone', 'VARCHAR(20)', 'NULLABLE', 'Field technician contact number'),
                ('scheduledDate', 'DATETIME(3)', 'NULLABLE', 'Scheduled visit date and time window'),
                ('resolutionNotes', 'TEXT', 'NULLABLE', 'Technician visit report and parts replaced'),
                ('createdAt', 'DATETIME(3)', 'DEFAULT NOW()', 'Ticket creation timestamp')
            ]
        },
        {
            'name': '5. amc_contracts',
            'purpose': 'Annual Maintenance Contracts (AMC) for corporate offices, retail stores, residential apartments, and warehouses.',
            'cols': [
                ('id', 'VARCHAR(191)', 'PRIMARY KEY', 'Unique contract ID'),
                ('contractNumber', 'VARCHAR(50)', 'UNIQUE NOT NULL', 'AMC agreement number formatted as AMC-YYYY-XXXX'),
                ('customerName', 'VARCHAR(191)', 'NOT NULL', 'Signatory / Contact person name'),
                ('companyName', 'VARCHAR(191)', 'NULLABLE', 'Business / Organization / Apartment society name'),
                ('phone', 'VARCHAR(20)', 'NOT NULL', 'Primary billing & support phone number'),
                ('email', 'VARCHAR(191)', 'NULLABLE', 'Official email for renewal notices and billing invoices'),
                ('address', 'TEXT', 'NOT NULL', 'Contract site location / premises address'),
                ('planType', 'VARCHAR(50)', 'NOT NULL', 'Comprehensive, Non-Comprehensive, Quarterly Visit Plan'),
                ('totalCameras', 'INT', 'DEFAULT 0', 'Number of CCTV cameras covered under this AMC'),
                ('totalBiometrics', 'INT', 'DEFAULT 0', 'Number of Biometric attendance machines covered'),
                ('amount', 'DECIMAL(10,2)', 'NOT NULL', 'Total annual contract value in INR'),
                ('startDate', 'DATETIME(3)', 'NOT NULL', 'Contract effective inception date'),
                ('endDate', 'DATETIME(3)', 'NOT NULL', 'Contract expiration / renewal due date'),
                ('status', 'VARCHAR(50)', 'DEFAULT "ACTIVE"', 'ACTIVE, EXPIRING_SOON, EXPIRED, TERMINATED'),
                ('notes', 'TEXT', 'NULLABLE', 'Custom clauses, SLA response times (e.g. 4-hour SLA)')
            ]
        }
    ]

    for tbl in tables_detail:
        table_elements = []
        table_elements.append(Paragraph(tbl['name'], h2_style))
        table_elements.append(Paragraph(f"<b>Purpose:</b> {tbl['purpose']}", body_style))

        t_data = [
            [Paragraph("<b>Column Name</b>", table_header_style),
             Paragraph("<b>Data Type</b>", table_header_style),
             Paragraph("<b>Key / Constraint</b>", table_header_style),
             Paragraph("<b>Description & Business Rule</b>", table_header_style)]
        ]

        for col in tbl['cols']:
            t_data.append([
                Paragraph(f"<code>{col[0]}</code>", table_cell_bold),
                Paragraph(col[1], table_cell_style),
                Paragraph(col[2], table_cell_style),
                Paragraph(col[3], table_cell_style)
            ])

        col_table = Table(t_data, colWidths=[1.4 * inch, 1.3 * inch, 1.4 * inch, 2.9 * inch])
        col_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), primary_color),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ]))
        table_elements.append(col_table)
        table_elements.append(Spacer(1, 8))

        story.append(KeepTogether(table_elements))

    story.append(Paragraph("4. Maintenance, Backup & Operational Commands", h1_style))
    admin_commands = (
        "<b>MySQL Database Backup Command (CLI):</b><br/>"
        "<code>mysqldump -u root -p bt_security_db > backup_bt_security_db.sql</code><br/><br/>"
        "<b>Prisma Schema Push & Sync:</b><br/>"
        "<code>npx prisma db push</code> (Sync schema directly to MySQL database)<br/>"
        "<code>npx prisma studio</code> (Open GUI database viewer on port 5555)<br/><br/>"
        "<b>Application Deployment & Run:</b><br/>"
        "<code>npm run build</code> (Production compile)<br/>"
        "<code>npm run start</code> (Launches production web server on port 3000)"
    )
    story.append(Paragraph(admin_commands, body_style))
    story.append(Spacer(1, 10))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF_BUILT_SUCCESSFULLY: {pdf_path}")

if __name__ == '__main__':
    build_pdf()