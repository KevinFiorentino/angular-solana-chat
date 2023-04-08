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
    },
    {
      "name": "updateMessage",
      "accounts": [
        {
          "name": "message",
          "isMut": true,
          "isSigner": false
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
    },
    {
      "name": "deleteMessage",
      "accounts": [
        {
          "name": "message",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
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
    "address": "AH5pQMYm4HzbMfw6CTbWS1rVFHgGpKKz53qQPH7a7pZ3"
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
    },
    {
      "name": "updateMessage",
      "accounts": [
        {
          "name": "message",
          "isMut": true,
          "isSigner": false
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
    },
    {
      "name": "deleteMessage",
      "accounts": [
        {
          "name": "message",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
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
    "address": "AH5pQMYm4HzbMfw6CTbWS1rVFHgGpKKz53qQPH7a7pZ3"
  }
};



/*

1. 7PTHeLBQNpZTr72sTWHcL1ZLpcrhcnLf2rSqmEN2pGWG
2. HVGvQSXwVwRZqYHoBEHCfVC1HNhgE7BDa2w5vmUmrXQL
3. AH5pQMYm4HzbMfw6CTbWS1rVFHgGpKKz53qQPH7a7pZ3

*/
