<?php

namespace App\Services;

use App\Models\Purchase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    private string $provider;
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->provider = config('services.payment.provider', 'mock');
        $this->apiKey = config('services.payment.api_key', '');
        $this->baseUrl = config('services.payment.base_url', '');
    }

    /**
     * Process cashback payment for a purchase.
     */
    public function processCashback(Purchase $purchase): bool
    {
        if ($this->provider === 'mock') {
            return $this->processMockCashback($purchase);
        }

        if ($this->provider === 'paystack') {
            return $this->processPaystackCashback($purchase);
        }

        if ($this->provider === 'flutterwave') {
            return $this->processFlutterwaveCashback($purchase);
        }

        return false;
    }

    /**
     * Process mock cashback (for testing).
     */
    private function processMockCashback(Purchase $purchase): bool
    {
        try {
            // Simulate API call delay
            usleep(100000);

            // 95% success rate for demo purposes
            $success = rand(1, 100) <= 95;

            if ($success) {
                Log::info('Mock cashback processed', [
                    'purchase_id' => $purchase->id,
                    'amount' => $purchase->cashback_amount,
                ]);
            } else {
                Log::warning('Mock cashback failed', [
                    'purchase_id' => $purchase->id,
                ]);
            }

            return $success;
        } catch (\Exception $e) {
            Log::error('Mock cashback error', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Process Paystack cashback.
     */
    private function processPaystackCashback(Purchase $purchase): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transfer', [
                'source' => 'balance',
                'amount' => (int) ($purchase->cashback_amount * 100), // Paystack uses kobo
                'recipient' => $purchase->user->email,
                'reason' => 'Loyalty Program Cashback',
                'reference' => 'cashback_' . $purchase->id,
            ]);

            if ($response->successful()) {
                Log::info('Paystack cashback processed', [
                    'purchase_id' => $purchase->id,
                    'response' => $response->json(),
                ]);
                return true;
            }

            Log::warning('Paystack cashback failed', [
                'purchase_id' => $purchase->id,
                'response' => $response->json(),
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('Paystack cashback error', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Process Flutterwave cashback.
     */
    private function processFlutterwaveCashback(Purchase $purchase): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transfers', [
                'account_bank' => $purchase->user->bank_code ?? '044', // Default to Access Bank
                'account_number' => $purchase->user->account_number ?? '',
                'amount' => $purchase->cashback_amount,
                'narration' => 'Loyalty Program Cashback',
                'currency' => $purchase->currency,
                'reference' => 'cashback_' . $purchase->id,
            ]);

            if ($response->successful()) {
                Log::info('Flutterwave cashback processed', [
                    'purchase_id' => $purchase->id,
                    'response' => $response->json(),
                ]);
                return true;
            }

            Log::warning('Flutterwave cashback failed', [
                'purchase_id' => $purchase->id,
                'response' => $response->json(),
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('Flutterwave cashback error', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Verify payment status.
     */
    public function verifyPayment(string $reference): array
    {
        if ($this->provider === 'paystack') {
            return $this->verifyPaystackPayment($reference);
        }

        if ($this->provider === 'flutterwave') {
            return $this->verifyFlutterwavePayment($reference);
        }

        return ['status' => 'unknown'];
    }

    /**
     * Verify Paystack payment.
     */
    private function verifyPaystackPayment(string $reference): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/transaction/verify/' . $reference);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Paystack verification error', ['error' => $e->getMessage()]);
            return ['status' => 'error'];
        }
    }

    /**
     * Verify Flutterwave payment.
     */
    private function verifyFlutterwavePayment(string $reference): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/transactions/' . $reference . '/verify');

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Flutterwave verification error', ['error' => $e->getMessage()]);
            return ['status' => 'error'];
        }
    }
}

