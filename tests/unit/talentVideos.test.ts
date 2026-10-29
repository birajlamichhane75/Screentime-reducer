import { describe, it, expect, beforeEach } from 'vitest';
import { DataStore } from '../../services/dataStore';

describe('Talent Videos & Discovery Engine', () => {
  beforeEach(() => {
    // Reset DataStore state in tests
    DataStore.setCurrentUserId('usr-student-001');
  });

  it('retrieves predefined talent categories and allows adding custom categories', () => {
    const categories = DataStore.getCategories();
    expect(categories).toContain('All');
    expect(categories).toContain('Music');
    expect(categories).toContain('Dance');
    expect(categories).toContain('Coding');

    const updated = DataStore.addCategory('Beatboxing');
    expect(updated).toContain('Beatboxing');
    expect(DataStore.getCategories()).toContain('Beatboxing');
  });

  it('retrieves talent videos and supports adding new videos', () => {
    const initialVideos = DataStore.getVideos();
    expect(initialVideos.length).toBeGreaterThan(0);

    const firstVid = initialVideos[0];
    expect(firstVid).toHaveProperty('caption');
    expect(firstVid).toHaveProperty('category');
    expect(firstVid).toHaveProperty('video_url');

    const newVideo = DataStore.addVideo({
      creator_id: 'usr-student-001',
      caption: 'Testing frontside kickflip 🛹',
      category: 'Sports',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600&auto=format&fit=crop&q=80',
    });

    expect(newVideo.caption).toBe('Testing frontside kickflip 🛹');
    expect(newVideo.category).toBe('Sports');

    const fetched = DataStore.getVideoById(newVideo.id);
    expect(fetched).toBeDefined();
    expect(fetched?.caption).toBe('Testing frontside kickflip 🛹');
  });

  it('allows organizations to select/save work and dispatches email notification to user email', () => {
    const orgId = 'usr-org-001';
    const orgName = 'Creative Arts University';
    const videoId = 'vid-01';

    // Organization selects work
    const selection = DataStore.selectWork({
      orgId,
      orgName,
      videoId,
      notes: 'Exceptional technique and musicality!',
    });

    expect(selection.selected).toBe(true);
    expect(selection.emailSent).toBeDefined();
    expect(selection.emailSent?.recipient_email).toBe('sarah@dance.skillbridge.dev');
    expect(selection.emailSent?.org_name).toBe(orgName);
    expect(selection.emailSent?.subject).toContain('Creative Arts University selected your work');
    expect(selection.emailSent?.status).toBe('delivered');

    // Confirm work is now marked selected
    expect(DataStore.isWorkSelected(orgId, videoId)).toBe(true);

    // Confirm creator received an in-app notification
    const creatorNotifs = DataStore.getNotifications('usr-student-001');
    expect(
      creatorNotifs.some(
        (n) =>
          n.title.includes('selected your work') &&
          n.message.includes('sarah@dance.skillbridge.dev')
      )
    ).toBe(true);

    // Confirm email appears in creator's email inbox query
    const emails = DataStore.getEmailsForUser('sarah@dance.skillbridge.dev');
    expect(emails.some((e) => e.work_id === videoId)).toBe(true);
  });

  it('allows toggling work selection on and off for organizations', () => {
    const orgId = 'usr-org-001';
    const orgName = 'Apex Tech Guild';
    const videoId = 'vid-02';

    // Select
    const firstSelect = DataStore.selectWork({ orgId, orgName, videoId });
    expect(firstSelect.selected).toBe(true);
    expect(DataStore.isWorkSelected(orgId, videoId)).toBe(true);

    // Toggle off (unselect)
    const secondSelect = DataStore.selectWork({ orgId, orgName, videoId });
    expect(secondSelect.selected).toBe(false);
    expect(DataStore.isWorkSelected(orgId, videoId)).toBe(false);
  });

  it('allows organizations to bookmark/save talent and remove them', () => {
    const orgId = 'usr-org-001';
    const creatorId = 'usr-student-001';

    const initiallySaved = DataStore.isCreatorSaved(orgId, creatorId);

    // Toggle save
    const toggleResult = DataStore.toggleSaveCreator(orgId, creatorId);
    expect(toggleResult).toBe(!initiallySaved);

    // Verify in saved list
    const savedList = DataStore.getSavedCreators(orgId);
    if (toggleResult) {
      expect(savedList.some((s) => s.creator_id === creatorId)).toBe(true);
    } else {
      expect(savedList.some((s) => s.creator_id === creatorId)).toBe(false);
    }
  });

  it('sends contact/opportunity requests from organizations to creators', () => {
    const req = DataStore.sendContactRequest({
      org_id: 'usr-org-001',
      org_name: 'Creative Arts University',
      creator_id: 'usr-student-001',
      opportunity_title: 'Campus Spring Festival Solo',
      message: 'We would love to invite you to perform!',
    });

    expect(req).toBeDefined();
    expect(req.opportunity_title).toBe('Campus Spring Festival Solo');
    expect(req.status).toBe('pending');

    const creatorRequests = DataStore.getContactRequests('usr-student-001');
    expect(creatorRequests.some((r) => r.id === req.id)).toBe(true);

    const creatorNotifs = DataStore.getNotifications('usr-student-001');
    expect(
      creatorNotifs.some((n) => n.title.includes('Creative Arts University sent you an opportunity'))
    ).toBe(true);
  });

  it('calculates creator consistency rating and checkpoints based on daily upload intervals', () => {
    // Sarah (usr-student-001) has uploaded daily and has top Platinum tier (95-100)
    const sarahRating = DataStore.getCreatorRating('usr-student-001');
    expect(sarahRating.score).toBeGreaterThanOrEqual(95);
    expect(sarahRating.tier).toBe('Platinum');
    expect(sarahRating.checkpoint.title).toBe('Platinum');
    expect(sarahRating.is_daily_active).toBe(true);

    // Rare uploader (usr-student-007) has infrequent uploads
    const rareRating = DataStore.getCreatorRating('usr-student-007');
    expect(rareRating.score).toBeLessThanOrEqual(75);
    expect(rareRating.tier).toMatch(/Silver|Bronze/);
  });

  it('boosts creator rating to Platinum (98) when uploading daily craft', () => {
    // Mike (usr-student-003) uploads new craft today
    const newCraft = DataStore.addVideo({
      creator_id: 'usr-student-003',
      caption: 'Daily morning soccer freestyle practice ⚽',
      category: 'Sports',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    });

    expect(newCraft.creator.consistency_rating).toBe(98);
    expect(newCraft.creator.rating_checkpoint).toBe('Platinum');

    const updatedRating = DataStore.getCreatorRating('usr-student-003');
    expect(updatedRating.score).toBeGreaterThanOrEqual(95);
    expect(updatedRating.tier).toBe('Platinum');
    expect(updatedRating.is_daily_active).toBe(true);
  });

  it('ranks high-rated creators at the very top of specific category searches for organizations', () => {
    // Query category "Music" which has Sarah (Rating 98) and Emma (Rating 74)
    const musicVideos = DataStore.getVideos('Music', true);
    expect(musicVideos.length).toBeGreaterThanOrEqual(2);

    // The top ranked video in Music MUST have creator consistency rating >= following videos
    const firstVid = musicVideos[0];
    const secondVid = musicVideos[1];

    const firstRating = firstVid.creator.consistency_rating ?? 0;
    const secondRating = secondVid.creator.consistency_rating ?? 0;

    expect(firstRating).toBeGreaterThanOrEqual(secondRating);
    expect(firstVid.creator.rating_checkpoint).toBe('Platinum');
    expect(firstVid.creator_id).toBe('usr-student-001'); // Sarah Music at the very top of Music
  });

  it('manages available creator rewards based on creative work and tracks reward history', () => {
    // Sarah has Platinum rating (98)
    const sarahRewards = DataStore.getCreatorRewards('usr-student-001');
    expect(sarahRewards.length).toBeGreaterThanOrEqual(4);

    const gearGrant = sarahRewards.find((r) => r.id === 'rew-grant-01');
    expect(gearGrant).toBeDefined();
    expect(gearGrant?.status).toBe('unlocked');
    expect(gearGrant?.requiredTier).toBe('Platinum');

    // Claim reward
    const claimRes = DataStore.claimCreatorReward('usr-student-001', 'rew-grant-01');
    expect(claimRes.success).toBe(true);
    expect(claimRes.reward?.status).toBe('claimed');
    expect(claimRes.reward?.claimCode).toMatch(/^SKILL-/);

    // Verify it was logged into reward history
    const history = DataStore.getRewardEvents('usr-student-001');
    expect(
      history.some((h) => h.event_type === 'reward_claimed' && h.reference_id === 'rew-grant-01')
    ).toBe(true);

    // Verify locked reward behavior for user with lower rating
    const lowTierRewards = DataStore.getCreatorRewards('usr-student-007');
    const lockedGrant = lowTierRewards.find((r) => r.id === 'rew-grant-01');
    expect(lockedGrant?.status).toBe('locked');
  });
});
