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
            'saved_card_id' => 'required|string',
        ]);
    }
}

