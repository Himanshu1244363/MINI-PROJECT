import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiCreditCard, FiMapPin, FiPackage, FiLock } from 'react-icons/fi'
import { createOrder } from '../store/slices/orderSlice'
import { clearCart, selectCartTotal } from '../store/slices/cartSlice'
import { formatPrice } from '../utils/helpers'

const STEPS = ['Address', 'Payment', 'Review']

export default function Checkout() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { items } = useSelector(s => s.cart)
  const totals    = useSelector(selectCartTotal)
  const { isLoading } = useSelector(s => s.order)

  const [step, setStep] = useState(0)
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '', phone: '', country: 'India' })
  const [payMethod, setPayMethod] = useState('cod')

  const handleAddress = (e) => { e.preventDefault(); setStep(1) }
  const handlePayment = (e) => { e.preventDefault(); setStep(2) }

  const handlePlaceOrder = async () => {
    const orderItems = items.map(i => ({
      product:  i._id,
      name:     i.name,
      image:    i.images?.[0]?.url || '',
      price:    i.price,
      quantity: i.quantity,
    }))

    const result = await dispatch(createOrder({
      orderItems,
      shippingAddress: address,
      paymentMethod: payMethod,
    }))

    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart())
      navigate(`/order-success/${result.payload._id}`)
    }
  }

  return (
    <div className="page-container py-10 max-w-4xl">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Progress steps */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-card text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200 dark:bg-dark-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <form onSubmit={handleAddress} className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="text-primary-500" />
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Delivery Address</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'street',  label: 'Street Address', placeholder: '123 Main Street', full: true },
                  { key: 'city',    label: 'City',           placeholder: 'Mumbai' },
                  { key: 'state',   label: 'State',          placeholder: 'Maharashtra' },
                  { key: 'pincode', label: 'PIN Code',       placeholder: '400001' },
                  { key: 'phone',   label: 'Phone Number',   placeholder: '9876543210' },
                  { key: 'country', label: 'Country',        placeholder: 'India' },
                ].map(({ key, label, placeholder, full }) => (
                  <div key={key} className={full ? 'sm:col-span-2' : ''}>
                    <label className="label">{label}</label>
                    <input required value={address[key]} onChange={e => setAddress({ ...address, [key]: e.target.value })}
                      placeholder={placeholder} className="input" />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary w-full py-3">Continue to Payment →</button>
            </form>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <form onSubmit={handlePayment} className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FiCreditCard className="text-primary-500" />
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Payment Method</h2>
              </div>
              {[
                { value: 'cod',      label: 'Cash on Delivery',         icon: '💵', desc: 'Pay when your order arrives' },
                { value: 'razorpay', label: 'Pay with Razorpay',        icon: '⚡', desc: 'Cards, UPI, Net Banking & more' },
                { value: 'stripe',   label: 'Pay with Card (Stripe)',    icon: '💳', desc: 'International cards accepted' },
              ].map(({ value, label, icon, desc }) => (
                <label key={value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === value ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-100 dark:border-dark-border hover:border-gray-300'}`}>
                  <input type="radio" value={value} checked={payMethod === value} onChange={() => setPayMethod(value)} className="accent-primary-500" />
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                <button type="submit" className="btn-primary flex-1 py-3">Review Order →</button>
              </div>
            </form>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <FiPackage className="text-primary-500" />
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Review Order</h2>
              </div>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-3 text-sm">
                    <img src={item.images?.[0]?.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-card rounded-xl text-sm space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">📍 Delivering to</p>
                <p className="text-gray-600 dark:text-gray-400">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                <p className="text-gray-600 dark:text-gray-400">📞 {address.phone}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                <button onClick={handlePlaceOrder} disabled={isLoading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  <FiLock size={15} />
                  {isLoading ? 'Placing Order…' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="card p-5 h-fit sticky top-20 space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white">Order Total</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Items ({items.length})</span><span>{formatPrice(totals.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span className={totals.shipping === 0 ? 'text-green-500' : ''}>{totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>GST</span><span>{formatPrice(totals.tax)}</span></div>
            <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100 dark:border-dark-border">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-primary-500">{formatPrice(totals.total)}</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
            <FiLock size={11} /> Secured by SSL encryption
          </p>
        </div>
      </div>
    </div>
  )
}
