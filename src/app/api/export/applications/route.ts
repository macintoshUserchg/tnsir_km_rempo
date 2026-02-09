import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '@/lib/db';

export async function GET() {
    try {
        // Fetch all applications with related data
        const applications = await prisma.citizenApp.findMany({
            include: {
                vidhansabha: true,
                workType: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Transform data for Excel
        const excelData = applications.map((app, index) => ({
            'क्र.सं. / S.No.': index + 1,
            'आवेदन संख्या / Application No.': app.cNumber,
            'नाम / Name': app.name,
            'पिता का नाम / Father Name': app.fatherName,
            'मोबाइल / Mobile': app.mobile,
            'पता / Address': app.address,
            'विधानसभा / Vidhansabha': app.vidhansabha.nameHi,
            'कार्य प्रकार / Work Type': app.workType.nameHi,
            'प्रकार / Type': app.type === 'CITIZEN' ? 'नागरिक' : 'जनप्रतिनिधि',
            'स्थिति / Status': app.status === 'PENDING' ? 'लंबित' :
                app.status === 'IN_PROGRESS' ? 'प्रगति में' :
                    app.status === 'RESOLVED' ? 'समाधान' : 'अस्वीकृत',
            'दिनांक / Date': new Date(app.createdAt).toLocaleDateString('hi-IN'),
            'विवरण / Description': app.description,
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet['!cols'] = [
            { wch: 8 },   // S.No.
            { wch: 18 },  // Application No.
            { wch: 20 },  // Name
            { wch: 20 },  // Father Name
            { wch: 12 },  // Mobile
            { wch: 30 },  // Address
            { wch: 15 },  // Vidhansabha
            { wch: 20 },  // Work Type
            { wch: 12 },  // Type
            { wch: 12 },  // Status
            { wch: 12 },  // Date
            { wch: 40 },  // Description
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Return Excel file
        const filename = `applications_${new Date().toISOString().slice(0, 10)}.xlsx`;

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
