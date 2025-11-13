<?php

namespace App\Http\Requests\Payment;

class CheckoutFormPaymentRequest extends BasePaymentRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->commonRules(), [
            'token' => 'required|string',
        ]);
    }
}

