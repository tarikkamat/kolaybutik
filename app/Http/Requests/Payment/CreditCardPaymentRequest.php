<?php

namespace App\Http\Requests\Payment;

class CreditCardPaymentRequest extends BasePaymentRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->commonRules(), [
            'card_number' => 'required|string|max:19',
            'card_name' => 'required|string|max:255',
            'card_expiry' => 'required|string|max:5',
            'card_cvv' => 'required|string|max:3',
            'use_3d' => 'boolean',
        ]);
    }
}

