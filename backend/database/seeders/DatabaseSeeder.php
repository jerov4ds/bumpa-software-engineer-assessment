<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test customer
        $customer = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        // Create achievements
        $achievements = [
            [
                'name' => 'First Purchase',
                'description' => 'Make your first purchase',
                'icon' => '🎉',
                'points' => 10,
                'type' => 'purchase_milestone',
                'criteria' => ['min_purchases' => 1],
            ],
            [
                'name' => 'Big Spender',
                'description' => 'Spend $500 or more',
                'icon' => '💰',
                'points' => 50,
                'type' => 'purchase_milestone',
                'criteria' => ['min_amount' => 500],
            ],
            [
                'name' => 'Loyal Customer',
                'description' => 'Make 10 purchases',
                'icon' => '⭐',
                'points' => 100,
                'type' => 'purchase_milestone',
                'criteria' => ['min_purchases' => 10],
            ],
            [
                'name' => 'VIP Member',
                'description' => 'Earn 500 loyalty points',
                'icon' => '👑',
                'points' => 200,
                'type' => 'engagement',
                'criteria' => ['min_points' => 500],
            ],
        ];

        $createdAchievements = [];
        foreach ($achievements as $achievement) {
            $createdAchievements[] = Achievement::create($achievement);
        }

        // Create badges
        $badges = [
            [
                'name' => 'Bronze Member',
                'description' => 'Unlock 2 achievements',
                'icon' => '🥉',
                'level' => 1,
                'required_achievements' => 2,
                'required_points' => 50,
            ],
            [
                'name' => 'Silver Member',
                'description' => 'Unlock 3 achievements',
                'icon' => '🥈',
                'level' => 2,
                'required_achievements' => 3,
                'required_points' => 150,
            ],
            [
                'name' => 'Gold Member',
                'description' => 'Unlock 4 achievements',
                'icon' => '🥇',
                'level' => 3,
                'required_achievements' => 4,
                'required_points' => 350,
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }

        // Attach some achievements to the customer
        $customer->achievements()->attach(
            $createdAchievements[0]->id,
            ['unlocked_at' => now()->subDays(30)]
        );
        $customer->achievements()->attach(
            $createdAchievements[1]->id,
            ['unlocked_at' => now()->subDays(15)]
        );
        $customer->achievements()->attach(
            $createdAchievements[2]->id,
            ['unlocked_at' => now()->subDays(5)]
        );
    }
}
