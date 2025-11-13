<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

abstract class BasePaymentRequest extends FormRequest
{
    /**
     * Get common validation rules for payment requests
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    protected function commonRules(): array
    {
        return [
            'full_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}

