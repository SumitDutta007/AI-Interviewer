import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'

function PricingCard({
    title,
    price,
    coins,
    button,
    features,
    popular,
    disabled,
    onBuy,
}) {
    return (
        <div className={`surface-card relative w-full max-w-[320px] overflow-hidden p-6
        ${popular ? "border-blue-200 ring-1 ring-blue-100" : ""}`}>
            {popular && (
                <div className='absolute right-4 top-4 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700'>Popular</div>
            )}
            
            <h2 className='relative text-base font-bold text-slate-950'>{title}</h2>

            <div className='relative mt-2.5 flex items-end gap-1.5'>
                <span className='text-3xl font-bold text-slate-950'>{price}</span>
                {price !== "Free" && (
                   <span className='pb-1 text-xs text-slate-400'>INR</span>
                )}
            </div>

            <div className='relative mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3'>
                <GiTwoCoins className="text-amber-500" size={16}/>
                <span className='text-sm font-semibold text-slate-800'>{coins} Interview Coins</span>
            </div>

            <div className='relative mt-5 space-y-2.5'>
                {features.map((f)=>(
                    <div key={f} className='flex items-center gap-2 text-xs text-slate-600'>
                        <FiCheck className="text-emerald-500 shrink-0" size={13} />
                        <span>{f}</span>
                    </div>
                ))}
            </div>

            <button disabled={disabled}
            onClick={onBuy}
             className={`relative mt-6 h-11 w-full rounded-xl text-sm font-semibold transition
    ${
      disabled
        ? "cursor-not-allowed bg-slate-100 text-slate-400"
        : popular
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "border border-slate-200 text-slate-700 hover:border-slate-300"
    }`}>
        {button}
    </button>
        </div>
    )
}

export default PricingCard
