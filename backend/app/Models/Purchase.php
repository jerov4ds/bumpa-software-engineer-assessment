<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'currency',
        'status',
        'cashback_amount',
        'payment_method',
        'transaction_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'cashback_amount' => 'decimal:2',
    ];

    /**
     * Get the user that made this purchase.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

