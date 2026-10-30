'use client';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { VideoPost, Profile } from '@/types';

// Standard UUID mapping for mock/demo IDs to avoid foreign key type errors in PostgreSQL
const MOCK_TO_UUID_MAP: Record<string, string> = {
  'usr-student-001': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'usr-student-002': 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'usr-student-003': 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'usr-org-001': '11111111-1111-1111-1111-111111111111',
  'org-01': '11111111-1111-1111-1111-111111111111',
  'org-02': '11111111-1111-1111-1111-111111111111',
  'org-03': '11111111-1111-1111-1111-111111111111',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toValidUUID(id: string): string {
  if (UUID_REGEX.test(id)) return id;
  if (MOCK_TO_UUID_MAP[id]) return MOCK_TO_UUID_MAP[id];
  // Deterministic pseudo-UUID from string
  const cleaned = id.replace(/[^a-zA-Z0-9]/g, '').padEnd(32, '0').slice(0, 32);
  return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-4${cleaned.slice(13, 16)}-a${cleaned.slice(17, 20)}-${cleaned.slice(20, 32)}`;
}

export class SupabaseService {
  /**
   * 1. Upload Video File to Supabase Storage Bucket ('videos')
   * Returns the permanent public CDN URL from Supabase.
   */
  static async uploadVideoFile(file: File): Promise<{ url: string; error?: string }> {
    if (!isSupabaseConfigured()) {
      console.warn('[Supabase] Missing Supabase credentials in .env.local, using blob URL.');
      return { url: URL.createObjectURL(file) };
    }

    try {
      const supabase = createClient();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `user_uploads/${Date.now()}_${sanitizedName}`;

      console.log(`[Supabase Storage] Uploading ${file.size} bytes to bucket 'videos' -> ${filePath}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('[Supabase Storage] Upload to bucket error (bucket may need creation in Dashboard):', uploadError.message);
        return {
          url: URL.createObjectURL(file),
          error: uploadError.message,
        };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(uploadData.path);
      const publicUrl = publicUrlData.publicUrl;
      console.log('[Supabase Storage] Successfully generated public video URL:', publicUrl);
      return { url: publicUrl };
    } catch (err: any) {
      console.error('[Supabase Storage] Unexpected upload failure:', err);
      return { url: URL.createObjectURL(file), error: err.message };
    }
  }

  /**
   * 2. Insert Video Post into Supabase Database ('videos' table)
   */
  static async insertVideoPost(video: VideoPost): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const supabase = createClient();
      const creatorUuid = toValidUUID(video.creator_id);
      const videoUuid = toValidUUID(video.id);

      const payload = {
        id: videoUuid,
        creator_id: creatorUuid,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url,
        title: video.title || video.caption.slice(0, 40),
        caption: video.caption,
        category: video.category,
        duration_seconds: video.duration_seconds || 15,
        duration_formatted: video.duration_formatted || '00:15',
        likes_count: video.likes_count ?? 0,
        comments_count: video.comments_count ?? 0,
        shares_count: video.shares_count ?? 0,
        views_count: video.views_count ?? 1,
        created_at: video.created_at || new Date().toISOString(),
      };

      console.log('[Supabase DB] Inserting post into "videos" table:', payload.title);

      const { data, error } = await supabase
        .from('videos')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('[Supabase DB] Failed to insert video into database:', error.message);
        return { success: false, error: error.message };
      }

      console.log('[Supabase DB] Video post saved successfully to Supabase:', data.id);
      return { success: true, data };
    } catch (err: any) {
      console.error('[Supabase DB] Unexpected error saving video to Supabase:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 3. Save / Toggle Organization Selected Work in Supabase ('selected_works' table)
   */
  static async syncWorkSelection(params: {
    orgId: string;
    videoId: string;
    creatorId: string;
    creatorEmail: string;
    workTitle: string;
    workCategory: string;
    notes?: string;
    selected: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: false };

    try {
      const supabase = createClient();
      const orgUuid = toValidUUID(params.orgId);
      const videoUuid = toValidUUID(params.videoId);
      const creatorUuid = toValidUUID(params.creatorId);

      if (params.selected) {
        console.log(`[Supabase DB] Saving selection of work "${params.workTitle}" by org ${params.orgId}`);
        const { error } = await supabase.from('selected_works').upsert({
          org_id: orgUuid,
          video_id: videoUuid,
          creator_id: creatorUuid,
          creator_email: params.creatorEmail,
          work_title: params.workTitle,
          work_category: params.workCategory,
          notes: params.notes || null,
          selected_at: new Date().toISOString(),
        });

        if (error) {
          console.warn('[Supabase DB] Could not write to selected_works table:', error.message);
          return { success: false, error: error.message };
        }
      } else {
        console.log(`[Supabase DB] Removing selection of work ${params.videoId} by org ${params.orgId}`);
        const { error } = await supabase
          .from('selected_works')
          .delete()
          .match({ org_id: orgUuid, video_id: videoUuid });

        if (error) {
          console.warn('[Supabase DB] Could not delete from selected_works table:', error.message);
          return { success: false, error: error.message };
        }
      }

      return { success: true };
    } catch (err: any) {
      console.warn('[Supabase DB] Selection sync notice:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * 4. Toggle Video Like in Supabase ('video_likes' table)
   */
  static async syncVideoLike(videoId: string, userId: string, isLiked: boolean): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      const supabase = createClient();
      const videoUuid = toValidUUID(videoId);
      const userUuid = toValidUUID(userId);

      if (isLiked) {
        await supabase.from('video_likes').upsert({
          video_id: videoUuid,
          user_id: userUuid,
        });
      } else {
        await supabase
          .from('video_likes')
          .delete()
          .match({ video_id: videoUuid, user_id: userUuid });
      }
    } catch (err: any) {
      console.warn('[Supabase DB] Video like sync notice:', err.message);
    }
  }

  /**
   * 5. Save or Upsert Profile in Supabase ('profiles' table)
   */
  static async syncProfile(profile: Profile): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      const supabase = createClient();
      const userUuid = toValidUUID(profile.id);

      await supabase.from('profiles').upsert({
        id: userUuid,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role,
        bio: profile.bio,
        location: profile.location,
        is_verified: profile.is_verified,
        consistency_rating: profile.consistency_rating || 50,
        upload_streak_days: profile.upload_streak_days || 0,
        updated_at: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('[Supabase DB] Profile sync notice:', err.message);
    }
  }
}
