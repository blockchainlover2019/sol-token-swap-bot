use crate::{constants::*, states::*};
use anchor_lang::prelude::*;

use anchor_spl::{
  token::{self, Mint, Token, TokenAccount, Transfer},
};


#[derive(Accounts)]
pub struct WithdrawPlatformFee<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
      seeds = [SETTINGS_SEED],
      bump,
      has_one = admin,
    )]
    pub settings: Box<Account<'info, Settings>>,

    #[account(
      mut,
      seeds = [POOL_SEED],
      bump
    )]
    pub pool: Account<'info, TokenAccount>, 

    #[account(
      mut, 
      associated_token::authority = admin,
      associated_token::mint = wsol_mint
    )]
    pub user_wsol_ata: Box<Account<'info, TokenAccount>>,

    pub wsol_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<WithdrawPlatformFee>) -> Result<()> {
    let accts = ctx.accounts;
    let signer_seeds: &[&[&[u8]]] = &[&[POOL_SEED.as_ref(), &[*ctx.bumps.get("pool").unwrap()]]];
    token::transfer(
      CpiContext::new_with_signer(
        accts.token_program.to_account_info(),
        Transfer {
            from: accts.pool.to_account_info(),
            to: accts.user_wsol_ata.to_account_info(),
            authority: accts.pool.to_account_info(),
        },
        signer_seeds
      ),
      accts.pool.amount
    ).ok();
    Ok(())
}
