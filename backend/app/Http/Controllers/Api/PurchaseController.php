<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function __construct(
        private LoyaltyService $loyaltyService,
    ) {}

    /**
     * Record a new purchase.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0.01',
            'transaction_id' => 'required|unique:purchases,transaction_id',
            'payment_method' => 'nullable|string',
            'currency' => 'nullable|string|default:USD',
        ]);

        $user = User::findOrFail($validated['user_id']);

        $purchase = $this->loyaltyService->recordPurchase(
            $user,
            $validated['amount'],
            $validated['transaction_id'],
            $validated['payment_method'] ?? null,
            $validated['currency'] ?? 'USD'
        );

        return response()->json([
            'success' => true,
            'message' => 'Purchase recorded successfully',
            'data' => [
                'id' => $purchase->id,
                'user_id' => $purchase->user_id,
                'amount' => (float) $purchase->amount,
                'cashback_amount' => (float) $purchase->cashback_amount,
                'status' => $purchase->status,
                'transaction_id' => $purchase->transaction_id,
                'created_at' => $purchase->created_at,
            ],
        ], 201);
    }
}

