import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  category: z.string().min(1, 'Category is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📧 Contact form submission received:', body);

    // Validate request body
    const validatedData = ContactFormSchema.parse(body);

    // TODO: In a real implementation, you would:
    // 1. Send an email to the admin team
    // 2. Store the message in a database
    // 3. Send a confirmation email to the user
    // 4. Integrate with a service like SendGrid, Resend, or similar

    // For now, we'll just log the submission and return success
    console.log('✅ Valid contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      category: validatedData.category,
      messageLength: validatedData.message.length,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: `contact_${Date.now()}`, // Generate a simple ID
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid form data',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to process contact form submission',
    }, { status: 500 });
  }
}