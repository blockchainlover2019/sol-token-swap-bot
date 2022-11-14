use anchor_lang::prelude::*;
use std::mem::size_of;

use crate::{constants::*, states::*};

use anchor_spl::{
  token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        seeds = [SETTINGS_SEED],
        bump,
        space = 8 + size_of::<Settings>()
    )]
    pub settings: Box<Account<'info, Settings>>,
    
    #[account(
        init,
        payer = admin,
        seeds = [BOTROLE_SEED],
        bump,
        space = 8 + size_of::<Pubkey>() * 300
    )]
    pub botrole: Box<Account<'info, BotRole>>,

    #[account(
      init,
      payer = admin,
      seeds = [POOL_SEED],
      bump,
      token::authority = settings, 
      token::mint = wsol_mint,
    )]
    pub pool: Account<'info, TokenAccount>, 

    pub wsol_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> Initialize<'info> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }
}

#[access_control(ctx.accounts.validate())]
pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let accts = ctx.accounts;
    let admin_key = accts.admin.key();
    accts.settings.admin = admin_key;
    accts.botrole.addresses.push(admin_key);
    Ok(())
}
