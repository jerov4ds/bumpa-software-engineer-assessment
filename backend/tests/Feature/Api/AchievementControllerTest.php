<?php

namespace Tests\Feature\Api;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AchievementControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_user_achievements(): void
    {
        $user = User::factory()->create();
        $achievement = Achievement::factory()->create();
        
        $user->achievements()->attach($achievement->id, [
            'unlocked_at' => now(),
        ]);

        $response = $this->getJson("/api/v1/users/{$user->id}/achievements");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'count' => 1,
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'description', 'points', 'type', 'unlocked_at'],
                ],
            ]);
    }

    public function test_get_user_summary(): void
    {
        $user = User::factory()->create();
        $achievement = Achievement::factory()->create(['points' => 10]);
        $badge = Badge::factory()->create();
        
        $user->achievements()->attach($achievement->id, ['unlocked_at' => now()]);
        $user->badges()->attach($badge->id, ['earned_at' => now()]);

        $response = $this->getJson("/api/v1/users/{$user->id}/summary");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user_id' => $user->id,
                    'achievements_count' => 1,
                    'badges_count' => 1,
                ],
            ]);
    }

    public function test_get_user_achievements_empty(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/v1/users/{$user->id}/achievements");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'count' => 0,
                'data' => [],
            ]);
    }
}

