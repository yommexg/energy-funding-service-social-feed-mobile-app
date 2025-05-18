export interface Post {
  id: string;
  influencer_id: string;
  influencer_name: string;
  influencer_pic: string;
  post_content: string;
  post_type: "text" | "image" | "video";
  media_url?: string;
  created_at: string;
  hashtags: string[];
  likes_count: number;
}
