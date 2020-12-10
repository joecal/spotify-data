import { ExternalUrl, Followers, Image } from './spotify-api.model';

export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  external_urls: ExternalUrl;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}
