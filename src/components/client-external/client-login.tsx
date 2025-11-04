"use client"

import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

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
    <Card className="mx-auto w-full max-w-md border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Client Login</CardTitle>
        <CardDescription>Access your client dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input type="email" placeholder="you@company.com" className="pl-9" {...field} />
                    </div>
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
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="pl-9" {...field} />
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
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input type={showConfirm ? 'text' : 'password'} placeholder="Enter your password again" className="pl-9" {...field} />
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
            <Button type="submit" size="lg" className="w-full">Sign in</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm">
        <Button variant="link" className="px-0" asChild>
          <Link href="/client/forgot-password">Forgot Password</Link>
        </Button>
        <Button variant="link" className="px-0" asChild>
          <Link href="/client/register">Register</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
