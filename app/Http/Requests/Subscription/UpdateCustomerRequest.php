<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customerReferenceCode' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'surname' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'gsmNumber' => 'nullable|string|max:20',
            'identityNumber' => 'nullable|string|max:11',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'zipCode' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'conversationId' => 'nullable|string|max:255',
        ];
    }
}

