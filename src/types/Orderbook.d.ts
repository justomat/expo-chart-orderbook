export interface Message {
  type: string
  connection_id: string
  message_id: number
  channel: string
  id: string
  contents: {
    bids: Order[]
    asks: Order[]
  }
}

export interface Order {
  price: string
  offset: string
  size: string
}
