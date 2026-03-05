<?php

namespace App\Http\Requests\Payment;

class SavedCardPaymentRequest extends BasePaymentRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->commonRules(), [
            'card_token' => 'required|string',
            'card_user_key' => 'required|string',
            'card_cvv' => 'nullable|string|max:4',
            'card_name' => 'nullable|string|max:255',
            'installment' => 'nullable|integer|min:1',
        ]);
    }
}
