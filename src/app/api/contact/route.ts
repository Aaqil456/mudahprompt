import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Semua medan diperlukan' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak sah' },
        { status: 400 }
      )
    }

    // Create email content
    const emailContent = `
Mesej Baru dari MudahPrompt Contact Form

Nama: ${name}
Email: ${email}
Subjek: ${subject}

Mesej:
${message}

---
Mesej ini dihantar dari MudahPrompt Contact Form
Tarikh: ${new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
    `.trim()

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      // Fallback: Log the email content to console
      console.log('=== CONTACT FORM SUBMISSION (GMAIL NOT CONFIGURED) ===')
      console.log('To: aautomate123@gmail.com')
      console.log('Subject: MudahPrompt Contact - ' + subject)
      console.log('Content:', emailContent)
      console.log('=====================================================')
      
      return NextResponse.json(
        { message: 'Mesej berjaya dihantar (check console for details)' },
        { status: 200 }
      )
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // your Gmail app password
      }
    })

    // Email options
    const mailOptions = {
      from: `"MudahPrompt Contact" <${process.env.GMAIL_USER}>`,
      to: 'aautomate123@gmail.com',
      replyTo: email, // This allows you to reply directly to the sender
      subject: `MudahPrompt Contact - ${subject}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff00;">Mesej Baru dari MudahPrompt Contact Form</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subjek:</strong> ${subject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #00ff00; margin: 20px 0;">
            <h3>Mesej:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Mesej ini dihantar dari MudahPrompt Contact Form<br>
            Tarikh: ${new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
          </p>
        </div>
      `
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)

    return NextResponse.json(
      { message: 'Mesej berjaya dihantar' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Ralat dalaman server' },
      { status: 500 }
    )
  }
} 