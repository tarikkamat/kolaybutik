<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class RetrieveProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'productReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ];
    }
}

