<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class CreatePaymentPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'productReferenceCode' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'currencyCode' => 'nullable|string|max:3',
            'paymentInterval' => 'required|string|in:DAILY,WEEKLY,MONTHLY,YEARLY',
            'paymentIntervalCount' => 'nullable|integer|min:1',
            'trialPeriodDays' => 'nullable|integer|min:0',
            'planPaymentType' => 'nullable|string|in:RECURRING,ONE_TIME',
            'recurrenceCount' => 'nullable|integer|min:1',
            'conversationId' => 'nullable|string|max:255',
        ];
    }
}

