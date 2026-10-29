import { describe, it, expect, beforeEach } from 'vitest';
import { DataStore } from '@/services/dataStore';

describe('SkillBridge Integration Lifecycle Flows', () => {
  beforeEach(() => {
    // Reset test user session
    DataStore.setCurrentUserId('usr-student-001');
  });

  it('runs complete focus session workflow and awards eligible achievement points', () => {
    // 1. Start a 30-min session (1800s)
    const session = DataStore.startSession(
      'usr-student-001',
      'hob-01',
      1800,
      'Practice digital rim lighting'
    );
    expect(session.id).toBeDefined();
    expect(session.status).toBe('started');

    // 2. Complete session
    const completion = DataStore.completeSession(
      session.id,
      'Finished 2 value lighting studies',
      'https://example.com/study.jpg'
    );

    expect(completion.session.status).toBe('completed');
    expect(completion.pointsAwarded).toBe(10);

    // 3. Verify reward event added to ledger
    const rewards = DataStore.getRewardEvents('usr-student-001');
    const matchingReward = rewards.find((r) => r.reference_id === session.id);
    expect(matchingReward).toBeDefined();
    expect(matchingReward?.points).toBe(10);
  });

  it('handles project creation and awards project milestone points', () => {
    const proj = DataStore.createProject('usr-student-001', {
      title: 'Procedural Terrain Generator',
      description: 'Built a 3D heightmap generator with webGL shaders.',
      hobby_id: 'hob-02',
      skills_demonstrated: ['React & Next.js', 'TypeScript'],
      visibility: 'public',
      external_url: 'https://demo-terrain.vercel.app',
    });

    expect(proj.id).toBeDefined();

    // Verify +20 pts awarded in ledger
    const rewards = DataStore.getRewardEvents('usr-student-001');
    const projReward = rewards.find((r) => r.reference_id === proj.id);
    expect(projReward).toBeDefined();
    expect(projReward?.points).toBe(20);
  });

  it('prevents duplicate application submissions to the same opportunity', () => {
    const oppId = 'opp-02';

    // First submission succeeds
    const app = DataStore.submitApplication(
      'usr-student-001',
      oppId,
      'Statement of interest for junior frontend apprentice.'
    );
    expect(app.id).toBeDefined();
    expect(app.status).toBe('submitted');

    // Duplicate submission throws error
    expect(() => {
      DataStore.submitApplication(
        'usr-student-001',
        oppId,
        'Duplicate submission attempt.'
      );
    }).toThrow('already applied');
  });
});
