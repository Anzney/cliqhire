"use client"

import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string().min(6, 'At least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export default function ClientLogin() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  })

  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values)
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Client Login</h2>
        <p className="mt-1 text-sm text-muted-foreground">Access your client dashboard</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showConfirm ? 'text' : 'password'} placeholder="Enter your password again" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2"
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      aria-pressed={showConfirm}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </Form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Button variant="link" className="px-0" asChild>
          <Link href="/client/forgot-password">Forgot Password</Link>
        </Button>
        <Button variant="link" className="px-0" asChild>
          <Link href="/client/register">Register</Link>
        </Button>
      </div>
    </div>
  )
}
