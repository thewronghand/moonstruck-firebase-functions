export interface KakaoProperties {
  nickname?: string;
  profile_image?: string;
  thumbnail_image?: string;
}

export interface KakaoAccount {
  profile?: KakaoProfile;
  name?: string;
  email?: string;
  birthday?: string;
  gender?: 'male' | 'female';
}

export interface KakaoProfile {
  nickname?: string;
  thumbnail_image_url?: string;
  profile_image_url?: string;
  is_default_image?: boolean;
}

export interface KakaoUser {
  id: number;
  connected_at?: string;
  properties?: KakaoProperties;
  kakao_account?: KakaoAccount;
}

export interface UserData {
  uid: string;
  dailyCredits: number;
  lastCreditRefresh: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isNewUser?: boolean;
}
