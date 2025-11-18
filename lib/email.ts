/**
 * Email utility for sending emails
 * Currently logs to console - replace with your email service (SendGrid, Resend, etc.)
 */

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
  
  // TODO: Replace with actual email service
  // Example with Resend:
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@bedtimestories.com',
  //   to: email,
  //   subject: 'Reset your password',
  //   html: `Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a>`
  // })
  
  console.log('Password reset email would be sent to:', email)
  console.log('Reset URL:', resetUrl)
  
  // For development/testing, you can check the console for the reset link
  return { success: true }
}

