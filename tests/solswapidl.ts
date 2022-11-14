export type Solswap = {
  "version": "0.1.0",
  "name": "solswap",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addBotrole",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addr",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeBotrole",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addr",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "swapSolToToken",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCoinTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolPcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "uerSourceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "uerDestinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammOpenOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammTargetOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumBids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAsks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumEventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumCoinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumPcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumVaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "raydiumAmmProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "swapAmount",
          "type": "u64"
        },
        {
          "name": "tokenamountPerSol",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "platformFeeBips",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawPlatformFee",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userWsolAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "botRole",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "addresses",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "settings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "NotAllowedAuthority",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6002,
      "name": "ZeroAddressDetected",
      "msg": "ZeroAddressDetected"
    }
  ]
};

export const IDL: Solswap = {
  "version": "0.1.0",
  "name": "solswap",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addBotrole",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addr",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeBotrole",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addr",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "swapSolToToken",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "botrole",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCoinTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolPcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "uerSourceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "uerDestinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammOpenOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammTargetOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumBids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAsks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumEventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumCoinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumPcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumVaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "raydiumAmmProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "swapAmount",
          "type": "u64"
        },
        {
          "name": "tokenamountPerSol",
          "type": "u64"
        },
        {
          "name": "slippageBips",
          "type": "u64"
        },
        {
          "name": "platformFeeBips",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawPlatformFee",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "settings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userWsolAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wsolMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "botRole",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "addresses",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "settings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "NotAllowedAuthority",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6002,
      "name": "ZeroAddressDetected",
      "msg": "ZeroAddressDetected"
    }
  ]
};
