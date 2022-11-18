// libraries
use anchor_lang::prelude::*;
// use anchor_lang::{ 
//   solana_program::{
//     // instruction::{AccountMeta, Instruction},
//     // program::invoke,
//     // borsh::{
//     //     try_from_slice_unchecked
//     // }
//   }
// };
// use borsh::{ BorshDeserialize };
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::{constants::*, states::*, error::*};
// use raydium_contract_instructions::amm_instruction::{
//   // AmmInstruction,
//   // SwapInstructionBaseIn,
//   swap_base_in
// };

pub fn handler(
    ctx: Context<SwapSolToToken>, 
    swap_amount: u64,
    // tokenamount_per_sol: u64,
    // slippage_bips: u64,
    platform_fee_bips: u64
) -> Result<()> {
    let accts = ctx.accounts;

    if !accts.botrole.addresses.contains(&accts.authority.key()) {
      return Err(CustomError::NotAllowedAuthority.into());
    }

    let gas_fee = 5000;
    // let mut real_swap_amount = swap_amount.checked_sub(gas_fee).unwrap();

    let fee = platform_fee_bips
      .checked_mul(swap_amount)
      .unwrap()
      .checked_div(10000)
      .unwrap()
      .checked_add(gas_fee)
      .unwrap();

    token::transfer(accts.collect_fee_wsol_token(), fee).ok();
    
    // real_swap_amount = real_swap_amount.checked_sub(fee).unwrap();

    // let amount_out_min = real_swap_amount
    //     .checked_mul(tokenamount_per_sol)
    //     .unwrap()
    //     .checked_mul(10000u64.checked_sub(slippage_bips).unwrap())
    //     .unwrap()
    //     .checked_mul(10u64.pow(accts.out_mint.decimals.into()))
    //     .unwrap()
    //     .checked_div(10u64.pow(22))
    //     .unwrap();


  //   let swap_ix = swap_base_in(
  //     &accts.raydium_amm_program.key(),
  //     &accts.amm_id.key(),
  //     &accts.amm_authority.key(),
  //     &accts.amm_open_orders.key(),
  //     &accts.amm_target_orders.key(),

  //     &accts.pool_coin_token_account.key(),
  //     &accts.pool_pc_token_account.key(),
  //     &accts.serum_program.key(),
  //     &accts.serum_market.key(),
  //     &accts.serum_bids.key(),
  //     &accts.serum_asks.key(),
  //     &accts.serum_event_queue.key(),

  //     &accts.serum_coin_vault.key(),
  //     &accts.serum_pc_vault.key(),
  //     &accts.serum_vault_signer.key(),
  //     &accts.uer_source_token_account.key(),
  //     &accts.uer_destination_token_account.key(),
  //     &accts.authority.key(),
  //     real_swap_amount,
  //     amount_out_min,
  // )?;

  // invoke(
  //     &swap_ix,
  //     &[
  //         accts.token_program.to_account_info(),
  //         accts.amm_id.to_account_info(),
  //         accts.amm_authority.to_account_info(),
  //         accts.amm_open_orders.to_account_info(),
  //         accts.amm_target_orders.to_account_info(),
  //         accts.pool_coin_token_account.to_account_info(),
  //         accts.pool_pc_token_account.to_account_info(),
          
  //         accts.serum_program.to_account_info(),
  //         accts.serum_market.to_account_info(),
  //         accts.serum_bids.to_account_info(),
  //         accts.serum_asks.to_account_info(),
  //         accts.serum_event_queue.to_account_info(),
  //         accts.serum_coin_vault.to_account_info(),
  //         accts.serum_pc_vault.to_account_info(),
  //         accts.serum_vault_signer.to_account_info(),

  //         accts.uer_source_token_account.to_account_info(),
  //         accts.uer_destination_token_account.to_account_info(),
  //         accts.authority.to_account_info(),
  //     ],
  // )?;

    Ok(())
}

impl<'info> SwapSolToToken<'info> {
  fn collect_fee_wsol_token(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
      CpiContext::new(
          self.token_program.to_account_info(),
          Transfer {
              from: self.uer_source_token_account.to_account_info(),
              to: self.pool.to_account_info(),
              authority: self.authority.to_account_info(),
          },
      )
  }
}

#[derive(Accounts)]
pub struct SwapSolToToken<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
      mut,
      seeds = [POOL_SEED],
      bump,
    )]
    pub pool: Account<'info, TokenAccount>, 

    #[account(
      mut,
    )]
    pub botrole: Account<'info, BotRole>, 

    // #[account(
    //     mut, 
    //     constraint = pool_coin_token_account.mint == wsol_mint.key()
    // )]
    // pub pool_coin_token_account: Box<Account<'info, TokenAccount>>,
    
    // #[account(
    //     mut,
    //     constraint = pool_pc_token_account.mint == out_mint.key()
    // )]
    // pub pool_pc_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        associated_token::authority = authority, 
        associated_token::mint = wsol_mint
    )]
    pub uer_source_token_account: Box<Account<'info, TokenAccount>>,

    // #[account(
    //     mut, 
    //     associated_token::authority = authority, 
    //     associated_token::mint = out_mint
    // )]
    // pub uer_destination_token_account: Box<Account<'info, TokenAccount>>,
    
    #[account(mut)]
    pub wsol_mint: Box<Account<'info, Mint>>,

    // #[account(mut)]
    // pub out_mint: Box<Account<'info, Mint>>,

    
    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub amm_id: AccountInfo<'info>,
    // /// CHECK: raydium will check
    // pub amm_authority: AccountInfo<'info>,
    // /// CHECK: raydium will check
    // #[account(mut)]
    // pub amm_open_orders: AccountInfo<'info>,

    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub amm_target_orders: AccountInfo<'info>,
    
    // /// CHECK: raydium will check
    // pub serum_program: AccountInfo<'info>,
    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub serum_market: AccountInfo<'info>,

    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub serum_bids: AccountInfo<'info>,
    
    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub serum_asks: AccountInfo<'info>,
    
    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub serum_event_queue: AccountInfo<'info>,
    
    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub serum_coin_vault: AccountInfo<'info>,
    
    // #[account(mut)]
    // /// CHECK: raydium will check
    // pub serum_pc_vault: AccountInfo<'info>,

    // /// CHECK: raydium will check
    // pub serum_vault_signer: AccountInfo<'info>,
    
    /// CHECK: raydium will check
    // pub raydium_amm_program: AccountInfo<'info>,
    pub token_program: Program<'info, Token>
}