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

  it('toggles video likes and increments/decrements like counts accurately', () => {
    const videos = DataStore.getVideos();
    const vid = videos[0];
    const initialLikes = vid.likes_count;

    const likeResult = DataStore.toggleLikeVideo(vid.id);
    expect(likeResult.isLiked).toBe(true);
    expect(likeResult.likesCount).toBe(initialLikes + 1);

    const unlikeResult = DataStore.toggleLikeVideo(vid.id);
    expect(unlikeResult.isLiked).toBe(false);
    expect(unlikeResult.likesCount).toBe(initialLikes);
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
});
