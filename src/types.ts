export type ChatResponse = {
  output: string
  image_generation_prompt: string
  turn_number: number
  user_accusation: string | null
  is_solved: boolean
  game_over: boolean
  turns_remaining: number
  // n8n attaches this on the outer wrapper; sendChat merges it in. Used to
  // fetch per-turn chat token usage from the execution-detail endpoint.
  execution_id?: string
}
