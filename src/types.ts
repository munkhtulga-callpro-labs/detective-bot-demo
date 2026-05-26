export type ChatResponse = {
  output: string
  image_generation_prompt: string
  turn_number: number
  user_accusation: string | null
  is_solved: boolean
  game_over: boolean
  turns_remaining: number
}
