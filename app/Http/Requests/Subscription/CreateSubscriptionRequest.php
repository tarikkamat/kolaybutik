<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class CreateSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pricingPlanReferenceCode' => 'required|string|max:255',
            'customerReferenceCode' => 'nullable|string|max:255',
            'customerEmail' => 'required|email|max:255',
            'customerName' => 'required|string|max:255',
            'customerSurname' => 'nullable|string|max:255',
            'customerGsmNumber' => 'nullable|string|max:20',
            'customerIdentityNumber' => 'nullable|string|max:11',
            'customerCity' => 'nullable|string|max:100',
            'customerCountry' => 'nullable|string|max:100',
            'customerZipCode' => 'nullable|string|max:20',
            'customerAddress' => 'nullable|string|max:500',
            'cardHolderName' => 'required|string|max:255',
            'cardNumber' => 'required|string|max:19',
            'cardExpiry' => 'required|string|regex:/^\d{2}\/\d{2}$/',
            'cardCvc' => 'required|string|max:4',
            'conversationId' => 'nullable|string|max:255',
        ];
    }
}

