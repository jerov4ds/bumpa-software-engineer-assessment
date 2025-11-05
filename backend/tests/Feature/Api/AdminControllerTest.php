<?php

namespace Tests\Feature\Api;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_all_users_achievements(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $achievement = Achievement::factory()->create();
        $user1->achievements()->attach($achievement->id, ['unlocked_at' => now()]);

        $response = $this->getJson('/api/v1/admin/users/achievements');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'count' => 2,
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'total_achievements', 'current_badge', 'badges_count'],
                ],
            ]);
    }

    public function test_get_user_achievements_admin(): void
    {
        $user = User::factory()->create();
        $achievement = Achievement::factory()->create();
        $badge = Badge::factory()->create();
        
        $user->achievements()->attach($achievement->id, ['unlocked_at' => now()]);
        $user->badges()->attach($badge->id, ['earned_at' => now()]);

        $response = $this->getJson("/api/v1/admin/users/{$user->id}/achievements");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_list_achievements(): void
    {
        Achievement::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/admin/achievements');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'count' => 3,
            ]);
    }

    public function test_create_achievement(): void
    {
        $response = $this->postJson('/api/v1/admin/achievements', [
            'name' => 'First Purchase',
            'description' => 'Make your first purchase',
            'icon' => '🎉',
            'points' => 10,
            'type' => 'purchase_milestone',
            'criteria' => ['min_purchases' => 1],
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Achievement created successfully',
                'data' => [
                    'name' => 'First Purchase',
                    'points' => 10,
                ],
            ]);
    }

    public function test_list_badges(): void
    {
        Badge::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/admin/badges');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'count' => 2,
            ]);
    }

    public function test_create_badge(): void
    {
        $response = $this->postJson('/api/v1/admin/badges', [
            'name' => 'Bronze Badge',
            'description' => 'Earn 5 achievements',
            'icon' => '🥉',
            'level' => 1,
            'required_achievements' => 5,
            'required_points' => 50,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Badge created successfully',
                'data' => [
                    'name' => 'Bronze Badge',
                    'level' => 1,
                ],
            ]);
    }
}

