<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class ThreedsCallbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'paymentId' => 'nullable|string',
            'conversationId' => 'nullable|string',
            'status' => 'nullable|string',
            'mdStatus' => 'nullable|string',
            'conversationData' => 'nullable|string',
        ];
    }
}

