<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriptionCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subscriptionReferenceCode' => 'required|string|max:255',
            'cardHolderName' => 'required|string|max:255',
            'cardNumber' => 'required|string|max:19',
            'cardExpiry' => 'required|string|regex:/^\d{2}\/\d{2}$/',
            'cardCvc' => 'required|string|max:4',
            'conversationId' => 'nullable|string|max:255',
        ];
    }
}

