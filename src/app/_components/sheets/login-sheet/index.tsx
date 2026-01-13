"use client"

import { useCallback, useState } from "react"
import { atom, useAtom } from "jotai"

import { Button } from "@851-labs/ui/components/button"
import { Input } from "@851-labs/ui/components/input"
import { Sheet } from "@851-labs/ui/components/sheet"

import { createClient } from "@/utils/supabase/client"
import { URLS } from "@/utils/urls"

const showLoginSheetAtom = atom(false)
const pendingPromptAtom = atom<string | null>(null)

function useLoginSheet() {
  const setShowLoginSheet = useAtom(showLoginSheetAtom)[1]
  const setPendingPrompt = useAtom(pendingPromptAtom)[1]

  const openLoginSheet = useCallback(
    (prompt?: string) => {
      if (prompt) {
        setPendingPrompt(prompt)
      }
      setShowLoginSheet(true)
    },
    [setShowLoginSheet, setPendingPrompt],
  )

  return { openLoginSheet }
}

function LoginSheet() {
  const [open, setOpen] = useAtom(showLoginSheetAtom)
  const [pendingPrompt, setPendingPrompt] = useAtom(pendingPromptAtom)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setError(null)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const callbackUrl = new URL(URLS.auth.callback, window.location.origin)
    if (pendingPrompt) {
      callbackUrl.searchParams.set("next", `/?prompt=${encodeURIComponent(pendingPrompt)}`)
    }

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    })

    setIsLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    setIsSent(true)
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (!newOpen) {
      setEmail("")
      setIsSent(false)
      setError(null)
      setPendingPrompt(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Sheet.Content>
        <Sheet.Content.Icon name="door-open" />
        <Sheet.Content.Title>Welcome to Doodles</Sheet.Content.Title>
        <Sheet.Content.Description>
          {isSent
            ? "Check your email for a magic link to sign in."
            : "Sign in with your email to save and access your doodles."}
        </Sheet.Content.Description>

        {isSent ? (
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              We sent a magic link to <span className="font-medium">{email}</span>
            </p>
            <Button variant="ghost" onClick={() => setIsSent(false)}>
              Use a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
            />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button type="submit" loading={isLoading} disabled={isLoading || !email.trim()}>
              Send Magic Link
            </Button>
          </form>
        )}
      </Sheet.Content>
    </Sheet>
  )
}

export { LoginSheet, useLoginSheet }
