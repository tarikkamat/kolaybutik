<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pricingPlanReferenceCode' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'trialPeriodDays' => 'nullable|integer|min:0',
            'conversationId' => 'nullable|string|max:255',
        ];
    }
}

