// Solana IDL = Interface Description Language
// Ethereum ABI = Application Binary Interface

export type SolanaChat = {
  "version": "0.1.0",
  "name": "solana_chat",
  "instructions": [
    {
      "name": "createMessage",
      "accounts": [
        {
          "name": "message",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "text",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "message",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "text",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "metadata": {
    "address": "7PTHeLBQNpZTr72sTWHcL1ZLpcrhcnLf2rSqmEN2pGWG"
  }
};

export const IDL: SolanaChat = {
  "version": "0.1.0",
  "name": "solana_chat",
  "instructions": [
    {
      "name": "createMessage",
      "accounts": [
        {
          "name": "message",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "text",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "message",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "text",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "metadata": {
    "address": "7PTHeLBQNpZTr72sTWHcL1ZLpcrhcnLf2rSqmEN2pGWG"
  }
};
